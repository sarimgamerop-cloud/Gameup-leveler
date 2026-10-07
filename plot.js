/* Result window: where the user lands on the 2D plane
   Needs locate() / ARCH from questions.js. Only this file controls the window and the drawing. */
   
const pwin = $('#win2'), ptask = $('#ptask'), pbody = $('#pbody'), cv = $('#plot');
let plotData = null, view = { cx: 0, cy: 0, s: 1 };
const COLORS = ['#ff6b9d', '#7ee787', '#f0d56b', '#6fa8ff', '#d58cff', '#5fe3e3'];   // per ARCH index
const pOpen = () => !pwin.classList.contains('closed');
const psync = () => { ptask.classList.toggle('off', !pOpen()); ptask.classList.toggle('active', pOpen()); };

function openPlot(ans) {
  plotData = ans; view = { cx: 0, cy: 0, s: 1 };
  if (!pOpen()) {                                  // bigger window, centered on the desktop
    const w = Math.min(760, innerWidth - 40), h = Math.min(580, innerHeight - TB - 40);
    Object.assign(pwin.style, { width: w + 'px', height: h + 'px', left: (innerWidth - w) / 2 + 'px', top: Math.max(10, (innerHeight - TB - h) / 2) + 'px' });
  }
  pwin.classList.remove('closed');
  requestAnimationFrame(() => { pwin.classList.remove('hidden'); front(pwin); drawPlot(); });
  psync();
}
$('#p-min').onclick = () => pwin.classList.add('hidden');
$('#p-max').onclick = () => pwin.classList.toggle('max');
$('#p-close').onclick = () => { pwin.classList.add('closed'); psync(); };
ptask.onclick = () => {
  if (pwin.classList.contains('hidden')) { pwin.classList.remove('hidden'); front(pwin); } else pwin.classList.add('hidden');
};
new ResizeObserver(() => drawPlot()).observe(pbody);

/* ---- layout shared by drawing + interaction ---- */
const M = { l: 14, r: 14, t: 66, b: 14 };
function geo() {
  const W = pbody.clientWidth, H = pbody.clientHeight, pw = W - M.l - M.r, ph = H - M.t - M.b;
  const unit = Math.min(pw, ph) / 2.2 * view.s;                       // pixels per world unit
  return { W, H, pw, ph, unit, ox: M.l + pw / 2, oy: M.t + ph / 2 };
}
const toX = (g, wx) => g.ox + (wx - view.cx) * g.unit, toY = (g, wy) => g.oy - (wy - view.cy) * g.unit;

/* ---- pan / zoom ---- */
let drag = null;
cv.style.touchAction = 'none';
cv.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY }; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing'; });
cv.addEventListener('pointermove', e => {
  if (!drag) return;
  const g = geo();
  view.cx = Math.max(-2, Math.min(2, view.cx - (e.clientX - drag.x) / g.unit));
  view.cy = Math.max(-2, Math.min(2, view.cy + (e.clientY - drag.y) / g.unit));
  drag = { x: e.clientX, y: e.clientY }; drawPlot();
});
const endDrag = () => { drag = null; cv.style.cursor = ''; };
cv.addEventListener('pointerup', endDrag); cv.addEventListener('pointercancel', endDrag);
cv.addEventListener('dblclick', () => { view = { cx: 0, cy: 0, s: 1 }; drawPlot(); });
cv.addEventListener('wheel', e => {
  e.preventDefault();
  const r = cv.getBoundingClientRect(), g = geo(), mx = e.clientX - r.left, my = e.clientY - r.top;
  const wx = view.cx + (mx - g.ox) / g.unit, wy = view.cy - (my - g.oy) / g.unit;   // world point under cursor
  view.s = Math.max(.6, Math.min(6, view.s * Math.exp(-e.deltaY * .0015)));
  const u = geo().unit;
  view.cx = wx - (mx - g.ox) / u; view.cy = wy + (my - g.oy) / u;                    // keep it under the cursor
  drawPlot();
}, { passive: false });

/* ---- drawing ---- */
function drawPlot() {
  if (!plotData || !pbody.clientWidth) return;
  const res = locate(plotData), g = geo(), dpr = devicePixelRatio || 1;
  cv.width = g.W * dpr; cv.height = g.H * dpr; cv.style.width = g.W + 'px'; cv.style.height = g.H + 'px';
  const c = cv.getContext('2d'); c.scale(dpr, dpr);
  c.fillStyle = '#0d0f22'; c.fillRect(0, 0, g.W, g.H);
  c.font = '11px "JetBrainsMono Nerd Font","JetBrains Mono",monospace';

  // header: result and nearest categories
  const top = res.near[0], idx = n => COLORS[ARCH.findIndex(a => a.n === n)];
  c.textAlign = 'left'; c.fillStyle = '#d8dae5'; c.font = '14px "JetBrainsMono Nerd Font","JetBrains Mono",monospace';
  c.fillText('you land closest to ', M.l, 24);
  const w0 = c.measureText('you land closest to ').width;
  c.fillStyle = idx(top.n); c.fillText(`${top.n} (${top.pct}%)`, M.l + w0, 24);
  c.font = '11px "JetBrainsMono Nerd Font","JetBrains Mono",monospace';
  c.fillStyle = '#9aa0bd'; c.fillText('nearest: ' + res.near.slice(0, 3).map(a => `${a.n} ${a.pct}%`).join('   '), M.l, 43);
  c.fillStyle = '#4a4f6a'; c.fillText('x: inward - outward   y: planned - spontaneous   |   drag to pan, scroll to zoom, double-click to reset', M.l, 58);

  // plane (which is clipped to plot area)
  c.save(); c.beginPath(); c.rect(M.l, M.t, g.pw, g.ph); c.clip();
  const x0 = view.cx - (g.pw / 2) / g.unit, x1 = view.cx + (g.pw / 2) / g.unit;
  const y0 = view.cy - (g.ph / 2) / g.unit, y1 = view.cy + (g.ph / 2) / g.unit;
  c.lineWidth = 1;
  for (let v = Math.floor(x0 * 4) / 4; v <= x1; v += .25) { c.strokeStyle = Math.abs(v) < 1e-6 ? '#4a4f6a' : '#23264a'; c.beginPath(); c.moveTo(toX(g, v), M.t); c.lineTo(toX(g, v), M.t + g.ph); c.stroke(); }
  for (let v = Math.floor(y0 * 4) / 4; v <= y1; v += .25) { c.strokeStyle = Math.abs(v) < 1e-6 ? '#4a4f6a' : '#23264a'; c.beginPath(); c.moveTo(M.l, toY(g, v)); c.lineTo(M.l + g.pw, toY(g, v)); c.stroke(); }
  c.strokeStyle = '#4a4f6a'; c.setLineDash([5, 5]); c.strokeRect(toX(g, -1), toY(g, 1), 2 * g.unit, 2 * g.unit); c.setLineDash([]);
  c.fillStyle = '#6b708a'; c.textAlign = 'center';
  for (let v = Math.ceil(x0 * 2) / 2; v <= x1; v += .5) c.fillText(v.toFixed(1), toX(g, v), M.t + g.ph - 5);
  c.textAlign = 'left';
  for (let v = Math.ceil(y0 * 2) / 2; v <= y1; v += .5) c.fillText(v.toFixed(1), M.l + 4, toY(g, v) - 4);

  const ux = toX(g, res.x), uy = toY(g, res.y);                        // dashed link you -> nearest
  c.strokeStyle = idx(top.n); c.setLineDash([4, 4]); c.beginPath(); c.moveTo(ux, uy); c.lineTo(toX(g, top.x), toY(g, top.y)); c.stroke(); c.setLineDash([]);
  ARCH.forEach((a, i) => {                                             // categories
    c.fillStyle = COLORS[i]; c.beginPath(); c.arc(toX(g, a.x), toY(g, a.y), 6, 0, 7); c.fill();
    c.textAlign = 'center'; c.fillText(a.n, toX(g, a.x), toY(g, a.y) + 20);
  });
  c.strokeStyle = '#fff'; c.lineWidth = 2;                             // you
  c.beginPath(); c.moveTo(ux - 9, uy); c.lineTo(ux + 9, uy); c.moveTo(ux, uy - 9); c.lineTo(ux, uy + 9); c.stroke();
  c.fillStyle = '#fff'; c.textAlign = 'left'; c.fillText('you', ux + 12, uy - 8);
  c.restore();
}