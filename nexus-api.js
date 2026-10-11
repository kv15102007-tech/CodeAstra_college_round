/* ==========================================================================
   nexus-api.js  -  connects the Nexus UI (code.html) to server.js

   Load it LAST, right before </body>:
       <script src="nexus-api.js"></script>

   - If the backend is offline, every screen keeps its built-in demo data.
   - Functions below intentionally replace the toast-only versions in code.html.
   ========================================================================== */

const API_BASE_URL = 'http://localhost:3000';
let TOKEN = null;
let loginPromise = null;

/* ---------- Auth + fetch helper ---------- */
function ensureToken() {
  if (TOKEN) return Promise.resolve(TOKEN);
  if (!loginPromise) {
    loginPromise = fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@nexus.ai', password: 'admin123' })
    })
      .then(async r => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.token) throw new Error(d.error || 'Login failed');
        TOKEN = d.token;
        return TOKEN;
      })
      .finally(() => { loginPromise = null; });
  }
  return loginPromise;
}

async function api(path, method = 'GET', body) {
  await ensureToken();
  const r = await fetch(`${API_BASE_URL}/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + TOKEN },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const j = await r.json().catch(() => ({}));
  if (r.status === 401) TOKEN = null; // expired: next call logs in again
  if (!r.ok) throw new Error(j.error || 'Request failed');
  return j;
}

/* ---------- Small helpers ---------- */
const qs = (s, root = document) => root.querySelector(s);
const qsa = (s, root = document) => [...root.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => '$' + Number(n || 0).toLocaleString('en-US');
const pct = (a, b) => (b ? ((a / b) * 100).toFixed(1) + '%' : '—');
const notify = m => { if (typeof showNotificationToast === 'function') showNotificationToast(m); };
const findBtn = (scope, text) => qsa(`${scope} button`).find(b => b.textContent.includes(text));

const STAGES = ['Lead', 'Proposal Sent', 'Demo Completed', 'Negotiation', 'Contract Sent', 'Customer'];
const STAGE_CLASS = {
  'Negotiation': 'bg-primary/20 text-primary',
  'Proposal Sent': 'bg-secondary-container text-on-secondary-container',
  'Demo Completed': 'bg-tertiary-container text-on-tertiary-container',
  'Contract Sent': 'bg-primary/20 text-primary',
  'Customer': 'bg-primary text-on-primary'
};
const AVATAR_CLASS = ['bg-primary/20 text-primary', 'bg-secondary-container text-secondary', 'bg-tertiary-container text-tertiary', 'bg-primary-container text-primary'];
const TOOL_LABEL = {
  create_webinar: 'Create webinar',
  build_landing_page: 'Build landing page (draft)',
  send_campaign: 'Send email campaign',
  grant_trial: 'Grant trial subscriptions'
};
const PRESETS = {
  'Growth Multiplier Plan': 'Launch webinar on AI Ops, build signup page, email 200 leads, grant Pro trial',
  'Churn Rescue Sequence': 'Email churn-risk customers a discount campaign'
};
const initials = n => String(n || '?').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

let contactsCache = [];
let lastRun = null;
let pendingRun = null;

/* ---------- Generic form modal (used by Add Contact / Create Webinar) ---------- */
function openFormModal({ title, fields, submit, onSubmit }) {
  let m = document.getElementById('formModal');
  if (!m) { m = document.createElement('div'); m.id = 'formModal'; document.body.appendChild(m); }
  const cls = 'w-full bg-surface-dim border border-outline-variant rounded-lg p-2 text-xs text-on-surface focus:outline-none focus:border-primary/50';
  const input = f => f.type === 'select'
    ? `<select id="ff_${f.id}" class="${cls}">${f.options.map(o => `<option>${esc(o)}</option>`).join('')}</select>`
    : `<input id="ff_${f.id}" type="${f.type || 'text'}" placeholder="${esc(f.placeholder || '')}" class="${cls}">`;
  m.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md';
  m.innerHTML = `
    <div class="w-full max-w-md rounded-2xl bg-surface/95 border border-primary/20 shadow-[0_0_50px_rgba(125,211,252,0.15)] p-6 space-y-4">
      <h3 class="font-headline font-semibold text-base text-on-surface">${esc(title)}</h3>
      <div class="space-y-3">
        ${fields.map(f => `<div><div class="text-xs text-on-surface-variant mb-1">${esc(f.label)}</div>${input(f)}</div>`).join('')}
      </div>
      <p class="text-xs text-error min-h-[1rem]" id="ff_error"></p>
      <div class="flex justify-end gap-2">
        <button id="ff_cancel" class="px-4 py-2 rounded-lg border border-primary/20 text-on-surface text-xs hover:bg-surface-bright">Cancel</button>
        <button id="ff_submit" class="px-5 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs active:scale-95">${esc(submit)}</button>
      </div>
    </div>`;
  const close = () => { m.className = 'hidden'; m.innerHTML = ''; };
  qs('#ff_cancel', m).onclick = close;
  qs('#ff_submit', m).onclick = async () => {
    const vals = {};
    fields.forEach(f => { vals[f.id] = qs('#ff_' + f.id, m).value.trim(); });
    const missing = fields.find(f => f.required && !vals[f.id]);
    if (missing) { qs('#ff_error', m).textContent = `${missing.label} is required.`; return; }
    try { await onSubmit(vals); close(); }
    catch (e) { qs('#ff_error', m).textContent = e.message === 'Failed to fetch' ? 'Backend offline. Start it with: node server.js' : e.message; }
  };
  qs('#ff_' + fields[0].id, m).focus();
}

/* ==========================================================================
   CRM
   ========================================================================== */
async function loadContacts() {
  const rows = await api('/contacts');
  contactsCache = rows.slice().sort((a, b) => (b.arr || 0) - (a.arr || 0) || b.id - a.id);
  const tb = qs('#crmTable tbody');
  if (!tb) return;
  tb.innerHTML = contactsCache.map((c, i) => `
    <tr class="hover:bg-surface-bright/50 cursor-pointer transition-colors" data-id="${c.id}">
      <td class="py-3 px-4 flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-full ${AVATAR_CLASS[i % 4]} font-bold flex items-center justify-center text-xs">${esc(initials(c.name))}</div>
        <div><span class="font-medium block text-on-surface">${esc(c.name)}</span><span class="text-[11px] text-on-surface-variant">${esc(c.title || c.email)}</span></div>
      </td>
      <td class="py-3 px-4 font-medium">${esc(c.company || '—')}</td>
      <td class="py-3 px-4"><span class="px-2 py-0.5 rounded text-[10px] ${STAGE_CLASS[c.stage] || 'bg-surface-container text-on-surface-variant'} font-medium">${esc(c.stage)}</span></td>
      <td class="py-3 px-4 font-mono font-semibold text-primary">${money(c.arr)}</td>
      <td class="py-3 px-4 text-on-surface-variant">${esc(c.source || '—')}</td>
      <td class="py-3 px-4 text-right"><button class="text-primary hover:underline text-[11px]">Inspect Journey →</button></td>
    </tr>`).join('');
  const sub = qs('#view-crm p.text-xs');
  if (sub) sub.textContent = `${rows.length} contacts · ${rows.filter(c => c.stage === 'Lead').length} new leads pending agent follow-up`;
  if (typeof filterCrmTable === 'function') filterCrmTable();
}

function bindCrmClicks() {
  const tb = qs('#crmTable tbody');
  if (!tb || tb.dataset.bound) return;
  tb.dataset.bound = '1';
  tb.addEventListener('click', e => {
    const tr = e.target.closest('tr[data-id]');
    if (!tr) return; // untouched demo rows keep their own inline handler
    const c = contactsCache.find(x => String(x.id) === tr.dataset.id);
    if (c) openContact(c);
  });
}

async function openContact(c) {
  openLeadDrawer(c.name, `${c.company || '—'}${c.title ? ' · ' + c.title : ''}`, `${money(c.arr)} / yr`, c.stage);
  const box = qs('#leadDrawer .pl-5');
  if (!box) return;
  box.innerHTML = '<p class="text-[11px] text-on-surface-variant">Loading journey…</p>';
  try {
    const items = await api(`/contacts/${c.id}/timeline`);
    const dot = t => (t === 'subscription' ? 'bg-primary' : 'bg-secondary');
    const line = i => (i.type === 'webinar'
      ? `${i.attended ? 'Attended' : 'Registered for'} webinar: ${esc(i.label)}`
      : `${esc(i.label)} plan · ${esc(i.status)}`);
    const events = items.map(i => `<div class="relative"><span class="absolute -left-[25px] top-0 w-3 h-3 rounded-full ${dot(i.type)} border-2 border-surface"></span><p class="font-medium text-on-surface">${line(i)}</p></div>`).join('');
    const origin = `<div class="relative"><span class="absolute -left-[25px] top-0 w-3 h-3 rounded-full bg-outline border-2 border-surface"></span><span class="text-[11px] text-on-surface-variant font-mono">${esc((c.created_at || '').slice(0, 10))}</span><p class="font-medium text-on-surface">Captured via ${esc(c.source || 'manual entry')}</p></div>`;
    box.innerHTML = events + origin;
  } catch { box.innerHTML = ''; }
}

function addContactModal() {
  openFormModal({
    title: 'Add contact',
    submit: 'Save contact',
    fields: [
      { id: 'name', label: 'Full name', required: true, placeholder: 'Jane Cooper' },
      { id: 'email', label: 'Work email', type: 'email', required: true, placeholder: 'jane@company.com' },
      { id: 'company', label: 'Company', placeholder: 'Acme Inc.' },
      { id: 'stage', label: 'Stage', type: 'select', options: STAGES },
      { id: 'arr', label: 'Estimated ARR ($)', type: 'number', placeholder: '12000' }
    ],
    onSubmit: async v => {
      const c = await api('/contacts', 'POST', { name: v.name, email: v.email, company: v.company || null });
      await api(`/contacts/${c.id}`, 'PATCH', { stage: v.stage, arr: v.arr ? Number(v.arr) : null });
      await loadContacts();
      notify(`${v.name} added to the CRM.`);
    }
  });
}

/* ==========================================================================
   Billing: invoices table
   ========================================================================== */
async function loadInvoices() {
  const inv = await api('/invoices');
  const tb = qs('#view-billing table tbody');
  if (!tb) return;
  tb.innerHTML = inv.map(i => `
    <tr>
      <td class="py-3 font-mono text-primary font-medium">${esc(i.number)}</td>
      <td>${esc(i.customer || '—')}</td>
      <td class="font-mono font-semibold">$${Number(i.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
      <td><span class="px-2 py-0.5 rounded text-[10px] ${i.status === 'PAID' ? 'bg-primary/20 text-primary' : 'bg-secondary-container text-on-secondary-container'}">${esc(i.status)}</span></td>
      <td class="text-right"><button class="text-primary hover:underline" data-pdf="${esc(i.number)}">PDF</button></td>
    </tr>`).join('');
  tb.onclick = e => {
    const b = e.target.closest('[data-pdf]');
    if (b) notify(`Downloading PDF invoice ${b.dataset.pdf}...`);
  };
}

/* ==========================================================================
   Marketing: campaigns, approval gates, latest webinar
   ========================================================================== */
async function loadMarketing() {
  const [campaigns, approvals, webinars] = await Promise.all([api('/campaigns'), api('/agent/approvals'), api('/webinars')]);
  const row = (k, v, cls = 'font-medium text-on-surface') => `<div class="flex justify-between"><span class="text-on-surface-variant">${k}</span><span class="${cls}">${v}</span></div>`;
  const grid = qs('#view-marketing .grid');
  if (grid) {
    const gates = approvals.map(r => {
      const s = r.steps.find(x => x.status === 'awaiting_approval') || {};
      return `<div class="p-5 rounded-2xl bg-surface/60 backdrop-blur-xl border border-tertiary/30">
        <span class="text-[11px] text-on-surface-variant font-mono">Plan #${r.id}</span>
        <h4 class="font-headline font-semibold text-sm text-on-surface mt-1">${esc(r.prompt)}</h4>
        <div class="mt-3 space-y-1.5 text-xs">${row('Pending step', esc(TOOL_LABEL[s.tool] || s.tool || '—'))}${row('Status', 'Approval Gate', 'font-semibold text-tertiary')}</div>
        <button class="mt-3 text-[11px] text-primary hover:underline" onclick="openApprovalModal()">Review &amp; authorize →</button>
      </div>`;
    });
    const camps = campaigns.slice().reverse().map(c => `<div class="p-5 rounded-2xl bg-surface/60 backdrop-blur-xl border border-primary/10">
        <span class="text-[11px] text-on-surface-variant font-mono">Campaign #${String(c.id).padStart(2, '0')}</span>
        <h4 class="font-headline font-semibold text-sm text-on-surface mt-1">${esc(c.name)}</h4>
        <div class="mt-3 space-y-1.5 text-xs">
          ${row('Recipients', Number(c.sent).toLocaleString())}
          ${c.status === 'sent'
            ? row('Open Rate', pct(c.opens, c.sent), 'font-semibold text-primary') + row('Click-through', pct(c.clicks, c.sent), 'font-semibold text-primary')
            : row('Status', esc(c.status), 'font-semibold text-tertiary')}
        </div>
      </div>`);
    grid.innerHTML = [...gates, ...camps].slice(0, 6).join('');
  }
  const w = webinars[webinars.length - 1];
  if (w) {
    const h = qs('#view-marketing h3.font-headline');
    if (h) h.textContent = w.title;
    const p = qs('#view-marketing p.mt-1');
    if (p) p.textContent = `Host: David Vance · ${w.registered} Registered Leads · ${w.registered ? Math.round((w.attended / w.registered) * 100) : 0}% Attendance`;
  }
}

function createWebinarModal() {
  openFormModal({
    title: 'Create webinar',
    submit: 'Create webinar',
    fields: [
      { id: 'title', label: 'Title', required: true, placeholder: 'AI Ops for Founders' },
      { id: 'starts_at', label: 'Starts at', type: 'datetime-local' }
    ],
    onSubmit: async v => {
      await api('/webinars', 'POST', { title: v.title, starts_at: v.starts_at ? new Date(v.starts_at).toISOString() : null });
      await loadMarketing();
      notify(`Webinar "${v.title}" created.`);
    }
  });
}

/* ==========================================================================
   Website builder: Publish Live saves blocks and publishes
   ========================================================================== */
async function publishPage() {
  try {
    const custom = qsa('#dynamicBlocksArea > div span.text-primary').map(s => s.textContent.trim());
    const blocks = ['hero', 'lead_form', ...custom];
    const pages = await api('/pages');
    let page = pages.find(p => p.slug === 'ai-scale-summit');
    if (!page) page = { id: (await api('/pages', 'POST', { title: 'AI Scale Summit', blocks })).id };
    else await api(`/pages/${page.id}`, 'PUT', { blocks });
    await api(`/pages/${page.id}/publish`, 'POST');
    notify(`Page published. ${blocks.length} blocks saved to the database.`);
  } catch (e) {
    notify(e.message === 'Failed to fetch' ? 'Backend offline. Start it with: node server.js' : 'Publish failed: ' + e.message);
  }
}

/* ==========================================================================
   Security: live audit log + verified export
   ========================================================================== */
async function loadAudit() {
  const [rows, v] = await Promise.all([api('/audit'), api('/audit/verify')]);
  const tb = qsa('#view-security table tbody')[1];
  if (tb) {
    tb.innerHTML = rows.slice(0, 12).map(a => `<tr>
      <td class="py-2.5 text-on-surface-variant">${esc(a.ts.slice(11, 19))} UTC</td>
      <td class="text-primary font-sans">${esc(a.actor)}</td>
      <td class="font-sans">${esc(a.module)}</td>
      <td>${esc(a.action)}${a.detail ? ' · ' + esc(a.detail.slice(0, 40)) : ''}</td>
      <td class="text-[11px] text-on-surface-variant">sha256: ${esc(a.hash.slice(0, 4))}...${esc(a.hash.slice(-4))}</td>
    </tr>`).join('');
  }
  const h = qsa('#view-security h3')[1];
  if (h) h.innerHTML = `Immutable Autonomous Audit Log <span class="ml-2 px-2 py-0.5 rounded text-[10px] font-mono ${v.valid ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'}">${v.valid ? 'CHAIN VERIFIED' : 'CHAIN BROKEN @ #' + v.broken_at}</span>`;
}

async function exportAudit() {
  try {
    const v = await api('/audit/verify');
    const r = await fetch(`${API_BASE_URL}/api/audit.csv`, { headers: { Authorization: 'Bearer ' + TOKEN } });
    if (!r.ok) throw new Error('Export failed');
    const url = URL.createObjectURL(await r.blob());
    const a = document.createElement('a');
    a.href = url; a.download = 'nexus-audit-log.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify(v.valid ? 'Audit log exported. SHA-256 chain verified.' : `Exported, but the chain is broken at entry #${v.broken_at}.`);
  } catch (e) {
    notify(e.message === 'Failed to fetch' ? 'Backend offline. Start it with: node server.js' : e.message);
  }
}

/* ==========================================================================
   AI agent: plans, approval gates, rollback
   ========================================================================== */
function renderRun(run) {
  lastRun = run;
  const box = qs('#agentDynamicContent');
  if (!box) return;
  const ICON = {
    done: ['check_circle', 'text-primary'], approved: ['check_circle', 'text-primary'],
    awaiting_approval: ['hourglass_top', 'text-tertiary'], failed: ['error', 'text-error'],
    rejected: ['block', 'text-error'], rolled_back: ['undo', 'text-on-surface-variant'], pending: ['pending', 'text-outline']
  };
  const done = run.steps.filter(s => s.status === 'done').length;
  const steps = run.steps.map(s => {
    const [ic, col] = ICON[s.status] || ICON.pending;
    return `<div class="flex items-center gap-2 text-on-surface"><span class="material-symbols-outlined ${col} text-sm" style="font-variation-settings:'FILL' 1;">${ic}</span><span class="truncate">${esc(TOOL_LABEL[s.tool] || s.tool)}${s.error ? ' — ' + esc(s.error) : ''}</span></div>`;
  }).join('');
  box.innerHTML = `
    <div class="flex items-center justify-between text-xs mb-2"><span class="font-semibold text-on-surface">Active Plan: #PLN-${run.id}</span><span class="text-primary text-[11px] font-mono">${done}/${run.steps.length} · ${esc(run.status.replace('_', ' '))}</span></div>
    <p class="text-[11px] text-on-surface-variant mb-2">${esc(run.prompt)}</p>
    <div class="space-y-2 text-xs">${steps}</div>
    ${run.status === 'awaiting_approval' ? '<button onclick="openApprovalModal()" class="mt-3 w-full py-1.5 rounded bg-primary text-on-primary text-xs font-semibold">Review &amp; approve</button>' : ''}
    ${run.steps.some(s => s.status === 'done') ? '<button onclick="rollbackActivePlan()" class="mt-3 w-full py-1.5 rounded bg-error/20 text-error border border-error/30 text-xs font-semibold hover:bg-error/30">Rollback plan</button>' : ''}`;
}

async function refreshApprovalBadge() {
  try {
    const n = (await api('/agent/approvals')).length;
    const b = qs('#agentTabApprovals span.rounded');
    if (b) b.textContent = n ? `${n} Pending` : 'All clear';
  } catch { /* offline: keep static badge */ }
}

async function runAutonomousPlan(planName) {
  const prompt = PRESETS[planName] || planName;
  notify(`Agent planning: "${planName}"…`);
  try {
    const run = await api('/agent/runs', 'POST', { prompt });
    renderRun(run);
    refreshApprovalBadge();
    if (run.status === 'awaiting_approval') setTimeout(openApprovalModal, 500);
    else notify(run.status === 'completed' ? 'Plan executed and written to the audit log.' : `Plan ${run.status.replace('_', ' ')}.`);
  } catch (e) {
    if (e instanceof TypeError) { notify('Backend offline. Showing demo mode.'); openApprovalModal(); }
    else notify('Agent: ' + e.message);
  }
}

function triggerUniversalDeploy() {
  const d = document.getElementById('agentSideNav');
  if (d) d.classList.remove('hidden');
  runAutonomousPlan('Growth Multiplier Plan');
}

async function openApprovalModal() {
  const modal = document.getElementById('approvalModal');
  if (!modal) return;
  pendingRun = null;
  try {
    const list = await api('/agent/approvals');
    pendingRun = list.find(r => lastRun && r.id === lastRun.id) || list[0] || null;
    if (!pendingRun) { notify('Nothing is waiting for approval.'); return; }
    const step = pendingRun.steps.find(s => s.status === 'awaiting_approval') || pendingRun.steps[0];
    const trig = qs('span.font-semibold.text-primary', modal);
    if (trig) trig.textContent = pendingRun.prompt;
    const scope = qs('span.text-secondary', modal);
    if (scope) {
      const p = step.params || {};
      scope.textContent = step.tool === 'send_campaign' ? `Broadcast email "${p.subject}" to the ${p.segment || 'Lead'} segment`
        : step.tool === 'grant_trial' ? `Grant ${p.plan || 'Growth'} trial to the ${p.segment || 'Lead'} segment`
        : (TOOL_LABEL[step.tool] || step.tool);
    }
    const ents = qs('span.font-mono', modal);
    if (ents) {
      const seg = (step.params && step.params.segment) || 'Lead';
      const all = await api('/contacts');
      ents.textContent = `${all.filter(c => c.stage === seg).length} Contacts in CRM`;
    }
  } catch { /* backend offline: show the static modal */ }
  modal.classList.remove('hidden');
}

async function approveAction() {
  const run = pendingRun;
  closeApprovalModal();
  if (!run) { notify('Action approved. 240 leads dispatched and verified with audit hash.'); return; }
  try {
    const res = await api(`/agent/runs/${run.id}/approve`, 'POST');
    pendingRun = null;
    renderRun(res);
    refreshApprovalBadge();
    if (res.status === 'awaiting_approval') { notify('Step approved. The next sensitive step needs approval.'); setTimeout(openApprovalModal, 600); }
    else notify(res.status === 'completed' ? 'Approved. Plan executed and written to the audit log.' : `Plan ${res.status.replace('_', ' ')}.`);
  } catch (e) { notify('Approval failed: ' + e.message); }
}

async function rejectAction() {
  closeApprovalModal();
  let run = pendingRun;
  try { if (!run) run = (await api('/agent/approvals'))[0]; } catch { run = null; }
  if (!run) { notify('Action rejected. Step cancelled safely per Governance Gate.'); return; }
  try {
    const res = await api(`/agent/runs/${run.id}/reject`, 'POST');
    pendingRun = null;
    renderRun(res);
    refreshApprovalBadge();
    notify('Action rejected. Plan cancelled and logged.');
  } catch (e) { notify('Reject failed: ' + e.message); }
}

async function rollbackActivePlan() {
  if (!lastRun) { notify('Plan rolled back. Zero side-effects recorded.'); return; }
  try {
    const res = await api(`/agent/runs/${lastRun.id}/rollback`, 'POST');
    renderRun(res);
    refreshApprovalBadge();
    notify(`Plan #PLN-${res.id} rolled back and logged.`);
  } catch (e) { notify('Rollback failed: ' + e.message); }
}

/* Agent drawer tabs (Pipeline and Governance previously did nothing) */
const AGENT_DEFAULT_HTML = (qs('#agentDynamicContent') || {}).innerHTML || '';

async function switchAgentTab(tab) {
  const ids = { plans: 'Plans', approvals: 'Approvals', rollback: 'Rollback', pipeline: 'Pipeline', governance: 'Governance' };
  Object.entries(ids).forEach(([k, label]) => {
    const btn = document.getElementById('agentTab' + label);
    if (!btn) return;
    btn.className = k === tab
      ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary-container/40 text-primary font-semibold border border-primary/20 text-xs transition-all'
      : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-surface-bright/60 hover:text-primary transition-all text-xs';
  });
  const box = qs('#agentDynamicContent');
  if (!box) return;
  const head = t => `<span class="font-semibold text-on-surface text-xs block mb-2">${t}</span>`;
  if (tab === 'approvals') { openApprovalModal(); return; }
  if (tab === 'plans') { if (lastRun) renderRun(lastRun); else box.innerHTML = AGENT_DEFAULT_HTML; return; }
  if (tab === 'rollback') {
    if (lastRun) renderRun(lastRun);
    else box.innerHTML = head('Reversible transactions') + '<p class="text-[11px] text-on-surface-variant">No plan has run yet. Launch one from the prompts above and it can be rolled back here.</p>';
    return;
  }
  try {
    if (tab === 'pipeline') {
      const by = {};
      (await api('/contacts')).forEach(c => { const b = by[c.stage] || (by[c.stage] = { n: 0, arr: 0 }); b.n++; b.arr += c.arr || 0; });
      box.innerHTML = head('Lead pipeline') + '<div class="space-y-1.5 text-xs">' +
        STAGES.filter(s => by[s]).map(s => `<div class="flex justify-between"><span class="text-on-surface-variant">${s}</span><span class="font-mono text-on-surface">${by[s].n} · ${money(by[s].arr)}</span></div>`).join('') + '</div>';
    } else if (tab === 'governance') {
      const roles = await api('/security/roles');
      box.innerHTML = head('Role-based access (RBAC)') + '<div class="space-y-2">' +
        Object.entries(roles).map(([r, m]) => `<div><span class="font-semibold text-primary text-xs capitalize">${esc(r)}</span><span class="text-on-surface-variant block text-[11px]">${m.includes('*') ? 'All modules' : m.length ? esc(m.join(', ')) : 'Read-only'}</span></div>`).join('') +
        '</div><p class="mt-2 text-[11px] text-on-surface-variant">Sensitive steps (bulk email, billing) always pause for approval.</p>';
    }
  } catch { box.innerHTML = head('Backend offline') + '<p class="text-[11px] text-on-surface-variant">Start it with: node server.js</p>'; }
}

/* ==========================================================================
   Wiring: load fresh data whenever a tab opens, bind the buttons
   ========================================================================== */
const VIEW_LOADERS = { CRM: loadContacts, Billing: loadInvoices, Marketing: loadMarketing, Security: loadAudit };
const _navigateTo = navigateTo;
navigateTo = function (name) {
  _navigateTo(name);
  const load = VIEW_LOADERS[name];
  if (load) load().catch(e => console.warn(`[nexus] ${name} data not loaded (showing demo data):`, e.message));
};

(async function initNexusApi() {
  bindCrmClicks();
  const wire = (scope, text, fn) => { const b = findBtn(scope, text); if (b) b.onclick = fn; };
  wire('#view-crm', 'Add Contact', addContactModal);
  wire('#view-marketing', 'Create Webinar', createWebinarModal);
  wire('#view-website-builder', 'Publish Live', publishPage);
  wire('#view-security', 'Export Audit CSV', exportAudit);
  try { await ensureToken(); }
  catch { notify('Backend offline. Showing demo data. Start it with: node server.js'); return; }
  refreshApprovalBadge();
})();

/* ==========================================================================
   Website builder canvas: the "Direct Sync to Nexus CRM" form is now a real
   public lead form (it was a disabled preview). Submitting creates a CRM contact.
   ========================================================================== */
function enableBuilderForm() {
  const inputs = qsa('#view-website-builder input[disabled]');
  if (inputs.length < 2) return;
  const [nameEl, emailEl] = inputs;
  inputs.forEach(i => { i.disabled = false; });
  nameEl.placeholder = 'Full Name';
  const row = nameEl.parentElement;
  const wrap = document.createElement('div');
  wrap.className = 'mt-3 flex items-center gap-3';
  wrap.innerHTML = '<button class="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold active:scale-95">Submit to CRM</button><span class="text-[11px] text-on-surface-variant"></span>';
  row.after(wrap);
  const msg = wrap.querySelector('span');
  const submit = async () => {
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) { msg.textContent = 'Enter your name and a valid email.'; return; }
    try {
      const r = await fetch(`${API_BASE_URL}/api/public/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, source: 'Website Builder Form' })
      });
      if (!r.ok) throw new Error('Could not save the lead');
      nameEl.value = ''; emailEl.value = '';
      msg.textContent = '';
      notify(`${name} captured and synced to the CRM.`);
    } catch (e) {
      msg.textContent = e.message === 'Failed to fetch' ? 'Backend offline. Start it with: node server.js' : e.message;
    }
  };
  wrap.querySelector('button').onclick = submit;
  [nameEl, emailEl].forEach(el => el.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); }));
}
enableBuilderForm();