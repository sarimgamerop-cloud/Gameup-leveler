// quiz interface file made by arctrus
const ABORT = Symbol('abort');
const K = (c, t) => `\x1b[${c}m${t}\x1b[0m`;
const lerp = (a, b, t) => Math.round(a + (b - a) * t);
const glyph = {
  Q: [' ██████╗ ', '██╔═══██╗', '██║   ██║', '██║▄▄ ██║', '╚██████╔╝', ' ╚══▀▀═╝ '],
  U: ['██╗   ██╗', '██║   ██║', '██║   ██║', '██║   ██║', '╚██████╔╝', ' ╚═════╝ '],
  I: ['██╗', '██║', '██║', '██║', '██║', '╚═╝'],
  Z: ['███████╗', '╚══███╔╝', '  ███╔╝ ', ' ███╔╝  ', '███████╗', '╚══════╝']
};
// map art for the terminal:
const banner = cols => cols < 31 ? '\x1b[1;95m▌\x1b[96m QUIZ \x1b[95m▐\x1b[0m'
  : [0, 1, 2, 3, 4, 5].map(i => {
      const t = i / 5, row = [...'QUIZ'].map(c => glyph[c][i]).join('');
      return `\x1b[38;2;${lerp(255, 34, t)};${lerp(107, 211, t)};${lerp(157, 238, t)}m${row}\x1b[0m`;
    }).join('\n');
const TAG = { ok: K(92, ' OK '), info: K(96, 'INFO'), warn: K(93, 'WARN'), run: K(95, 'EXEC') };
const tag = t => `${K(90, '[')}${TAG[t]}${K(90, ']')}`;
const hex = n => [...Array(n)].map(() => (Math.random() * 16 | 0).toString(16)).join('');

// the runQuiz() function that runs the terminal quiz by arctrus :p
async function runQuiz() {
  if (cur) return;
  const run = cur = { aborted: false, silent: false };
  const sleep = ms => new Promise((res, rej) => setTimeout(() => run.aborted ? rej(ABORT) : res(), ms));
  const log = async (t, m, ms = 140) => { printA(`${tag(t)} ${m}`); await sleep(ms); };
  const hdr = t => { printA(''); printA(`${K('1;95', '::')} ${K(1, t)}`); };
  // labels (progress bars.)
  const grad = t => `\x1b[38;2;${lerp(255, 34, t)};${lerp(107, 211, t)};${lerp(157, 238, t)}m`;
  const barStr = (p, w) => {
    const f = Math.floor(w * p); let s = '';
    for (let i = 0; i < f; i++) s += grad(i / Math.max(1, w - 1)) + '━';
    if (f < w) s += K('1;97', '╸') + K(90, '╌'.repeat(w - f - 1));
    return s + '\x1b[0m';
  };
  
  async function progress(label, ms, total) {
    let p = 0;
    printA(`${K('1;95', '›')} ${label}`);
    const r = reflow(c => {
      const pct = String(Math.round(p * 100)).padStart(3) + '%';
      const sfx = total && c >= 56 ? '  ' + K(90, `${(p * total).toFixed(1).padStart(4)}/${total.toFixed(1)} MiB`) : '';
      const w = Math.max(4, Math.min(40, c - 8 - (sfx ? 18 : 0)));
      return `  ${barStr(p, w)}  ${pct}${sfx}`;
    });
    for (let i = 1; i <= 24; i++) { await sleep(ms / 24); p = i / 24; r.update(); }
  }
  setTitle('Quiz'); line.style.display = 'none';
  const answers = [], n = QUESTIONS.length;
  try {
    printA('');
    reflow(banner, 'art');
    printA('');
    reflow(c => K(90, '─'.repeat(Math.min(c, 60))));
    printA(`${K('1;96', 'quiz')} ${K(90, 'v2.4.1-rc3  build 20261002  archx86_64  pid ' + (1000 + Math.random() * 8999 | 0))}`);
    reflow(c => K(90, '─'.repeat(Math.min(c, 60))));
    await sleep(250);
    await log('ok', 'succesfully booted the kernel!');
    await log('ok', `detected (${n} question entries)`);
    await log('ok', `integrity ${K(90, 'sha256:' + hex(16))}`);
    await log('info', 'tty utf-8 / truecolor detected');
    await log('warn', 'telemetry disabled', 300);
    printA('');
    printA(`Answer with ${K('1;96', 'A')} ${K('1;96', 'B')} ${K('1;96', 'C')} ${K('1;96', 'D')} ${K('1;96', 'E')} or ${K('1;96', 'F')} and press Enter. ${K(90, 'Ctrl+C aborts.')}`);
    await sleep(500);

    for (let i = 0; i < n; i++) {
      const q = QUESTIONS[i];
      printA('');
      printA(`${K('1;95', `[${i + 1}/${n}]`)} ${K(1, q.q)}`);
      printA(q.options.map((o, k) => `${K(96, `[${'ABCDEF'[k]}]`)} ${o}`).join('    '));
      for (;;) {
        const a = (await readLine('answer> ')).trim().toUpperCase();
        // the frontend was designed for 4 inputs, but i had 6 roles so changing some code.
        if (/^[A-F]$/.test(a)) { answers.push(a); break; }
        printA(K(91, 'Invalid input: enter A, B, C, D, E or F'));
      }
    }
    line.style.display = 'none';
    printA('');
    printA(`${K('1;92', '>> captured')} ${K(90, n + ' answers')}  ${K(96, answers.join(''))}`);
    await sleep(700);

    hdr('[1/4] downloading dependencies');
    await log('info', 'resolving packages via pip ... pypi.org', 350);
    for (const [f, mb] of [['numpy-1.26.4-cp312-manylinux_x86_64.whl', 17.9], ['scipy-1.13.1-cp312-manylinux_x86_64.whl', 38.2], ['scikit_learn-1.5.2-cp312-manylinux_x86_64.whl', 13.3], ['matplotlib-3.9.2-cp312-manylinux_x86_64.whl', 8.3]])
      await progress(f, 800 + Math.random() * 600, mb);

    hdr('[2/4] installing packages');
    for (const f of ['numpy-1.26.4', 'scipy-1.13.1', 'scikit-learn-1.5.2', 'matplotlib-3.9.2'])
      await log('ok', `installed ${f}`, 220);

    hdr('[3/4] analysing responses');
    const cnt = k => answers.filter(a => a === k).length;
    await log('info', `encoding ${n} answers as a ${n}x4 one-hot matrix`, 300);
    await log('ok', `category counts  ${[...'ABCDEF'].map(k => K(96, k) + ':' + cnt(k)).join('  ')}`, 300);
    await progress('standardizing features', 700);
    await progress('computing covariance matrix', 900);

    hdr('[4/4] generating 2d plot');
    printA(K(90, `$ python3 plot.py --answers ${answers.join('')} --out plot2d.png`));
    await log('run', 'fitting PCA (2 components)', 450);
    await log('ok', `explained variance ${K(96, '0.8312')}`, 300);
    await progress('rendering plot2d.png', 1300);
    await log('ok', 'plot2d.png written (1024x768)', 400);
    await log('info', 'opening viewer ...', 700);
    openPlot(answers);
  } catch (e) {
    if (e !== ABORT) throw e;
    if (!run.silent) { printA('^C'); printA(K(91, 'quiz: aborted by user')); }
  } finally {
    if (cur === run) {
      cur = null; promptOverride = null;
      line.style.display = ''; setTitle(); ta.value = ''; draw();
    }
  }
}
