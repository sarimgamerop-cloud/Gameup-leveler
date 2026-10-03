/* Second window: 2D plot viewer (non-resizable, 3 working buttons, taskbar entry) */
const pwin = $('#win2'), ptask = $('#ptask'), pbody = $('#pbody'), cv = $('#plot');
let plotData = null;
const pOpen = () => !pwin.classList.contains('closed');
const psync = () => { ptask.classList.toggle('off', !pOpen()); ptask.classList.toggle('active', pOpen()); };
function openPlot(ans) {
  plotData = ans; pwin.classList.remove('closed');
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

function drawPlot() {
  if (!plotData || !pbody.clientWidth) return;
  const dpr = devicePixelRatio || 1, W = pbody.clientWidth, H = pbody.clientHeight;
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
  const g = cv.getContext('2d'); g.scale(dpr, dpr);
  const m = { l: 44, r: 20, t: 40, b: 34 }, pw = W - m.l - m.r, ph = H - m.t - m.b;
  const X = v => m.l + pw * (v + 1) / 2, Y = v => m.t + ph * (1 - (v + 1) / 2);
  g.fillStyle = '#0d0f22'; g.fillRect(0, 0, W, H);
  g.font = '11px "JetBrainsMono Nerd Font","JetBrains Mono",monospace';
  g.lineWidth = 1;
  for (let i = 0; i <= 8; i++) {
    const v = -1 + i / 4;
    g.strokeStyle = i === 4 ? '#4a4f6a' : '#23264a';
    g.beginPath(); g.moveTo(X(v), m.t); g.lineTo(X(v), m.t + ph); g.moveTo(m.l, Y(v)); g.lineTo(m.l + pw, Y(v)); g.stroke();
    g.fillStyle = '#6b708a'; g.textAlign = 'center'; g.fillText(v.toFixed(1), X(v), H - 14);
    g.textAlign = 'right'; g.fillText(v.toFixed(1), m.l - 6, Y(v) + 4);
  }
  g.textAlign = 'left'; g.fillStyle = '#d8dae5';
  g.fillText('plot2d.png  -  PC1 vs PC2  (placeholder data)', m.l, 22);
  const COL = { A: '#ff6b9d', B: '#7ee787', C: '#f0d56b', D: '#6fa8ff' };
  const CEN = { A: [-.5, .5], B: [.5, .5], C: [-.5, -.5], D: [.5, -.5] };
  let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const pts = plotData.map(a => ({ a, x: CEN[a][0] + (r() - .5) * .7, y: CEN[a][1] + (r() - .5) * .7 }));
  for (const p of pts) { g.fillStyle = COL[p.a]; g.globalAlpha = .85; g.beginPath(); g.arc(X(p.x), Y(p.y), 6, 0, 7); g.fill(); }
  g.globalAlpha = 1;
  const cx = pts.reduce((t, p) => t + p.x, 0) / pts.length, cy = pts.reduce((t, p) => t + p.y, 0) / pts.length;
  g.strokeStyle = '#fff'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(X(cx) - 9, Y(cy)); g.lineTo(X(cx) + 9, Y(cy)); g.moveTo(X(cx), Y(cy) - 9); g.lineTo(X(cx), Y(cy) + 9); g.stroke();
  g.fillStyle = '#fff'; g.fillText('you', X(cx) + 12, Y(cy) - 8);
  let lx = W - m.r - 4 * 44;
  for (const k of 'ABCD') { g.fillStyle = COL[k]; g.beginPath(); g.arc(lx, 21, 5, 0, 7); g.fill(); g.fillStyle = '#d8dae5'; g.fillText(k, lx + 10, 25); lx += 44; }
}
