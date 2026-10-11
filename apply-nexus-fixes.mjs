// apply-nexus-fixes.mjs
// Run from the project folder (the one that contains code.html):
//     node apply-nexus-fixes.mjs
// Safe to run twice. Originals are saved once as code.backup.html / server.backup.js.

import fs from 'node:fs';

const HTML = 'code.html';
const SERVER = 'server.js';
const ok = m => console.log('  DONE  ' + m);
const skip = m => console.log('  SKIP  ' + m);

if (!fs.existsSync(HTML)) {
  console.error(`\nCannot find ${HTML} in this folder.\nOpen a terminal inside stitch_nexus_ai_business_operating_platform and run the command again.\n`);
  process.exit(1);
}

let html = fs.readFileSync(HTML, 'utf8');
const original = html;
if (!fs.existsSync('code.backup.html')) fs.writeFileSync('code.backup.html', original);

console.log('\ncode.html');

/* 1. Remove the three stray "Free for Startups" cards (landing problems strip, Billing, Marketing)
      and change those three grids from 4 columns to 3. The real pricing card is not touched. */
const STRAY = String.raw`<div class="p-6 rounded-2xl bg-surface\/60 backdrop-blur-xl border border-primary\/10 flex flex-col justify-between">\s*<div>\s*<span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Free for Startups<\/span>[\s\S]*?Get Started Free\s*<\/button>\s*<\/div>`;
const strayRe = new RegExp(String.raw`(<div class="grid [^"]*?lg:grid-cols-)4( gap-6">\s*)` + STRAY, 'g');
let removed = 0;
html = html.replace(strayRe, (_m, a, b) => { removed++; return a + '3' + b; });
const freeLeft = (html.match(/Free for Startups/g) || []).length;
if (removed === 3) ok('removed 3 stray "Free for Startups" cards and fixed their grids (1 real pricing card kept)');
else if (removed === 0 && freeLeft === 1) skip('stray cards already removed');
else skip(`expected to remove 3 stray cards but matched ${removed}. Not changed. "Free for Startups" appears ${freeLeft} time(s); it should be 1.`);

/* 2. Dark-mode button in the header (it was missing) */
const CLUSTER = '<div class="flex items-center gap-1 border-l border-primary/15 pl-2 ml-1">';
const THEME_BTN = '<button class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-bright/50 transition-all duration-200 active:scale-95" onclick="toggleTheme()" title="Toggle theme"><span class="material-symbols-outlined text-lg" id="themeIcon">dark_mode</span></button>';
if (html.includes('id="themeIcon"')) skip('theme button already present');
else if (html.includes(CLUSTER)) { html = html.replace(CLUSTER, () => CLUSTER + '\n' + THEME_BTN); ok('added the dark-mode button to the header'); }
else skip('could not find the header icon area, so the theme button was not added');

/* 3. Quick light-mode (colors are fixed dark hex values, so the toggle needs this to do anything visible) */
if (html.includes('invert(1) hue-rotate(180deg)')) skip('light-mode style already present');
else if (html.includes('</style>')) { html = html.replace('</style>', () => '    html:not(.dark) { filter: invert(1) hue-rotate(180deg); }\n  </style>'); ok('added light-mode style'); }
else skip('no </style> found, so light-mode style was not added');

/* 4. Load nexus-api.js last, just before </body> */
if (/src=["']nexus-api\.js["']/.test(html)) skip('nexus-api.js script tag already present');
else {
  const i = html.lastIndexOf('</body>');
  if (i < 0) skip('no </body> found, so the script tag was not added');
  else { html = html.slice(0, i) + '<script src="nexus-api.js"></script>\n' + html.slice(i); ok('added <script src="nexus-api.js"> before </body>'); }
}

if (html !== original) { fs.writeFileSync(HTML, html); console.log('  saved code.html (original kept as code.backup.html)'); }
else console.log('  no changes needed in code.html');

/* 5. server.js: stop the "same plan twice" crash (pages.slug is UNIQUE) */
console.log('\nserver.js');
if (!fs.existsSync(SERVER)) skip('server.js not found in this folder');
else {
  let s = fs.readFileSync(SERVER, 'utf8');
  const OLD = "'INSERT INTO pages(slug,title,blocks) VALUES(?,?,?)', slug(p.title), p.title,";
  const NEW = "'INSERT INTO pages(slug,title,blocks) VALUES(?,?,?)', slug(p.title) + '-' + Date.now().toString(36), p.title,";
  if (s.includes(NEW)) skip('slug fix already applied');
  else if (s.includes(OLD)) {
    if (!fs.existsSync('server.backup.js')) fs.writeFileSync('server.backup.js', s);
    fs.writeFileSync(SERVER, s.replace(OLD, () => NEW));
    ok('landing-page slug is now unique (restart the server for it to take effect)');
  } else skip('could not find the build_landing_page line; not changed');
}

console.log('\nNext: restart the server (Ctrl+C, then node server.js), then hard-refresh the page with Ctrl+Shift+R.\n');
