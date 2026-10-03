/* ---------- config ---------- */
const USER = 'player_', HOST = 'archSystem';           // change prompt here
const CELL_W = 96, CELL_H = 104, PAD = 16, TB = 38;     // grid + taskbar height
const $ = s => document.querySelector(s);
loadIcons();

/* ---------- wallpaper (space) ---------- */
(() => {
  let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  let stars = '';
  for (let i = 0; i < 380; i++) {
    const r = rnd() < .08 ? 1.8 : rnd() * 1.1 + .3;
    stars += `<circle cx="${rnd() * 1600}" cy="${rnd() * 640}" r="${r.toFixed(2)}" fill="#fff" opacity="${(rnd() * .6 + .4).toFixed(2)}"/>`;
  }
  $('#wall').innerHTML = `<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0d33"/><stop offset=".6" stop-color="#2a1a5e"/><stop offset="1" stop-color="#5b3a8e"/></linearGradient>
    <radialGradient id="glow" cx=".35" cy=".7" r=".6"><stop offset="0" stop-color="#c9a8ff" stop-opacity=".55"/><stop offset="1" stop-color="#c9a8ff" stop-opacity="0"/></radialGradient>
    <linearGradient id="snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a5fb0"/><stop offset="1" stop-color="#1c1a4a"/></linearGradient>
    <filter id="bl"><feGaussianBlur stdDeviation="22"/></filter></defs>
    <rect width="1600" height="900" fill="url(#sky)"/>
    <ellipse cx="560" cy="560" rx="800" ry="200" fill="url(#glow)"/>
    <path d="M0 80 L700 330 L520 360 L0 220Z" fill="#0a0a2a" opacity=".6" filter="url(#bl)"/>
    ${stars}
    <path d="M0 520 L230 470 L480 460 L700 405 L860 410 L1000 470 L1230 570 L1600 590 L1600 900 L0 900Z" fill="#0b0d22"/>
    <rect y="560" width="1600" height="340" fill="url(#snow)"/>
    <path d="M0 560 L300 548 L800 560 L1200 575 L1600 590 L1600 640 L0 620Z" fill="#7a74c4" opacity=".35"/>`;
})();

/* ---------- desktop icons (grid snap) ---------- */
const desk = $('#desktop');
const grid = () => ({
  cols: Math.max(1, Math.floor((innerWidth - PAD) / CELL_W)),
  rows: Math.max(1, Math.floor((innerHeight - TB - PAD) / CELL_H))
});
function place(el, c, r) {
  const g = grid();
  el.dataset.c = c = Math.min(Math.max(c, 0), g.cols - 1);
  el.dataset.r = r = Math.min(Math.max(r, 0), g.rows - 1);
  el.style.left = PAD + c * CELL_W + 'px';
  el.style.top = PAD + r * CELL_H + 'px';
}
function makeIcon(name, label, c, r, onOpen) {
  const el = document.createElement('div');
  el.className = 'dicon';
  el.innerHTML = `<div class="ic" data-icon="${name}"></div><div>${label}</div>`;
  desk.appendChild(el); loadIcons(el); place(el, c, r);
  let ox, oy, drag = false;
  el.addEventListener('pointerdown', e => {
    if (e.button) return;
    document.querySelectorAll('.dicon').forEach(i => i.classList.remove('sel'));
    el.classList.add('sel');
    el.setPointerCapture(e.pointerId);
    const b = el.getBoundingClientRect(); ox = e.clientX - b.left; oy = e.clientY - b.top; drag = true;
    el.classList.add('dragging'); document.body.classList.add('grabbing');
  });
  el.addEventListener('pointermove', e => {
    if (!drag) return;
    el.style.left = Math.min(Math.max(e.clientX - ox, 0), innerWidth - 80) + 'px';
    el.style.top = Math.min(Math.max(e.clientY - oy, 0), innerHeight - TB - 80) + 'px';
  });
  const end = () => {
    if (!drag) return; drag = false;
    el.classList.remove('dragging'); document.body.classList.remove('grabbing');
    place(el, Math.round((parseFloat(el.style.left) - PAD) / CELL_W), Math.round((parseFloat(el.style.top) - PAD) / CELL_H));
  };
  el.addEventListener('dblclick', () => onOpen && onOpen());
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  return el;
}
makeIcon('quiz', 'quiz', 1, 1, () => launchQuiz());
addEventListener('resize', () => document.querySelectorAll('.dicon').forEach(i => place(i, +i.dataset.c, +i.dataset.r)));
$('#wall').addEventListener('pointerdown', () => document.querySelectorAll('.dicon').forEach(i => i.classList.remove('sel')));

/* ---------- taskbar ---------- */
const tick = () => {
  const d = new Date();
  $('#ct').textContent = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  $('#cd').textContent = d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });
};
tick(); setInterval(tick, 1000);
let muted = false;
$('#vol').onclick = () => { muted = !muted; $('#vol').innerHTML = ICONS[muted ? 'mute' : 'volume']; };

/* ---------- window controls ---------- */
const win = $('#win'), launch = $('#launch'), ta = $('#ta');
const DEFAULT_TITLE = '~:bash — Konsole';
const isOpen = () => !win.classList.contains('closed');
const isHidden = () => win.classList.contains('hidden');
const setTitle = t => { $('#ttl').textContent = t || DEFAULT_TITLE; };
const sync = () => launch.classList.toggle('active', isOpen());
function openWin() { setTitle(); win.classList.remove('closed'); requestAnimationFrame(() => { win.classList.remove('hidden'); focusTerm(); }); sync(); }
launch.onclick = () => {
  if (!isOpen()) openWin();
  else if (isHidden()) { win.classList.remove('hidden'); focusTerm(); }
  else win.classList.add('hidden');
};
$('#b-min').onclick = () => win.classList.add('hidden');
$('#b-max').onclick = () => { win.classList.toggle('max'); focusTerm(); };
$('#b-close').onclick = () => { win.classList.add('closed'); resetTerm(); sync(); };  // history is kept
function launchQuiz() {
  if (!isOpen()) openWin(); else { win.classList.remove('hidden'); focusTerm(); }
  const cmd = cwd === 'Desktop' ? './quiz' : './Desktop/quiz';   // same command a user would type
  print(prompt() + cmd); run(cmd); draw();
}
// resize from edges/corners
const MINW = 380, MINH = 200;
document.querySelectorAll('.rz').forEach(h => h.addEventListener('pointerdown', e => {
  if (win.classList.contains('max')) return;
  e.preventDefault(); h.setPointerCapture(e.pointerId);
  const d = h.dataset.d, X = e.clientX, Y = e.clientY, l0 = win.offsetLeft, t0 = win.offsetTop, w0 = win.offsetWidth, h0 = win.offsetHeight;
  const mv = ev => {
    const dx = Math.min(Math.max(ev.clientX, 0), innerWidth) - X, dy = Math.min(Math.max(ev.clientY, 0), innerHeight - TB) - Y;
    let l = l0, t = t0, w = w0, hh = h0;
    if (d.includes('e')) w = Math.max(MINW, w0 + dx);
    if (d.includes('s')) hh = Math.max(MINH, h0 + dy);
    if (d.includes('w')) { w = Math.max(MINW, w0 - dx); l = l0 + w0 - w; }
    if (d.includes('n')) { hh = Math.max(MINH, h0 - dy); t = t0 + h0 - hh; }
    Object.assign(win.style, { left: l + 'px', top: t + 'px', width: w + 'px', height: hh + 'px' });
  };
  const up = () => { h.removeEventListener('pointermove', mv); h.removeEventListener('pointerup', up); };
  h.addEventListener('pointermove', mv); h.addEventListener('pointerup', up);
}));
// windows: bring to front, drag by title bar, double-click title maximizes
let zTop = 20;
const front = w => { w.style.zIndex = ++zTop; };
document.querySelectorAll('.win').forEach(w => w.addEventListener('pointerdown', () => front(w), true));
document.querySelectorAll('.titlebar').forEach(t => {
  const w = t.closest('.win');
  t.addEventListener('pointerdown', e => {
    if (e.target.closest('.dot') || w.classList.contains('max')) return;
    const ox = e.clientX - w.offsetLeft, oy = e.clientY - w.offsetTop;
    t.setPointerCapture(e.pointerId);
    const mv = ev => { w.style.left = Math.max(0, ev.clientX - ox) + 'px'; w.style.top = Math.max(0, Math.min(innerHeight - TB - 30, ev.clientY - oy)) + 'px'; };
    const up = () => { t.removeEventListener('pointermove', mv); t.removeEventListener('pointerup', up); };
    t.addEventListener('pointermove', mv); t.addEventListener('pointerup', up);
  });
  t.addEventListener('dblclick', e => { if (!e.target.closest('.dot')) t.querySelector('.dots').children[1].click(); });
});

/* ---------- terminal ---------- */
const term = $('#term');
const HK = 'term-history';
let cwd = '~', hist = [], hi = 0, draft = '';
try { hist = JSON.parse(localStorage.getItem(HK)) || []; } catch (e) { hist = []; }
hi = hist.length;
const saveHist = () => { try { localStorage.setItem(HK, JSON.stringify(hist.slice(-500))); } catch (e) {} };
function resetTerm() {                       // wipes screen + state, keeps saved history
  [...term.children].forEach(n => n !== line && n.remove());
  abortQuiz(true); promptOverride = null; line.style.display = ''; reflows.length = 0;
  cwd = '~'; ta.value = ''; hi = hist.length; draft = ''; setTitle(); draw();
}
let promptOverride = null;
const prompt = () => promptOverride ?? `[${USER}@${HOST} ${cwd}]$ `;
const ls = () => cwd === '~' ? ['Desktop'] : cwd === 'Desktop' ? ['quiz'] : [];

// active input line: prompt + before + block cursor + after (all inline, same baseline)
const line = document.createElement('div');
line.innerHTML = '<span id="p"></span><span id="b"></span><span class="cur" id="c"> </span><span id="a"></span>';
term.appendChild(line);
const P = line.querySelector('#p'), B = line.querySelector('#b'), C = line.querySelector('#c'), A = line.querySelector('#a');
function draw() {
  const v = ta.value, p = ta.selectionStart;
  P.textContent = prompt(); B.textContent = v.slice(0, p);
  C.textContent = v[p] || ' '; A.textContent = v.slice(p + 1);
  term.scrollTop = term.scrollHeight;
}
function print(text, cls) {
  const d = document.createElement('div'); d.textContent = text; if (cls) d.className = cls;
  term.insertBefore(d, line);
}
/* ---- ANSI rendering, responsive reflow, quiz I/O ---- */
const PAL = ['#2b2d42', '#ff5c7a', '#7ee787', '#f0d56b', '#6fa8ff', '#d58cff', '#5fe3e3', '#d8dae5'];
const BRI = ['#6b708a', '#ff8fa3', '#a6f5ae', '#ffe69a', '#9cc4ff', '#e6b3ff', '#9af0f0', '#ffffff'];
function ansi(s) {
  const f = document.createDocumentFragment(); let st = {}, last = 0, m;
  const re = /\x1b\[([\d;]*)m/g;
  const push = t => {
    if (!t) return; const sp = document.createElement('span'); sp.textContent = t;
    if (st.fg) sp.style.color = st.fg; if (st.bg) sp.style.background = st.bg;
    if (st.b) sp.style.fontWeight = '700'; f.appendChild(sp);
  };
  while ((m = re.exec(s))) {
    push(s.slice(last, m.index)); last = re.lastIndex;
    const c = m[1] === '' ? [0] : m[1].split(';').map(Number);
    for (let i = 0; i < c.length; i++) {
      const n = c[i];
      if (n === 0) st = {}; else if (n === 1) st.b = 1;
      else if (n >= 30 && n <= 37) st.fg = PAL[n - 30]; else if (n >= 90 && n <= 97) st.fg = BRI[n - 90];
      else if (n === 38 && c[i + 1] === 2) { st.fg = `rgb(${c[i + 2]},${c[i + 3]},${c[i + 4]})`; i += 4; }
      else if (n === 48 && c[i + 1] === 2) { st.bg = `rgb(${c[i + 2]},${c[i + 3]},${c[i + 4]})`; i += 4; }
    }
  }
  push(s.slice(last)); return f;
}
let stick = true, cur = null, pending = null;
term.addEventListener('scroll', () => { stick = term.scrollHeight - term.scrollTop - term.clientHeight < 40; });
function printA(s, cls) {
  const d = document.createElement('div'); d.appendChild(ansi(s)); if (cls) d.className = cls;
  term.insertBefore(d, line); if (stick) term.scrollTop = term.scrollHeight; return d;
}
const cols = () => Math.max(10, Math.floor((term.clientWidth - 12) / ($('#probe').getBoundingClientRect().width / 10)));
const reflows = [];
function reflow(fn, cls) {                    // output that re-renders itself for the current width
  const d = printA('', cls), r = { d, fn, update() { d.replaceChildren(ansi(fn(cols()))); } };
  reflows.push(r); r.update(); return r;
}
new ResizeObserver(() => {
  if (!term.clientWidth) return;
  const s = stick;
  for (let i = reflows.length; i--;) reflows[i].d.isConnected ? reflows[i].update() : reflows.splice(i, 1);
  if (s) term.scrollTop = term.scrollHeight;
}).observe(term);
function readLine(p) {
  promptOverride = p; line.style.display = ''; ta.value = ''; draw(); focusTerm();
  return new Promise((res, rej) => { pending = { res, rej }; });
}
function abortQuiz(silent) {
  if (!cur) return;
  cur.aborted = true; cur.silent = !!silent;
  if (pending) { const p = pending; pending = null; p.rej(ABORT); }
  if (silent) cur = null;
}

function run(cmd) {
  const [c, ...args] = cmd.trim().split(/\s+/); const a = args[0];
  if (!c) return;
  if (/^(\.\/|~\/|\/)/.test(c)) {                       // path execution: ./Desktop/quiz, ./quiz (in Desktop), ~/Desktop/quiz, absolute
    const home = '/home/' + USER + '/';
    const abs = c.startsWith('~/') ? home + c.slice(2) : c.startsWith('/') ? c : home + (cwd === 'Desktop' ? 'Desktop/' : '') + c.slice(2);
    if (abs === home + 'Desktop/quiz') runQuiz();
    else print(`bash: ${c}: No such file or directory`);
    return;
  }
  switch (c) {
    case 'clear': [...term.children].forEach(n => n !== line && n.remove()); break;
    case 'pwd': print(cwd === '~' ? '/home/' + USER : '/home/' + USER + '/Desktop'); break;
    case 'echo': print(args.join(' ')); break;
    case 'ls': print(ls().join('  ')); break;
    case 'cd':
      if (!a || a === '~') cwd = '~';
      else if (a === '..' ) cwd = '~';
      else if ((a === 'Desktop' || a === 'Desktop/') && cwd === '~') cwd = 'Desktop';
      else print(`bash: cd: ${a}: No such file or directory`);
      break;
    case 'cat':                                          // placeholder cat
      if (!a) break;
      if (a === 'quiz' && cwd === 'Desktop') print('ELF\u0001\u0001\u0001  [binary placeholder - cat output]');
      else print(`cat: ${a}: No such file or directory`);
      break;
    default: print(`bash: ${c}: command not found`);
  }
}
function focusTerm() { ta.focus(); draw(); }
$('#winbody').addEventListener('mousedown', () => setTimeout(() => { if (!getSelection().toString()) focusTerm(); }));
['input', 'keyup', 'click'].forEach(ev => ta.addEventListener(ev, draw));
document.addEventListener('selectionchange', () => document.activeElement === ta && draw());

ta.addEventListener('keydown', e => {
  if (cur) {                                               // quiz is running
    const ctrl = e.ctrlKey && e.key.toLowerCase();
    if (ctrl === 'c') { e.preventDefault(); abortQuiz(); return; }
    if (['ArrowUp', 'ArrowDown', 'Tab'].includes(e.key) || ctrl === 'l' || !pending) { e.preventDefault(); return; }
  }
  if (e.key === 'Enter') {
    e.preventDefault();
    if (pending) {
      print(prompt() + ta.value);
      const p = pending, v = ta.value; pending = null; promptOverride = null; ta.value = ''; line.style.display = 'none';
      p.res(v); return;
    }
    print(prompt() + ta.value);
    const cmd = ta.value; ta.value = '';
    if (cmd.trim() && hist[hist.length - 1] !== cmd) { hist.push(cmd); saveHist(); }
    hi = hist.length; draft = '';
    run(cmd); draw();
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    if (hi === hist.length) draft = ta.value;
    hi = Math.min(Math.max(hi + (e.key === 'ArrowUp' ? -1 : 1), 0), hist.length);
    ta.value = hi === hist.length ? draft : hist[hi];
    ta.setSelectionRange(ta.value.length, ta.value.length); draw();
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const m = ta.value.match(/^(cd|ls|cat)\s+(\S*)$/);
    if (m) { const hit = ls().find(n => n.startsWith(m[2])); if (hit) { ta.value = m[1] + ' ' + hit; draw(); } }
    else if (cwd === '~' && /^\.\/\S*$/.test(ta.value) && './Desktop/quiz'.startsWith(ta.value)) { ta.value = './Desktop/quiz'; draw(); }
    else if (/^\.\/\S*$/.test(ta.value) && cwd === 'Desktop' && 'quiz'.startsWith(ta.value.slice(2))) { ta.value = './quiz'; draw(); }
  } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
    e.preventDefault(); run('clear'); draw();
  } else if (e.ctrlKey && e.key.toLowerCase() === 'c' && ta.selectionStart === ta.selectionEnd) {
    e.preventDefault(); print(prompt() + ta.value + '^C'); ta.value = ''; draw();
  }
});
// paste: plain text only, single line; files/images are ignored
ta.addEventListener('paste', e => {
  e.preventDefault();
  const t = e.clipboardData.getData('text/plain');
  if (!t) return;
  ta.setRangeText(t.replace(/[\r\n]+/g, ' '), ta.selectionStart, ta.selectionEnd, 'end'); draw();
});
['drop', 'dragover'].forEach(ev => ta.addEventListener(ev, e => e.preventDefault()));

draw();
