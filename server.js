import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SECRET = process.env.JWT_SECRET || 'change-me';
const db = new Database('nexus.db');
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT);
CREATE TABLE IF NOT EXISTS contacts(id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, company TEXT, title TEXT, stage TEXT DEFAULT 'Lead', arr REAL DEFAULT 0, source TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS pages(id INTEGER PRIMARY KEY, slug TEXT UNIQUE, title TEXT, blocks TEXT, published INT DEFAULT 0);
CREATE TABLE IF NOT EXISTS webinars(id INTEGER PRIMARY KEY, title TEXT, starts_at TEXT, slug TEXT);
CREATE TABLE IF NOT EXISTS registrations(id INTEGER PRIMARY KEY, webinar_id INT, contact_id INT, attended INT DEFAULT 0, UNIQUE(webinar_id, contact_id));
CREATE TABLE IF NOT EXISTS campaigns(id INTEGER PRIMARY KEY, name TEXT, segment TEXT, subject TEXT, status TEXT DEFAULT 'draft', sent INT DEFAULT 0, opens INT DEFAULT 0, clicks INT DEFAULT 0);
CREATE TABLE IF NOT EXISTS plans(id INTEGER PRIMARY KEY, name TEXT, model TEXT, price REAL, unit_price REAL DEFAULT 0, included INT DEFAULT 0);
CREATE TABLE IF NOT EXISTS subscriptions(id INTEGER PRIMARY KEY, contact_id INT, plan_id INT, status TEXT DEFAULT 'active', seats INT DEFAULT 1, usage INT DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS agent_runs(id INTEGER PRIMARY KEY, prompt TEXT, status TEXT, steps TEXT, created_by TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY, ts TEXT, actor TEXT, module TEXT, action TEXT, detail TEXT, prev_hash TEXT, hash TEXT);
CREATE TABLE IF NOT EXISTS invoices(id INTEGER PRIMARY KEY, number TEXT, contact_id INT, amount REAL, status TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS page_views(id INTEGER PRIMARY KEY, page TEXT, ts TEXT);
`);
const all = (s, ...a) => db.prepare(s).all(...a);
const one = (s, ...a) => db.prepare(s).get(...a);
const ex = (s, ...a) => db.prepare(s).run(...a);

if (!one('SELECT 1 x FROM users')) {
  ex('INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)', 'Admin', 'admin@nexus.ai', bcrypt.hashSync('admin123', 10), 'admin');
  [['Starter', 'flat', 49, 0, 0], ['Growth', 'flat', 149, 0, 0], ['Per Seat', 'per_seat', 25, 0, 0], ['AI Usage', 'usage', 0, 0.04, 250]]
    .forEach(p => ex('INSERT INTO plans(name,model,price,unit_price,included) VALUES(?,?,?,?,?)', ...p));
}

// Demo data matching the screens in the UI (only when the DB is empty)
if (!one('SELECT 1 x FROM contacts')) {
  [['Elena Vance', 'elena@apexdynamics.com', 'Apex Dynamics', 'VP Technology', 'Negotiation', 24000, 'Webinar #12 (48 min)'],
   ['Marcus Chen', 'marcus@veritasbio.com', 'Veritas Bio', 'Director Ops', 'Proposal Sent', 14400, 'Website Builder Form'],
   ['Sophia Rodriguez', 'sophia@hyperionmedia.com', 'Hyperion Media', 'Head of Growth', 'Demo Completed', 36000, 'Organic Search'],
   ['Liam Thorne', 'liam@aegissecurity.com', 'Aegis Security', 'CISO', 'Contract Sent', 48000, 'Cold AI Email Outreach']]
    .forEach(c => ex('INSERT INTO contacts(name,email,company,title,stage,arr,source) VALUES(?,?,?,?,?,?,?)', ...c));
  for (let i = 1; i <= 12; i++) // sample top-of-funnel leads (the agent's default audience)
    ex("INSERT INTO contacts(name,email,company,stage,source) VALUES(?,?,?,'Lead','Website Builder Form')", `Sample Lead ${i}`, `lead${i}@example.com`, `Company ${i}`);
  ex('INSERT INTO webinars(title,starts_at,slug) VALUES(?,?,?)', 'Scaling with Autonomous Business OS', new Date(Date.now() + 864e5).toISOString(), 'scaling-with-autonomous-business-os');
  ex('INSERT INTO registrations(webinar_id,contact_id,attended) VALUES(1,1,1)');
  ex('INSERT INTO registrations(webinar_id,contact_id,attended) VALUES(1,3,0)');
  [['#INV-2025-089', 1, 2000, 'PAID'], ['#INV-2025-088', 3, 3000, 'PAID'], ['#INV-2025-087', 2, 1200, 'SCHEDULED']]
    .forEach(i => ex('INSERT INTO invoices(number,contact_id,amount,status) VALUES(?,?,?,?)', ...i));
  [['Webinar Pre-Flight Drip', 1420, 744, 399], ['Product Re-Engagement', 890, 310, 90]]
    .forEach(c => ex("INSERT INTO campaigns(name,segment,subject,status,sent,opens,clicks) VALUES(?,?,?,'sent',?,?,?)", c[0], 'Lead', c[0], c[1], c[2], c[3]));
}

// ---------- Audit log: SHA-256 hash chain (tamper-evident) ----------
const digest = (prev, ts, actor, module, action, detail) =>
  crypto.createHash('sha256').update(prev + ts + actor + module + action + detail).digest('hex');
function audit(actor, module, action, detail = '') {
  const prev = one('SELECT hash FROM audit ORDER BY id DESC LIMIT 1')?.hash || 'GENESIS';
  const ts = new Date().toISOString();
  ex('INSERT INTO audit(ts,actor,module,action,detail,prev_hash,hash) VALUES(?,?,?,?,?,?,?)',
    ts, actor, module, action, detail, prev, digest(prev, ts, actor, module, action, detail));
}

// ---------- Auth & RBAC ----------
const auth = (req, res, next) => {
  try { req.user = jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), SECRET); next(); }
  catch { res.status(401).json({ error: 'Unauthorized' }); }
};
const can = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ error: 'Forbidden' });
const ACCESS = { admin: ['*'], manager: ['website', 'crm', 'billing', 'marketing', 'webinars'], marketer: ['website', 'crm', 'marketing', 'webinars'], viewer: [] };
const allowed = (role, module) => ACCESS[role]?.includes('*') || ACCESS[role]?.includes(module);
const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------- AI agent: tool registry (the ONLY actions the agent can take) ----------
const TOOLS = {
  create_webinar: {
    module: 'webinars', sensitive: false, doc: 'params {title, starts_at}',
    run: p => ({ id: ex('INSERT INTO webinars(title,starts_at,slug) VALUES(?,?,?)', p.title, p.starts_at || null, slug(p.title)).lastInsertRowid }),
    undo: r => { ex('DELETE FROM registrations WHERE webinar_id=?', r.id); ex('DELETE FROM webinars WHERE id=?', r.id); }
  },
  build_landing_page: {
    module: 'website', sensitive: false, doc: 'params {title} creates a DRAFT page',
    run: p => ({ id: ex('INSERT INTO pages(slug,title,blocks) VALUES(?,?,?)', slug(p.title) + '-' + Date.now().toString(36), p.title,
      JSON.stringify(['hero', 'lead_form', 'webinar_countdown'])).lastInsertRowid }),
    undo: r => ex('DELETE FROM pages WHERE id=?', r.id)
  },
  send_campaign: {
    module: 'marketing', sensitive: true, doc: 'params {segment (CRM stage), subject} bulk email',
    run: p => {
      const n = one('SELECT COUNT(*) n FROM contacts WHERE stage=?', p.segment || 'Lead').n;
      // TODO: hand the contact list to a real email provider (SES/SendGrid) here
      return { id: ex('INSERT INTO campaigns(name,segment,subject,status,sent) VALUES(?,?,?,?,?)',
        p.subject, p.segment || 'Lead', p.subject, 'sent', n).lastInsertRowid, sent: n };
    },
    undo: r => ex("UPDATE campaigns SET status='recalled' WHERE id=?", r.id)
  },
  grant_trial: {
    module: 'billing', sensitive: true, doc: 'params {plan (plan name), segment} creates trial subscriptions',
    run: p => {
      const plan = one('SELECT id FROM plans WHERE name=?', p.plan || 'Growth');
      if (!plan) throw new Error('Unknown plan');
      const ids = all('SELECT id FROM contacts WHERE stage=?', p.segment || 'Lead').map(c =>
        ex("INSERT INTO subscriptions(contact_id,plan_id,status) VALUES(?,?,'trialing')", c.id, plan.id).lastInsertRowid);
      return { ids };
    },
    undo: r => r.ids.forEach(id => ex('DELETE FROM subscriptions WHERE id=?', id))
  }
};

async function plan(prompt) {
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-5-5', max_tokens: 1000,
          system: 'Return ONLY a JSON array like [{"tool":"name","params":{}}]. Allowed tools: ' +
            JSON.stringify(Object.fromEntries(Object.entries(TOOLS).map(([k, v]) => [k, v.doc]))) + '. Never invent tools.',
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const j = await r.json();
      return JSON.parse(j.content[0].text.replace(/```json|```/g, '')).filter(s => TOOLS[s.tool]); // whitelist
    } catch { /* fall through to rule-based planner */ }
  }
  const title = (prompt.match(/webinar (?:on|about) ([^,]+?)(?:,| and|$)/i) || [])[1] || 'New Webinar';
  const steps = [];
  if (/webinar/i.test(prompt)) steps.push({ tool: 'create_webinar', params: { title } }, { tool: 'build_landing_page', params: { title } });
  if (/email|campaign/i.test(prompt)) steps.push({ tool: 'send_campaign', params: { segment: 'Lead', subject: `Join us: ${title}` } });
  if (/trial|pro|plan/i.test(prompt)) steps.push({ tool: 'grant_trial', params: { plan: 'Growth', segment: 'Lead' } });
  return steps;
}

const getRun = id => { const r = one('SELECT * FROM agent_runs WHERE id=?', id); return r && { ...r, steps: JSON.parse(r.steps) }; };
const saveRun = r => ex('UPDATE agent_runs SET status=?, steps=? WHERE id=?', r.status, JSON.stringify(r.steps), r.id);

function execute(id, actor) {
  const r = getRun(id);
  for (const s of r.steps) {
    if (['done', 'rejected', 'rolled_back'].includes(s.status)) continue;
    const t = TOOLS[s.tool];
    if (t.sensitive && s.status !== 'approved') {          // approval checkpoint
      s.status = 'awaiting_approval'; r.status = 'awaiting_approval'; saveRun(r);
      audit(actor, 'agent', 'approval_requested', s.tool);
      return r;
    }
    try { s.result = t.run(s.params); s.status = 'done'; audit(actor, t.module, s.tool, JSON.stringify(s.params)); }
    catch (e) { s.status = 'failed'; s.error = e.message; r.status = 'failed'; saveRun(r); return r; }
  }
  r.status = 'completed'; saveRun(r); return r;
}

// ---------- API ----------
const app = express();
app.use(cors(), express.json());
app.use(express.static('public')); // put the frontend at public/index.html
const WRITE = can('admin', 'manager', 'marketer');
const APPROVE = can('admin', 'manager');

app.post('/api/auth/login', (req, res) => {
  const u = one('SELECT * FROM users WHERE email=?', req.body.email);
  if (!u || !bcrypt.compareSync(req.body.password || '', u.password)) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: jwt.sign({ id: u.id, email: u.email, role: u.role }, SECRET, { expiresIn: '8h' }), role: u.role });
});

// Public endpoints (website-builder forms, webinar signup) feed the same CRM
const upsertContact = (b, source) => {
  ex('INSERT INTO contacts(name,email,company,source) VALUES(?,?,?,?) ON CONFLICT(email) DO UPDATE SET name=excluded.name', b.name, b.email, b.company || null, source);
  return one('SELECT * FROM contacts WHERE email=?', b.email);
};
app.post('/api/public/leads', (req, res) => res.json(upsertContact(req.body, req.body.source || 'website')));
app.post('/api/public/webinars/:id/register', (req, res) => {
  const c = upsertContact(req.body, `webinar:${req.params.id}`);
  ex('INSERT OR IGNORE INTO registrations(webinar_id,contact_id) VALUES(?,?)', req.params.id, c.id);
  res.json({ registered: true, contact_id: c.id });
});

// CRM
app.get('/api/contacts', auth, (req, res) => res.json(all('SELECT * FROM contacts WHERE name LIKE ? OR company LIKE ? ORDER BY id DESC', `%${req.query.q || ''}%`, `%${req.query.q || ''}%`)));
app.post('/api/contacts', auth, WRITE, (req, res) => { const c = upsertContact(req.body, 'manual'); audit(req.user.email, 'crm', 'contact_upsert', c.email); res.json(c); });
app.patch('/api/contacts/:id', auth, WRITE, (req, res) => {
  ex('UPDATE contacts SET stage=COALESCE(?,stage), arr=COALESCE(?,arr) WHERE id=?', req.body.stage, req.body.arr, req.params.id);
  res.json(one('SELECT * FROM contacts WHERE id=?', req.params.id));
});
app.get('/api/contacts/:id/timeline', auth, (req, res) => res.json([
  ...all("SELECT 'webinar' type, w.title label, r.attended FROM registrations r JOIN webinars w ON w.id=r.webinar_id WHERE r.contact_id=?", req.params.id),
  ...all("SELECT 'subscription' type, p.name label, s.status FROM subscriptions s JOIN plans p ON p.id=s.plan_id WHERE s.contact_id=?", req.params.id)
]));

// Website builder
app.get('/api/pages', auth, (req, res) => res.json(all('SELECT * FROM pages')));
app.post('/api/pages', auth, WRITE, (req, res) => res.json({ id: ex('INSERT INTO pages(slug,title,blocks) VALUES(?,?,?)', slug(req.body.title), req.body.title, JSON.stringify(req.body.blocks || [])).lastInsertRowid }));
app.put('/api/pages/:id', auth, WRITE, (req, res) => { ex('UPDATE pages SET blocks=? WHERE id=?', JSON.stringify(req.body.blocks), req.params.id); res.json({ ok: true }); });
app.post('/api/pages/:id/publish', auth, APPROVE, (req, res) => { ex('UPDATE pages SET published=1 WHERE id=?', req.params.id); audit(req.user.email, 'website', 'publish', req.params.id); res.json({ ok: true }); });

// Webinars & marketing
app.get('/api/webinars', auth, (req, res) => res.json(all('SELECT w.*, (SELECT COUNT(*) FROM registrations WHERE webinar_id=w.id) registered, (SELECT COUNT(*) FROM registrations WHERE webinar_id=w.id AND attended=1) attended FROM webinars w')));
app.post('/api/webinars', auth, WRITE, (req, res) => res.json({ id: ex('INSERT INTO webinars(title,starts_at,slug) VALUES(?,?,?)', req.body.title, req.body.starts_at, slug(req.body.title)).lastInsertRowid }));
app.post('/api/webinars/:id/attendance', auth, WRITE, (req, res) => {
  ex('UPDATE registrations SET attended=1 WHERE webinar_id=? AND contact_id=(SELECT id FROM contacts WHERE email=?)', req.params.id, req.body.email);
  res.json({ ok: true });
});
app.get('/api/campaigns', auth, (req, res) => res.json(all('SELECT * FROM campaigns')));

// Billing (flat, per-seat, usage-based)
const mrr = () => all("SELECT s.seats, s.usage, p.model, p.price, p.unit_price, p.included FROM subscriptions s JOIN plans p ON p.id=s.plan_id WHERE s.status='active'")
  .reduce((t, x) => t + (x.model === 'per_seat' ? x.price * x.seats : x.price) + Math.max(0, x.usage - x.included) * x.unit_price, 0);
app.get('/api/billing/plans', auth, (req, res) => res.json(all('SELECT * FROM plans')));
app.post('/api/billing/subscribe', auth, APPROVE, (req, res) => {
  const id = ex('INSERT INTO subscriptions(contact_id,plan_id,seats) VALUES(?,?,?)', req.body.contact_id, req.body.plan_id, req.body.seats || 1).lastInsertRowid;
  ex("UPDATE contacts SET stage='Customer' WHERE id=?", req.body.contact_id);
  const p = one('SELECT * FROM plans WHERE id=?', req.body.plan_id);
  ex('INSERT INTO invoices(number,contact_id,amount,status) VALUES(?,?,?,?)', `#INV-${new Date().getFullYear()}-${String(id).padStart(3, '0')}`,
    req.body.contact_id, p.model === 'per_seat' ? p.price * (req.body.seats || 1) : p.price, 'PAID');
  audit(req.user.email, 'billing', 'subscribe', String(id)); res.json({ id });
});
app.post('/api/billing/usage', auth, WRITE, (req, res) => { ex('UPDATE subscriptions SET usage=usage+? WHERE id=?', req.body.units, req.body.subscription_id); res.json({ ok: true }); });
app.get('/api/billing/summary', auth, (req, res) => res.json({
  mrr: mrr(),
  active: one("SELECT COUNT(*) n FROM subscriptions WHERE status='active'").n,
  seats: one("SELECT COALESCE(SUM(s.seats),0) n FROM subscriptions s JOIN plans p ON p.id=s.plan_id WHERE s.status='active' AND p.model='per_seat'").n,
  overage: all("SELECT s.usage, p.included, p.unit_price FROM subscriptions s JOIN plans p ON p.id=s.plan_id WHERE p.model='usage'")
    .reduce((t, x) => t + Math.max(0, x.usage - x.included) * x.unit_price, 0)
}));

// Integrated analytics: one funnel across all modules
app.get('/api/analytics/funnel', auth, (req, res) => {
  const n = s => one(s).n;
  res.json({
    visitors: n('SELECT COUNT(*) n FROM page_views'),
    leads: n('SELECT COUNT(*) n FROM contacts'),
    registered: n('SELECT COUNT(DISTINCT contact_id) n FROM registrations'),
    attended: n('SELECT COUNT(DISTINCT contact_id) n FROM registrations WHERE attended=1'),
    paid: n("SELECT COUNT(DISTINCT contact_id) n FROM subscriptions WHERE status='active'"),
    mrr: mrr()
  });
});

// AI agent
app.post('/api/agent/runs', auth, async (req, res) => {
  const steps = (await plan(req.body.prompt || '')).map(s => ({ ...s, module: TOOLS[s.tool].module, status: 'pending' }));
  if (!steps.length) return res.status(400).json({ error: 'Could not build a plan from that instruction' });
  const denied = steps.find(s => !allowed(req.user.role, s.module));
  if (denied) return res.status(403).json({ error: `Role '${req.user.role}' cannot use module '${denied.module}'` });
  const id = ex('INSERT INTO agent_runs(prompt,status,steps,created_by) VALUES(?,?,?,?)', req.body.prompt, 'pending', JSON.stringify(steps), req.user.email).lastInsertRowid;
  audit(req.user.email, 'agent', 'plan_created', req.body.prompt);
  res.json(execute(id, req.user.email));
});
app.get('/api/agent/runs/:id', auth, (req, res) => res.json(getRun(req.params.id)));
app.post('/api/agent/runs/:id/approve', auth, APPROVE, (req, res) => {
  const r = getRun(req.params.id), s = r?.steps.find(x => x.status === 'awaiting_approval');
  if (!s) return res.status(409).json({ error: 'Nothing awaiting approval' });
  s.status = 'approved'; saveRun(r); audit(req.user.email, 'approval', 'approved', s.tool);
  res.json(execute(r.id, req.user.email));
});
app.post('/api/agent/runs/:id/reject', auth, APPROVE, (req, res) => {
  const r = getRun(req.params.id), s = r?.steps.find(x => x.status === 'awaiting_approval');
  if (!s) return res.status(409).json({ error: 'Nothing awaiting approval' });
  s.status = 'rejected'; r.status = 'cancelled'; saveRun(r); audit(req.user.email, 'approval', 'rejected', s.tool); res.json(r);
});
app.post('/api/agent/runs/:id/rollback', auth, APPROVE, (req, res) => {
  const r = getRun(req.params.id);
  for (const s of [...r.steps].reverse()) if (s.status === 'done') { TOOLS[s.tool].undo(s.result); s.status = 'rolled_back'; audit(req.user.email, s.module, 'rollback', s.tool); }
  r.status = 'rolled_back'; saveRun(r); res.json(r);
});

// Dashboard KPI cards, invoices, pricing page, pending approvals, visitor tracking, RBAC matrix
app.get('/api/dashboard', auth, (req, res) => {
  const n = s => one(s).n;
  const sent = n('SELECT COALESCE(SUM(sent),0) n FROM campaigns'), opens = n('SELECT COALESCE(SUM(opens),0) n FROM campaigns');
  const regs = n('SELECT COUNT(*) n FROM registrations'), att = n('SELECT COUNT(*) n FROM registrations WHERE attended=1');
  const leads = n('SELECT COUNT(*) n FROM contacts'), paid = n("SELECT COUNT(DISTINCT contact_id) n FROM subscriptions WHERE status='active'");
  res.json({
    leads, mrr: mrr(), active_subs: n("SELECT COUNT(*) n FROM subscriptions WHERE status='active'"),
    conversion_rate: leads ? +(paid / leads * 100).toFixed(1) : 0,
    campaign_open_rate: sent ? +(opens / sent * 100).toFixed(1) : 0,
    webinar_attendance: regs ? +(att / regs * 100).toFixed(1) : 0,
    pipeline_value: n("SELECT COALESCE(SUM(arr),0) n FROM contacts WHERE stage != 'Customer'"),
    pending_approvals: n("SELECT COUNT(*) n FROM agent_runs WHERE status='awaiting_approval'")
  });
});
app.get('/api/invoices', auth, (req, res) => res.json(all('SELECT i.*, c.company customer FROM invoices i JOIN contacts c ON c.id=i.contact_id ORDER BY i.id DESC')));
app.get('/api/public/plans', (req, res) => res.json(all('SELECT * FROM plans')));
app.post('/api/public/track', (req, res) => { ex('INSERT INTO page_views(page,ts) VALUES(?,?)', req.body.page || '/', new Date().toISOString()); res.json({ ok: true }); });
app.get('/api/agent/approvals', auth, (req, res) => res.json(
  all("SELECT id,prompt,steps,created_by FROM agent_runs WHERE status='awaiting_approval'").map(r => ({ ...r, steps: JSON.parse(r.steps) }))));
app.get('/api/security/roles', auth, (req, res) => res.json(ACCESS));

// Audit
app.get('/api/audit.csv', auth, can('admin', 'viewer'), (req, res) => res.type('text/csv').send('ts,actor,module,action,detail,hash\n' +
  all('SELECT * FROM audit ORDER BY id').map(a => [a.ts, a.actor, a.module, a.action, JSON.stringify(a.detail), a.hash].join(',')).join('\n')));
app.get('/api/audit', auth, can('admin', 'viewer'), (req, res) => res.json(all('SELECT * FROM audit ORDER BY id DESC LIMIT 200')));
app.get('/api/audit/verify', auth, can('admin', 'viewer'), (req, res) => {
  let prev = 'GENESIS';
  for (const a of all('SELECT * FROM audit ORDER BY id')) {
    if (a.prev_hash !== prev || digest(prev, a.ts, a.actor, a.module, a.action, a.detail) !== a.hash) return res.json({ valid: false, broken_at: a.id });
    prev = a.hash;
  }
  res.json({ valid: true });
});

if (!one('SELECT 1 x FROM agent_runs')) { // one pending gate, like the UI's "Webinar Lead Followup Plan"
  const steps = [{ tool: 'send_campaign', params: { segment: 'Lead', subject: '20% VIP offer for webinar attendees' }, module: 'marketing', status: 'awaiting_approval' }];
  ex('INSERT INTO agent_runs(prompt,status,steps,created_by) VALUES(?,?,?,?)', 'Webinar Lead Followup Plan', 'awaiting_approval', JSON.stringify(steps), 'admin@nexus.ai');
  audit('admin@nexus.ai', 'agent', 'approval_requested', 'send_campaign');
}

app.listen(process.env.PORT || 3000, () => console.log('Nexus API on :' + (process.env.PORT || 3000)));
