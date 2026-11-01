/* AVNI Computers - simple builder.
   Four steps: 1 your budget -> 2 machines at that budget, each with what it is best for -> 3 inside the machine,
   change any part to anything at any price -> 4 get it built.
   Every change is checked against the other parts. When a part no longer fits, we change the part that has to
   change, say so in plain words, and the customer can undo it. Prices come from parts.js with their labels. */
(function () {
'use strict';
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
const words = n => {
  if (!n) return '';
  const f = (v, u) => (Math.round(v * 100) / 100).toString() + ' ' + u;
  if (n >= 1e7) return f(n / 1e7, 'crore');
  if (n >= 1e5) return f(n / 1e5, 'lakh');
  if (n >= 1e3) return f(n / 1e3, 'thousand');
  return String(n);
};

/* ------------------------------------------------------------------ the parts */
const SYS_GPU = g => g.sys;
/* "Not included" is a real choice for every part, at ₹0. If the customer leaves a part out, we do not add it back
   and we do not tell him it is necessary (owner's rule, 01-11-2026). */
const NONE = { id: 'none', n: 'Not included — leave this part out', b: '—', none: 1, inr: 0 };
const withNone = list => list.some(x => x.id === 'none') ? list.map(x => x.id === 'none' ? Object.assign(x, { none: 1, n: 'Not included — leave this part out', note: undefined }) : x) : [NONE].concat(list);                         // B200 / MI300X: sold only inside an 8-GPU server
const CATS = [
  { k: 'cpu', t: 'Processor', why: 'The brain. Decides how fast everything runs.', list: withNone(CPU.filter(c => c.p !== 'SYSTEM')) },
  { k: 'board', t: 'Motherboard', why: 'Joins every part. Decides which processor, memory and how many cards fit.', list: withNone(BOARD) },
  { k: 'ram', t: 'Memory (RAM)', why: 'Working space. More memory = more open at once, bigger files and AI models.', list: withNone(RAM) },
  { k: 'gpu', t: 'Graphics card', why: 'Games, video, 3D and AI run on it. Its memory decides which AI models fit.', list: withNone(GPU.filter(g => !SYS_GPU(g))) },
  { k: 'ssd', t: 'Storage (SSD / disk)', why: 'Where your files live. Faster drives open things faster.', list: withNone(SSD) },
  { k: 'psu', t: 'Power supply', why: 'Feeds every part. We keep a safe margin above full load.', list: withNone(PSU) },
  { k: 'cooler', t: 'Cooler', why: 'Keeps the processor cool so it stays fast.', list: withNone(COOLER) },
  { k: 'case', t: 'Cabinet', why: 'Holds everything and moves air through it.', list: withNone(CASES) },
  { k: 'os', t: 'Windows / operating system', why: 'The software the machine starts with.', list: OS.map(o => o.id === 'os-none' ? Object.assign(o, { none: 1, n: 'Not included — leave this part out' }) : o) }
];
const CAT = Object.fromEntries(CATS.map(c => [c.k, c]));
const get = (k, id) => CAT[k].list.find(x => x.id === id) || CAT[k].list.find(x => !x.none) || CAT[k].list[0];

/* price with its label: est = our estimate, seen = listing seen, fx = launch price converted, quote = on quotation */
function price(it) {
  if (!it) return { v: 0, k: 'est' };
  if (it.inr != null) return { v: it.inr, k: 'est' };
  if (it.seen && it.seen.length) return { v: it.seen[0].p, k: 'seen' };
  if (it.usd) return { v: Math.round(it.usd * FX.usdInr / 100) * 100, k: 'fx' };
  return { v: null, k: 'quote' };
}
const PLABEL = { est: 'Our estimate', seen: 'Listing seen 18-10-2026', fx: 'Launch price converted', quote: 'On quotation' };
const PTIP = {
  est: 'Our working number in rupees including GST. Not a quotation. We confirm the price before we build.',
  seen: 'A real Amazon.in listing we saw on 18-10-2026. One seller, one moment.',
  fx: 'The maker\'s launch price in US$ × ₹' + FX.usdInr + '. Before GST and import duty, so the Indian price is usually higher.',
  quote: 'No fair number yet. We ask sellers and makers for a quotation.'
};
const enginePrice = it => { const p = price(it); return (p.k === 'est' || p.k === 'seen') ? p.v : null; };

/* ------------------------------------------------------------------ what fits what */
const memFam = b => b.mem.split(' ')[0];
const isUsed = it => it && (it.cond === 'used');
function cpuFitsBoard(c, b) {
  if (b.p !== c.p) return false;
  if (!(c.mem || []).includes(memFam(b))) return false;
  if (b.maxw && c.w > b.maxw) return false;
  if (c.p === 'LGA4677' && !!c.w790 !== !!b.w790) return false;
  if (b.s > 1 && (c.ms || 1) < 2) return false;
  return true;
}
const gpuCap = (b, g) => (!g || g.id === 'none') ? 1 : (g.sl <= 1 ? b.x16 : (b.wide || 1));
const ramFits = (r, b) => r.type === b.mem && r.mods <= b.dimm && r.gb <= b.max;
function coolerFits(co, c, b) {
  if (b.oem) return !!co.server;
  if (co.id === 'cool-box') return !!c.box && c.w <= co.cap;
  const f = COOLER_FIT[co.id];
  return !!f && f.includes(c.p) && co.cap >= c.w;
}
const bigCard = g => g && g.id !== 'none' && (g.sl || 0) >= 2.5;            // long, thick cards need a roomy cabinet
const caseFits = (cs, b, gN, g) => cs.ff.includes(b.ff) && cs.gpus >= gN && (!!b.oem === !!cs.oem) && (!(g && g.pas) || cs.rack) && (!bigCard(g) || cs.len >= 360);
const an = w => (/^[AEIOU]/i.test(w) ? 'an ' : 'a ') + w;
function ssdSlots(d, b) {
  if (/M\.2/.test(d.ff)) return b.m2;
  if (/SATA/.test(d.ff)) return b.sata;
  return b.u2 || Math.max(0, b.x16 - 1);          // U.2 / U.3: on the board, or through an adapter card
}
function powerNeed(s) {
  const c = get('cpu', s.cpu), g = get('gpu', s.gpu);
  return Math.round((c.w || 0) * s.cpuN * 1.1 + (g.w || 0) * s.gpuN + 60 + 8 * s.ssdN);
}
const psuFor = (need, b) => {
  const want = need * 1.25;
  if (b.oem) return PSU.find(p => p.server && p.w >= want) || PSU.filter(p => p.server).pop();
  return PSU.filter(p => !p.server).find(p => p.w >= want) || PSU.find(p => p.server && p.w >= want) || PSU[PSU.length - 1];
};
const closest = (arr, v) => arr.slice().sort((a, b) => Math.abs((price(a).v || 0) - v) - Math.abs((price(b).v || 0) - v) || (price(a).v || 0) - (price(b).v || 0))[0];
const sortPriced = arr => arr.slice().sort((a, b) => (price(a).v == null) - (price(b).v == null) || (price(a).v || 0) - (price(b).v || 0));

function bestRam(b, wantGB) {
  const ok = RAM.filter(r => ramFits(r, b));
  if (!ok.length) return null;
  const up = ok.filter(r => r.gb >= wantGB).sort((x, y) => x.gb - y.gb || x.inr - y.inr);
  return up[0] || ok.sort((x, y) => y.gb - x.gb || x.inr - y.inr)[0];
}

/* Make the machine whole again after a change. 'pinned' is the part the customer just chose: it stays. */
function resolve(s0, pinned) {
  const s = Object.assign({}, s0), ch = [];
  const set = (k, v, why) => { if (s[k] !== v) { ch.push({ k, from: s[k], to: v, why }); s[k] = v; } };
  let cpu = get('cpu', s.cpu), board = get('board', s.board), gpu = get('gpu', s.gpu), ram = get('ram', s.ram);

  const N = it => !!it.none;
  if (pinned === 'board' && !N(board) && !N(cpu) && !cpuFitsBoard(cpu, board)) {
    const fits = CAT.cpu.list.filter(c => cpuFitsBoard(c, board) && price(c).v != null);
    const c = closest(fits.length ? fits : CAT.cpu.list.filter(c => cpuFitsBoard(c, board)), price(cpu).v || 0);
    if (c) { set('cpu', c.id, 'the ' + board.n + ' takes ' + PLAT[board.p].label + ' processors'); cpu = c; }
  }
  const boardOk = b => cpuFitsBoard(cpu, b) && b.s >= s.cpuN && gpuCap(b, gpu) >= s.gpuN && (pinned !== 'ram' || ramFits(ram, b));
  if (!N(board) && !N(cpu) && (!boardOk(board) || (pinned === 'cpuN' && s.cpuN === 1 && board.s > 1))) {
    let opts = BOARD.filter(boardOk);
    if (!opts.length && pinned === 'ram') opts = BOARD.filter(b => cpuFitsBoard(cpu, b) && b.s >= s.cpuN && gpuCap(b, gpu) >= s.gpuN);
    if (!opts.length) opts = BOARD.filter(b => cpuFitsBoard(cpu, b));
    const sameS = opts.filter(b => b.s === s.cpuN);
    const pool = sameS.length ? sameS : opts;
    const priced = pool.filter(b => price(b).v != null && !isUsed(b));
    const nb = closest(priced.length ? priced : pool, price(board).v || 0);
    if (nb) {
      let why = 'the ' + cpu.n + ' needs ' + an(PLAT[cpu.p].label) + ' board';
      if (cpuFitsBoard(cpu, board)) why = s.cpuN > board.s ? s.cpuN + ' processors need a ' + s.cpuN + '-socket board'
        : (pinned === 'ram' ? 'the board must take ' + ram.n : s.gpuN + ' graphics cards need ' + s.gpuN + ' wide slots');
      set('board', nb.id, why); board = nb;
    }
  }
  const maxN = N(cpu) ? 1 : Math.min(N(board) ? 8 : board.s, cpu.ms || 1);
  if (s.cpuN > maxN) set('cpuN', maxN, 'this processor and board take ' + maxN);
  if (gpu.id === 'none' && s.gpuN !== 1) s.gpuN = 1;
  const cap = N(board) ? 8 : gpuCap(board, gpu);
  if (s.gpuN > cap) set('gpuN', cap, 'this board holds ' + cap + ' of these cards');

  if (!N(ram) && !N(board) && !ramFits(ram, board)) {
    const r = bestRam(board, ram.gb);
    if (r) set('ram', r.id, 'the board takes ' + board.mem + ' memory, ' + board.dimm + ' slots, up to ' + (board.max >= 1024 ? board.max / 1024 + ' TB' : board.max + ' GB'));
  }
  const co = get('cooler', s.cooler);
  if (!N(co) && !N(cpu) && !N(board) && !coolerFits(co, cpu, board)) {
    const fit = sortPriced(COOLER.filter(x => coolerFits(x, cpu, board)));
    if (fit[0]) set('cooler', fit[0].id, fit[0].server ? 'server boards are cooled by the chassis airflow' : 'the cooler must fit ' + PLAT[cpu.p].label + ' and handle ' + cpu.w + ' W');
  }
  const cs = get('case', s.case);
  if (!N(cs) && !N(board) && !caseFits(cs, board, s.gpuN, gpu)) {
    const fit = sortPriced(CASES.filter(x => caseFits(x, board, s.gpuN, gpu)));
    if (fit[0]) set('case', fit[0].id, 'the cabinet must take ' + an(board.ff) + ' board' + (s.gpuN > 1 ? ' and ' + s.gpuN + ' cards' : '') + (gpu.pas ? ' and give server airflow' : '') + (bigCard(gpu) && cs.len < 360 ? ' and have room for a long graphics card' : ''));
  }
  const d = get('ssd', s.ssd), slots = (N(d) || N(board)) ? 16 : ssdSlots(d, board);
  if (N(d)) s.ssdN = 1;
  else if (slots < 1) {
    const alt = SSD.filter(x => ssdSlots(x, board) > 0 && price(x).v != null).sort((a, b) => Math.abs(a.tb - d.tb) - Math.abs(b.tb - d.tb) || price(a).v - price(b).v)[0];
    if (alt) set('ssd', alt.id, 'this board has no slot for ' + an(d.ff) + ' drive');
  } else if (s.ssdN > slots) set('ssdN', slots, 'the board has ' + slots + ' slots for this drive');
  const need = powerNeed(s), p = get('psu', s.psu);
  if (!N(p) && (p.w < need * 1.25 || (!!board.oem !== !!p.server))) {
    const np = psuFor(need, board);
    set('psu', np.id, 'the machine draws about ' + need + ' W at full load; we keep 25% spare');
  }
  return { s, ch };
}
function settle(s, pinned) {
  let r = resolve(s, pinned), all = r.ch;
  for (let i = 0; i < 3; i++) { const r2 = resolve(r.s, pinned); if (!r2.ch.length) break; all = all.concat(r2.ch); r = r2; }
  return { s: r.s, ch: all };
}

/* ------------------------------------------------------------------ the machine in numbers */
function lines(s) {
  return [
    ['cpu', s.cpuN], ['board', 1], ['ram', 1], ['gpu', s.gpuN], ['ssd', s.ssdN], ['psu', 1], ['cooler', s.cpuN], ['case', 1], ['os', 1]
  ].map(([k, q]) => { const it = get(k, s[k]); const p = price(it); return { k, it, q, p, sum: p.v == null ? null : p.v * q }; });
}
function total(s) {
  const L = lines(s);
  return {
    v: L.reduce((a, l) => a + (l.sum || 0), 0),
    quote: L.filter(l => l.p.v == null).length,
    fx: L.filter(l => l.p.k === 'fx').length,
    L
  };
}
function metrics(s) {
  const c = get('cpu', s.cpu), g = get('gpu', s.gpu), b = get('board', s.board), r = get('ram', s.ram), d = get('ssd', s.ssd);
  const arch = ARCH[c.a] || .8, cc = c.c || 0, cg = c.g || 0;
  const eff = c.pc ? c.pc + (cc - c.pc) * 0.45 : cc;
  const gi = g.id === 'none' ? (c.ig ? 4 : 0) : g.gi;
  return {
    st: cg * arch, mt: eff * cg * arch * s.cpuN, cores: cc * s.cpuN,
    gi, giSum: gi * s.gpuN, vram: g.vram || 0, vramT: (g.vram || 0) * s.gpuN, cuda: !!g.cuda, pro: !!g.pro,
    ramGB: r.gb || 0, ecc: !!r.ecc, bmc: !!b.bmc, x3d: !!c.x3d, tb: (d.tb || 0) * s.ssdN, nGpu: g.id === 'none' ? 0 : s.gpuN
  };
}

/* What a machine is best for, in plain words. Ordered by how strong the machine is at each. */
function bestFor(s, prof) {
  const m = metrics(s), out = [];
  if (m.gi >= 110) out.push({ g: 'game', w: 9, t: '4K gaming at the highest settings, with ray tracing' });
  else if (m.gi >= 75) out.push({ g: 'game', w: 8, t: '4K gaming at high settings, 1440p at very high frame rates' });
  else if (m.gi >= 50) out.push({ g: 'game', w: 7, t: '1440p gaming at high settings' });
  else if (m.gi >= 25) out.push({ g: 'game', w: 5, t: '1080p gaming at high settings' });
  else if (m.gi >= 10) out.push({ g: 'game', w: 2, t: 'Light games: esports titles at 1080p' });
  const llm = AIMODELS.filter(a => a.kind === 'llm' && a.q4 <= m.vramT * 0.95).sort((a, b) => b.q4 - a.q4)[0];
  if (m.vramT >= 8 && llm) out.push({ g: 'ai', w: Math.min(10, 3 + m.vramT / 16), t: 'AI on your own machine: runs ' + llm.n + (m.nGpu > 1 ? ' across ' + m.nGpu + ' cards' : ' on the graphics card') + (m.cuda ? '' : ' (non-NVIDIA: fewer AI tools support it)') });
  else if (m.vramT >= 6) out.push({ g: 'ai', w: 2, t: 'Small AI models, speech-to-text and image tools' });
  if (m.cores >= 64) out.push({ g: 'cpu', w: 9, t: 'Heavy rendering, simulation and many virtual machines at once (' + m.cores + ' cores)' });
  else if (m.cores >= 24) out.push({ g: 'cpu', w: 7, t: 'Fast 3D rendering and 4K video export (' + m.cores + ' cores)' });
  else if (m.cores >= 12) out.push({ g: 'cpu', w: 5, t: 'Video editing, 3D and coding with many apps open' });
  else if (m.cores >= 6) out.push({ g: 'cpu', w: 3, t: 'Smooth office work, coding and photo editing' });
  else if (m.cores > 0) out.push({ g: 'cpu', w: 2, t: 'Office work, billing, email and browsing' });
  if (m.st >= 5.3 && m.cores < 64) out.push({ g: 'cad', w: 6, t: 'CAD, AutoCAD, SolidWorks and Excel: high speed per core' });
  if (m.pro) out.push({ g: 'cad', w: 6, t: 'Certified workstation graphics for CAD and design software' });
  if (m.ecc && m.bmc) out.push({ g: 'srv', w: 6, t: '24×7 server: error-correcting memory and remote management' });
  else if (m.ecc) out.push({ g: 'srv', w: 4, t: 'Error-correcting (ECC) memory for long, safe runs' });
  if (m.ramGB >= 512) out.push({ g: 'srv', w: 7, t: 'Very large data sets and databases in memory (' + (m.ramGB >= 1024 ? m.ramGB / 1024 + ' TB' : m.ramGB + ' GB') + ')' });
  if (!out.length) out.push({ w: 0, t: 'Choose a processor to see what this machine can do' });
  const BOOST = { gaming: ['game'], ai: ['ai'], creator: ['cpu'], cad: ['cad'], server: ['srv', 'cpu'], office: ['cpu'] }[prof] || [];
  out.forEach(x => { if (BOOST.includes(x.g)) x.w += 10; });
  return out.sort((a, b) => b.w - a.w).slice(0, 4).map(x => x.t);
}

/* Warnings only (owner, 01-11-2026: "Just a warning would be ok"). A part left out stays out; we say what that means. */
function warnings(s) {
  const W = {}, c = get('cpu', s.cpu), b = get('board', s.board), g = get('gpu', s.gpu);
  if (c.none) W.cpu = 'Without a processor the machine will not start.';
  if (b.none) W.board = 'Without a motherboard the parts cannot be joined — the machine will not start.';
  if (get('ram', s.ram).none) W.ram = 'Without memory the machine will not start.';
  if (get('psu', s.psu).none) W.psu = 'Without a power supply the machine gets no power and will not start.';
  if (get('cooler', s.cooler).none && !c.none) W.cooler = 'Without a cooler the processor overheats and shuts down within seconds.' + (c.box ? ' This processor comes with a cooler in the box — choose "Cooler included with the processor" to use it.' : '');
  if (get('ssd', s.ssd).none) W.ssd = 'Without storage the machine powers on but has nowhere to install Windows or keep files.';
  if (g.id === 'none' && !c.none && !c.ig && !b.bmc) W.gpu = 'This processor has no built-in graphics — without a graphics card no picture will show on the screen.';
  if (get('case', s.case).none) W.case = 'Without a cabinet the parts sit open on a table: it works, but with no protection and poor airflow.';
  return W;
}

/* ------------------------------------------------------------------ suggested machines (step 2) */
const PROFILES = [
  { k: 'gaming', t: 'Gaming machine', sub: 'Smooth, good-looking games', gN: () => [1] },
  { k: 'creator', t: 'Video & 3D machine', sub: 'Editing, rendering, design', gN: () => [1] },
  { k: 'ai', t: 'AI machine', sub: 'Run AI models on your own machine', gN: b => b >= 400000 ? [1, 2, 3, 4, 6, 7, 8] : [1, 2] },
  { k: 'cad', t: 'CAD & engineering machine', sub: 'AutoCAD, SolidWorks, Revit, Excel', gN: () => [1] },
  { k: 'server', t: 'Server for many users', sub: '24×7: files, database, virtual machines', gN: () => [1] },
  { k: 'office', t: 'Office & home machine', sub: 'Billing, Excel, email, study', gN: () => [1] }
];
const tier = (B, steps) => { for (const [lim, v] of steps) if (B < lim) return v; return steps[steps.length - 1][1]; };
function ramWant(p, B, m) {
  switch (p) {
    case 'gaming': return tier(B, [[80000, 16], [300000, 32], [Infinity, 64]]);
    case 'creator': return tier(B, [[100000, 32], [300000, 64], [1000000, 128], [Infinity, 256]]);
    case 'cad': return tier(B, [[100000, 32], [400000, 64], [Infinity, 128]]);
    case 'ai': return Math.max(32, m.vramT * 2);
    case 'server': return Math.max(32, m.cores * 4);
    default: return tier(B, [[30000, 8], [Infinity, 16]]);
  }
}
function ssdWant(p, B) {
  switch (p) {
    case 'gaming': return tier(B, [[80000, 1], [400000, 2], [Infinity, 4]]);
    case 'creator': return tier(B, [[100000, 1], [300000, 2], [1000000, 4], [Infinity, 8]]);
    case 'cad': return tier(B, [[100000, 1], [Infinity, 2]]);
    case 'ai': return tier(B, [[300000, 2], [1000000, 4], [Infinity, 8]]);
    case 'server': return tier(B, [[500000, 2], [Infinity, 4]]);
    default: return 0.5;
  }
}
function score(p, m, B, cost) {
  switch (p) {
    case 'gaming': return m.gi + m.st * 6 + (m.x3d ? 6 : 0) + Math.min(m.ramGB, 64) * 0.05 + Math.min(m.tb, 4) * 0.5;
    case 'creator': return m.mt * 0.8 + m.gi * 0.3 + m.vram * 0.4 + m.st * 3 + Math.min(m.ramGB, 256) * 0.03 + Math.min(m.tb, 8) * 0.6;
    case 'ai': return m.vramT * (m.cuda ? 1.6 : 1) + m.giSum * 0.15 + m.mt * 0.05 + Math.min(m.ramGB, 2 * m.vramT + 64) * 0.01;
    case 'cad': return m.st * 10 + m.gi * 0.2 + (m.pro ? 25 : 0) + m.mt * 0.12 + Math.min(m.ramGB, 128) * 0.03;
    case 'server': return m.mt + Math.min(m.ramGB, 4096) * 0.03 + (m.ecc ? 15 : 0) + (m.bmc ? 10 : 0) + Math.min(m.tb, 16) * 0.5;
    default: return m.st * 4 + m.mt * 0.3 + Math.min(m.ramGB, 32) * 0.1 - (cost / Math.max(B, 1)) * 60;
  }
}
function meets(p, m) {
  switch (p) {
    case 'gaming': return m.gi >= 10;
    case 'ai': return m.vramT >= 8;
    case 'creator': return m.cores >= 8 && m.gi >= 10;
    case 'cad': return m.st >= 4;
    case 'server': return m.cores >= 8;
    default: return true;
  }
}
function suggest(B, allowUsed) {
  const ok = it => enginePrice(it) != null && (allowUsed || !isUsed(it)) && (!it.none || it.id === 'none' && it.vram === 0);
  const cpus = CAT.cpu.list.filter(ok);
  const gpus = CAT.gpu.list.filter(g => ok(g) && !g.pas);
  const boards = BOARD.filter(b => ok(b) && !b.oem);
  const coolers = sortPriced(COOLER.filter(c => enginePrice(c) != null));
  const cases = sortPriced(CASES.filter(c => enginePrice(c) != null));
  /* COOLER and CASES carry no 'none' entry themselves - withNone() made a new list for the picker */
  const psus = PSU.filter(p => enginePrice(p) != null && !p.server);
  const res = [], usedPairs = new Set();
  for (const P of PROFILES) {
    if (P.k === 'office' && B > 150000) continue;
    if (P.k === 'server' && B < 60000) continue;
    let best = null;
    for (const c of cpus) {
      const cp = enginePrice(c);
      if (cp > B) continue;
      for (const cN of ((c.ms || 1) >= 2 && (P.k === 'server' || P.k === 'ai' || P.k === 'creator') ? [1, 2] : [1])) {
        if (cp * cN > B) continue;
        const bs = boards.filter(b => cpuFitsBoard(c, b) && (cN === 1 ? b.s === 1 || !boards.some(x => cpuFitsBoard(c, x) && x.s === 1) : b.s >= cN))
          .sort((a, b) => enginePrice(a) - enginePrice(b));
        if (!bs.length) continue;
        let gl = gpus;
        if (P.k === 'server' || P.k === 'office') {
          gl = [gpus.find(g => g.id === 'none'), gpus.find(g => g.id === 'gt710')].filter(Boolean);
        }
        for (const g of gl) {
          if (usedPairs.has(c.id + '|' + g.id)) continue;
          if (g.id === 'gt710' && c.ig) continue;                    // a display card only when the processor has no graphics
          if (P.k === 'gaming' && g.pro) continue;                   // workstation cards are not bought for games
          if (g.id === 'none' && !c.ig && !bs.some(b => b.bmc)) continue;
          if (P.k !== 'server' && P.k !== 'office' && g.id !== 'none' && g.gi < 10 && P.k !== 'cad') continue;
          for (const gN of (g.id === 'none' ? [1] : P.gN(B))) {
            const base = cp * cN + enginePrice(g) * gN;
            if (base > B) break;
            let bOk = bs.filter(x => gpuCap(x, g) >= gN && (g.id !== 'none' || c.ig || x.bmc) && (P.k !== 'server' || x.bmc || !bs.some(y => y.bmc)));
            if (P.k !== 'server' && bOk.some(x => !x.bmc)) bOk = bOk.filter(x => !x.bmc);   // server boards only for servers
            if (!bOk.length) continue;
            // a better board when the budget or the processor deserves it, but no showpiece boards for a desktop
            const bCap = Math.max(enginePrice(bOk[0]), Math.min(Math.max(B * 0.06, cp * 0.4), c.ms > 1 || /WRX|TRX|SP|LGA4677|sWRX/.test(c.p) ? Infinity : 60000));
            const b = bOk.filter(x => enginePrice(x) <= bCap).pop();
            const s = { cpu: c.id, cpuN: cN, board: b.id, gpu: g.id, gpuN: gN, ssdN: 1, os: 'os-none' };
            const m0 = { vramT: (g.vram || 0) * gN, cores: c.c * cN };
            const r = bestRam(b, ramWant(P.k, B, m0));
            if (!r) continue;
            s.ram = r.id;
            const tbW = ssdWant(P.k, B);
            const ds = SSD.filter(d => enginePrice(d) != null && ssdSlots(d, b) > 0 && d.tb >= tbW && !/Hard disk/.test(d.nand) && (allowUsed || !isUsed(d)));
            const d = (ds.filter(x => x.nand === 'TLC').sort((x, y) => x.inr - y.inr)[0]) || ds.sort((x, y) => enginePrice(x) - enginePrice(y))[0];
            if (!d) continue;
            s.ssd = d.id;
            const co = coolers.find(x => coolerFits(x, c, b));
            const csOk = cases.filter(x => caseFits(x, b, gN, g));
            const csCap = csOk.length ? Math.max(enginePrice(csOk[0]), Math.min(B * 0.03, P.k === 'server' ? Infinity : 22000)) : 0;
            const cs = csOk.filter(x => enginePrice(x) <= csCap).pop();
            const need = powerNeed(s);
            const ps = psus.find(x => x.w >= need * 1.25);
            if (!co || !cs || !ps) continue;
            s.cooler = co.id; s.case = cs.id; s.psu = ps.id;
            const cost = base + enginePrice(b) + r.inr + enginePrice(d) + enginePrice(co) * cN + enginePrice(cs) + enginePrice(ps);
            if (cost > B) continue;
            const sc = score(P.k, metrics(s), B, cost);
            if (!best || sc > best.sc + 1e-9 || (Math.abs(sc - best.sc) < 1e-9 && cost < best.cost)) best = { sc, cost, s };
          }
        }
      }
    }
    if (best && !meets(P.k, metrics(best.s))) best = null;          // the title must be true of the machine
    if (best) { res.push({ P, s: best.s, cost: best.cost }); usedPairs.add(best.s.cpu + '|' + best.s.gpu); }
  }
  const seen = new Set();
  return res.filter(r => { const key = JSON.stringify(r.s); if (seen.has(key)) return false; seen.add(key); return true; });
}
function cheapest(allowUsed) {
  let lo = 20000;
  for (let i = 0; i < 12; i++) { const r = suggest(lo, allowUsed); if (r.length) return r.sort((a, b) => a.cost - b.cost)[0]; lo *= 1.4; }
  return null;
}

/* ------------------------------------------------------------------ shop links */
const q = it => encodeURIComponent((it.ex && /^ram-/.test(it.id) ? it.ex + ' ' + it.gb + 'GB' : it.n).replace(/\((used|server|OEM[^)]*|HDD|SATA|U\.[23]|NAS HDD|in chassis[^)]*)\)/gi, '').replace(/\s+/g, ' ').trim());
const SHOPS = {
  IN: [['Amazon.in', s => 'https://www.amazon.in/s?k=' + s], ['Flipkart', s => 'https://www.flipkart.com/search?q=' + s], ['MD Computers', s => 'https://mdcomputers.in/index.php?route=product/search&search=' + s], ['PrimeABGB', s => 'https://www.primeabgb.com/?post_type=product&s=' + s], ['Vedant', s => 'https://www.vedantcomputers.com/index.php?route=product/search&search=' + s]],
  WORLD: [['Amazon.com', s => 'https://www.amazon.com/s?k=' + s], ['Newegg', s => 'https://www.newegg.com/p/pl?d=' + s], ['B&H', s => 'https://www.bhphotovideo.com/c/search?q=' + s], ['eBay', s => 'https://www.ebay.com/sch/i.html?_nkw=' + s]]
};
function shopLinks(it) {
  if (!it || it.none || it.id === 'none' || it.id === 'os-none' || it.id === 'os-linux' || it.oem || it.server) return '';
  const s = q(it);
  const a = ([n, f]) => '<a href="' + esc(f(s)) + '" target="_blank" rel="noopener">' + esc(n) + '</a>';
  return '<div class="shops"><span><b>India</b> ' + SHOPS.IN.map(a).join('') + '</span><span><b>World</b> ' + SHOPS.WORLD.map(a).join('') +
    (it.url ? '<a href="' + esc(it.url) + '" target="_blank" rel="noopener">Maker page</a>' : '') + '</span></div>';
}

/* ------------------------------------------------------------------ one line about a part */
function spec(k, it) {
  const T = [];
  if (it.none) return k === 'gpu' ? 'Uses the processor\'s own graphics, if it has any' : '';
  switch (k) {
    case 'cpu': T.push(it.c + ' cores / ' + (it.t || it.c) + ' threads', 'up to ' + it.g + ' GHz', it.w + ' W', PLAT[it.p] ? PLAT[it.p].label : it.p, String(it.y)); if (it.ig) T.push('has built-in graphics'); if ((it.ms || 1) > 1) T.push('up to ' + it.ms + ' per board'); break;
    case 'board': T.push(PLAT[it.p] ? PLAT[it.p].label : it.p, it.chip, it.ff); if (it.s > 1) T.push(it.s + ' processors'); T.push(it.dimm + ' memory slots, up to ' + (it.max >= 1024 ? it.max / 1024 + ' TB' : it.max + ' GB') + ' ' + memFam(it)); T.push((it.wide || 1) + ' wide card slot' + ((it.wide || 1) > 1 ? 's' : '')); if (it.m2) T.push(it.m2 + ' M.2'); T.push(it.lan); break;
    case 'ram': T.push(it.type, it.mods + (it.mods > 1 ? ' sticks' : ' stick') + ' of ' + it.per + ' GB', it.mts + ' MT/s', 'e.g. ' + it.ex); break;
    case 'gpu': if (it.id !== 'none') { T.push(it.vram + ' GB graphics memory', it.w + ' W'); if (it.cuda) T.push('NVIDIA CUDA for AI'); if (it.pro) T.push('workstation drivers'); if (it.pas) T.push('server airflow only'); } break;
    case 'ssd': T.push(it.tb + ' TB', it.ff, it.bus, 'reads ' + it.r.toLocaleString('en-IN') + ' MB/s', it.nand); if (it.plp) T.push('power-loss protection'); break;
    case 'psu': T.push(it.w + ' W', '80+ ' + it.eff); break;
    case 'cooler': T.push('handles up to ' + it.cap + ' W'); if (it.liquid) T.push('liquid'); break;
    case 'case': T.push('takes ' + it.ff.slice(0, 4).join(', ') + (it.ff.length > 4 ? '…' : ''), 'up to ' + it.gpus + ' graphics card' + (it.gpus > 1 ? 's' : '')); if (it.rack) T.push('rack-mount'); break;
  }
  if (isUsed(it)) T.push('USED');
  return T.filter(Boolean).join(' · ');
}
const priceHTML = (p, qn, it) => (it && it.none) ? '<span class="pv">₹0</span>' : p.v == null
  ? '<span class="pv quote" title="' + esc(PTIP.quote) + '">On quotation</span>'
  : '<span class="pv">' + inr(p.v * (qn || 1)) + '</span><span class="pl ' + p.k + '" title="' + esc(PTIP[p.k]) + '">' + PLABEL[p.k] + '</span>';

/* ------------------------------------------------------------------ state */
const LS = (() => { try { const t = '__t'; localStorage.setItem(t, t); localStorage.removeItem(t); return localStorage; } catch (e) { return null; } })();
const S = { step: 1, budget: 500000, used: false, sel: null, picked: null, history: [], lastCh: [] };

function writeHash() {
  const p = new URLSearchParams();
  p.set('step', S.step); p.set('b', S.budget); if (S.used) p.set('used', '1');
  if (S.sel) for (const k of ['cpu', 'cpuN', 'board', 'ram', 'gpu', 'gpuN', 'ssd', 'ssdN', 'psu', 'cooler', 'case', 'os']) p.set(k, S.sel[k]);
  history.replaceState(null, '', '#' + p.toString());
}
function readHash() {
  const p = new URLSearchParams(location.hash.slice(1));
  if (p.get('b')) S.budget = Math.max(0, +p.get('b') || 0);
  S.used = p.get('used') === '1';
  if (p.get('cpu')) {
    const s = {};
    for (const k of ['cpu', 'board', 'ram', 'gpu', 'ssd', 'psu', 'cooler', 'case', 'os']) s[k] = get(k, p.get(k)).id;
    for (const k of ['cpuN', 'gpuN', 'ssdN']) s[k] = Math.max(1, Math.min(16, +p.get(k) || 1));
    S.sel = settle(s, null).s;
  }
  const st = +p.get('step');
  S.step = st >= 1 && st <= 4 ? (st >= 3 && !S.sel ? 2 : st) : 1;
}

/* ------------------------------------------------------------------ drawing */
function setStep(n) {
  S.step = n;
  for (let i = 1; i <= 4; i++) { $('step' + i).hidden = i !== n; }
  document.querySelectorAll('.steps button').forEach(b => {
    const i = +b.dataset.step;
    b.classList.toggle('on', i === n); b.classList.toggle('done', i < n);
    b.disabled = (i >= 3 && !S.sel);
    if (i === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
  });
  if (n === 2) drawMachines();
  if (n === 3) drawInside();
  if (n === 4) drawBuilt();
  drawBar();
  writeHash();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function drawBudget() {
  $('budgetIn').value = S.budget ? S.budget.toLocaleString('en-IN') : '';
  $('budgetWords').textContent = S.budget ? words(S.budget) : 'type any amount';
  $('topBudget').value = $('budgetIn').value;
  document.querySelectorAll('#quick button').forEach(b => b.classList.toggle('on', +b.dataset.v === S.budget));
  $('usedChk').checked = S.used;
}
function readMoney(v) { const n = +String(v).replace(/[^\d]/g, ''); return isFinite(n) ? n : 0; }

function machineCard(r, i) {
  const t = total(r.s), m = metrics(r.s), c = get('cpu', r.s.cpu), g = get('gpu', r.s.gpu), ram = get('ram', r.s.ram), d = get('ssd', r.s.ssd);
  const pct = S.budget ? Math.round(t.v / S.budget * 100) : 0;
  const bf = bestFor(r.s, r.P.k);
  return '<article class="mcard">' +
    '<div class="mhead"><span class="mnum">' + (i + 1) + '</span><div><h3>' + esc(r.P.t) + '</h3><p class="muted small">' + esc(r.P.sub) + '</p></div></div>' +
    '<div class="best"><b>Best used for</b><ul>' + bf.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div>' +
    '<dl class="mspec">' +
    '<dt>Processor</dt><dd>' + (r.s.cpuN > 1 ? r.s.cpuN + ' × ' : '') + esc(c.n) + ' <span class="muted">(' + m.cores + ' cores)</span></dd>' +
    '<dt>Graphics</dt><dd>' + (g.id === 'none' ? 'Built into the processor' : (r.s.gpuN > 1 ? r.s.gpuN + ' × ' : '') + esc(g.n)) + '</dd>' +
    '<dt>Memory</dt><dd>' + esc(ram.n.split(' (')[0]) + '</dd>' +
    '<dt>Storage</dt><dd>' + esc(d.n) + '</dd></dl>' +
    '<div class="mfoot"><div><div class="mprice">' + inr(t.v) + '</div><div class="tiny muted">' + pct + '% of your budget · our estimate</div></div>' +
    '<button class="btn primary" data-pick="' + i + '">Choose &amp; look inside <span aria-hidden="true">→</span></button></div>' +
    '</article>';
}
let SUG = [];
function drawMachines() {
  $('mTitle').textContent = 'Machines for ' + inr(S.budget) + (S.budget >= 1e5 ? ' (' + words(S.budget) + ')' : '');
  const box = $('mcards');
  box.innerHTML = '<p class="muted">Putting machines together…</p>';
  setTimeout(() => {
    SUG = suggest(S.budget, S.used);
    let note = '';
    if (!SUG.length) {
      const lo = cheapest(S.used);
      if (lo) { SUG = [lo]; note = '<div class="note warn">' + inr(S.budget) + ' is below the lowest complete machine we can build from new parts. The lowest is shown below — or tick "used / refurbished parts" on step 1.</div>'; }
    }
    const top = SUG.length ? Math.max(...SUG.map(r => r.cost)) : 0;
    if (top && top < S.budget * 0.6) note += '<div class="note">The strongest single machine here costs ' + inr(top) + '. Above that, one machine stops getting faster for most work. ' +
      'You can still go inside and add more — more processors, memory, cards — or ask us to quote an 8-GPU server or a cluster.</div>';
    if (S.sel) note += '<div class="note">You already have a machine (' + inr(total(S.sel).v) + '). <button class="linkbtn" data-goto="3">Go back inside it</button> — or choose a new one below.</div>';
    box.innerHTML = note + '<div class="mgrid">' + SUG.map(machineCard).join('') + '</div>';
  }, 20);
}

function drawInside() {
  const s = S.sel, t = total(s), WN = warnings(s);
  const rows = t.L.map(l => {
    const c = CAT[l.k], it = l.it;
    const bd = get('board', s.board);
    const qty = (l.k === 'gpu' && it.id !== 'none') ? stepper('gpuN', s.gpuN, 8)
      : (l.k === 'ssd' && !it.none) ? stepper('ssdN', s.ssdN, bd.none ? 16 : Math.max(1, ssdSlots(it, bd)))
      : (l.k === 'cpu' && (it.ms || 1) > 1) ? stepper('cpuN', s.cpuN, Math.min(8, it.ms || 1))
      : (l.q > 1 ? '<span class="qfix">× ' + l.q + '</span>' : '');
    const hl = S.lastCh.some(x => x.k === l.k || x.k === l.k + 'N') ? ' changed' : '';
    const wn = WN[l.k] ? '<div class="pwarn" role="note">⚠ ' + esc(WN[l.k]) + '</div>' : '';
    return '<div class="prow' + hl + (it.none ? ' left' : '') + (WN[l.k] ? ' warned' : '') + '" id="row-' + l.k + '">' +
      '<div class="pcat"><b>' + esc(c.t) + '</b><span>' + esc(c.why) + '</span></div>' +
      '<div class="pmain"><div class="pname">' + esc(it.n) + '</div><div class="pspec">' + esc(spec(l.k, it)) + '</div>' + (it.note ? '<div class="pnote">' + esc(it.note) + '</div>' : '') + wn + shopLinks(it) + '</div>' +
      '<div class="pqty">' + qty + '</div>' +
      '<div class="pprice">' + priceHTML(l.p, l.q, it) + (l.q > 1 && l.p.v != null ? '<span class="tiny muted">' + inr(l.p.v) + ' each</span>' : '') + '</div>' +
      '<div class="pact"><button class="btn" data-change="' + l.k + '">Change <span aria-hidden="true">▸</span></button></div>' +
      '</div>';
  }).join('');
  let chHTML = '';
  if (S.lastCh.length) {
    chHTML = '<div class="note changes" role="status"><b>We also changed ' + S.lastCh.length + ' thing' + (S.lastCh.length > 1 ? 's' : '') + ' so the machine works:</b><ul>' +
      S.lastCh.map(x => '<li><b>' + esc(label(x.k)) + '</b> → ' + esc(nameOf(x.k, x.to)) + ' <span class="muted">— because ' + esc(x.why) + '</span></li>').join('') +
      '</ul>' + (S.history.length ? '<button class="btn sm" id="undoBtn">↶ Undo my last change</button>' : '') + '</div>';
  } else if (S.history.length) {
    chHTML = '<div class="undoRow"><button class="btn sm" id="undoBtn">↶ Undo my last change</button></div>';
  }
  const bf = bestFor(s), need = powerNeed(s);
  $('inside').innerHTML = chHTML +
    '<div class="insideGrid"><div class="parts">' + rows + '</div>' +
    '<aside class="side">' + (Object.keys(WN).length ? '<div class="panel warnbox"><h3>⚠ Please note</h3><ul>' + Object.values(WN).map(w => '<li>' + esc(w) + '</li>').join('') + '</ul><p class="tiny muted">Your choice — we build it as you say.</p></div>' : '') +
    '<div class="panel"><h3>This machine is best used for</h3><ul class="bf">' + bf.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
    '<p class="tiny muted">Changes as you change parts. Draws about ' + need + ' W at full load.</p></div>' +
    '<div class="panel"><h3>About the prices</h3><ul class="legend">' + ['est', 'seen', 'fx', 'quote'].map(k => '<li><span class="pl ' + k + '">' + PLABEL[k] + '</span> ' + esc(PTIP[k]) + '</li>').join('') + '</ul></div></aside></div>';
  if ($('undoBtn')) $('undoBtn').onclick = undo;
}
const label = k => ({ cpuN: 'Number of processors', gpuN: 'Number of graphics cards', ssdN: 'Number of drives' }[k] || CAT[k].t);
const nameOf = (k, v) => /N$/.test(k) ? String(v) : get(k, v).n;
const stepper = (k, v, max) => max <= 1 && v <= 1 ? '' :
  '<div class="stepper" aria-label="' + esc(label(k)) + '"><button data-q="' + k + '" data-d="-1" ' + (v <= 1 ? 'disabled' : '') + ' aria-label="One less">−</button><span>' + v + '</span><button data-q="' + k + '" data-d="1" ' + (v >= max ? 'disabled' : '') + ' aria-label="One more">+</button></div>';

function apply(newSel, pinned) {
  const r = settle(newSel, pinned);
  S.history.push(S.sel);
  if (S.history.length > 30) S.history.shift();
  S.sel = r.s; S.lastCh = r.ch;
  drawInside(); drawBar(); writeHash();
}
function undo() {
  if (!S.history.length) return;
  S.sel = S.history.pop(); S.lastCh = [];
  drawInside(); drawBar(); writeHash();
  toast('Undone.');
}

function drawBar() {
  const bar = $('bar');
  if (!S.sel || S.step < 3) { bar.hidden = true; document.body.classList.remove('hasbar'); return; }
  bar.hidden = false; document.body.classList.add('hasbar');
  const t = total(S.sel), diff = t.v - S.budget;
  const pct = S.budget ? Math.min(100, t.v / S.budget * 100) : 100;
  $('barTotal').textContent = inr(t.v) + (t.quote ? ' + ' + t.quote + ' on quotation' : '');
  $('barWords').textContent = words(t.v) + (t.fx ? ' · ' + t.fx + ' price' + (t.fx > 1 ? 's' : '') + ' converted from US$' : '');
  $('barBudget').textContent = inr(S.budget);
  $('barDiff').textContent = diff > 0 ? inr(diff) + ' above your budget — fine, we build what you choose' : inr(-diff) + ' left in your budget';
  $('barDiff').className = diff > 0 ? 'over' : 'under';
  $('barFill').style.width = pct + '%';
  $('barFill').classList.toggle('over', diff > 0);
  $('barNext').hidden = S.step !== 3;
}

/* ------------------------------------------------------------------ the part picker */
let PK = null;   // {k, brand, band, mode, sort, text}
function bandsFor(list) {
  const B = [[10000, 'Under ₹10k'], [25000, '₹10k – 25k'], [50000, '₹25k – 50k'], [100000, '₹50k – 1 lakh'], [500000, '₹1 – 5 lakh'], [2500000, '₹5 – 25 lakh'], [Infinity, '₹25 lakh +']];
  const out = [];
  let lo = 0;
  for (const [hi, t] of B) { if (list.some(it => { const v = price(it).v; return v != null && v >= lo && v < hi; })) out.push({ lo, hi, t }); lo = hi; }
  if (list.some(it => price(it).v == null)) out.push({ lo: null, hi: null, t: 'On quotation' });
  return out;
}
function openPicker(k) {
  PK = { k, brand: '', band: -1, mode: 'all', sort: 'asc', text: '' };
  const c = CAT[k];
  $('pkTitle').textContent = 'Choose your ' + c.t.toLowerCase();
  const prices = c.list.map(it => price(it).v).filter(v => v != null);
  const nq = c.list.length - prices.length;
  $('pkRange').innerHTML = '<b>' + c.list.length + '</b> options · from <b>' + inr(Math.min(...prices)) + '</b> to <b>' + inr(Math.max(...prices)) + '</b>' + (nq ? ' · ' + nq + ' on quotation' : '') +
    (k === 'gpu' ? '<br><span class="tiny">8-GPU B200 and MI300X servers are sold only as complete systems — ask us for a quotation.</span>' : '');
  const brands = [...new Set(c.list.map(it => it.b).filter(b => b && b !== '—'))].sort();
  $('pkBrands').innerHTML = brands.length > 1 ? ['<button class="chip on" data-brand="">All makers</button>'].concat(brands.map(b => '<button class="chip" data-brand="' + esc(b) + '">' + esc(b) + '</button>')).join('') : '';
  $('pkBands').innerHTML = '<button class="chip on" data-band="-1">Every price</button>' + bandsFor(c.list).map((b, i) => '<button class="chip" data-band="' + i + '">' + esc(b.t) + '</button>').join('');
  PK.bands = bandsFor(c.list);
  $('pkText').value = '';
  $('pkMode').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.mode === 'all'));
  $('pkSort').value = 'asc';
  drawPicker();
  $('picker').hidden = false;
  document.body.classList.add('noscroll');
  setTimeout(() => $('pkText').focus(), 30);
}
function closePicker() {
  $('picker').hidden = true; document.body.classList.remove('noscroll');
  if (PK) { const b = document.querySelector('[data-change="' + PK.k + '"]'); if (b) b.focus(); }
  PK = null;
}
function drawPicker() {
  const k = PK.k, c = CAT[k], cur = S.sel[k];
  const now = total(S.sel).v;
  let list = c.list.slice();
  if (PK.brand) list = list.filter(it => it.b === PK.brand);
  if (PK.band >= 0) { const b = PK.bands[PK.band]; list = list.filter(it => { const v = price(it).v; return b.lo == null ? v == null : v != null && v >= b.lo && v < b.hi; }); }
  if (PK.text) { const t = PK.text.toLowerCase(); list = list.filter(it => (it.n + ' ' + (it.b || '') + ' ' + (it.ex || '') + ' ' + spec(k, it)).toLowerCase().includes(t)); }
  if (!S.used) list = list.filter(it => !isUsed(it) || it.id === cur);
  const rows = list.map(it => {
    const r = settle(Object.assign({}, S.sel, { [k]: it.id }), k);
    const t = total(r.s);
    return { it, r, t, d: t.v - now, fits: r.ch.length === 0, swapped: r.s[k] !== it.id };
  }).filter(x => PK.mode === 'all' || x.fits || x.it.id === cur);
  rows.sort((a, b) => {
    const av = price(a.it).v, bv = price(b.it).v;
    if (av == null && bv == null) return 0; if (av == null) return 1; if (bv == null) return -1;
    return PK.sort === 'asc' ? av - bv : bv - av;
  });
  $('pkCount').textContent = rows.length + ' shown';
  $('pkList').innerHTML = rows.length ? rows.map(x => {
    const it = x.it, isCur = it.id === cur;
    const p = price(it);
    const comp = isCur ? '<span class="fit cur">In your machine now</span>'
      : (it.none && warnings(x.r.s)[k]) ? '<span class="fit chg">⚠ ' + esc(warnings(x.r.s)[k]) + '</span>'
      : x.swapped ? '<span class="fit chg">Does not fit the rest of this machine — we would fit ' + esc(get(k, x.r.s[k]).n) + ' instead</span>'
      : x.fits ? '<span class="fit ok">Fits as it is</span>'
      : '<span class="fit chg">We will also change: ' + esc([...new Set(x.r.ch.map(c => label(c.k)))].join(', ')) + '</span>';
    const delta = isCur ? '' : '<span class="delta ' + (x.d > 0 ? 'up' : 'down') + '">Machine ' + (x.d >= 0 ? '+' : '−') + inr(Math.abs(x.d)) + ' → ' + inr(x.t.v) + '</span>';
    return '<div class="opt' + (isCur ? ' cur' : '') + '">' +
      '<div class="omain"><div class="oname">' + esc(it.n) + '</div><div class="ospec">' + esc(spec(k, it)) + '</div>' + (it.note ? '<div class="pnote">' + esc(it.note) + '</div>' : '') + '<div class="ometa">' + comp + delta + '</div>' + shopLinks(it) + '</div>' +
      '<div class="oside"><div class="oprice">' + priceHTML(p, 1, it) + '</div>' + (isCur ? '<button class="btn" disabled>Chosen</button>' : '<button class="btn primary" data-choose="' + esc(it.id) + '">Choose</button>') + '</div>' +
      '</div>';
  }).join('') : '<p class="muted" style="padding:16px">Nothing matches. Clear the search or pick "Every price".</p>';
}

/* ------------------------------------------------------------------ step 4 */
function listText() {
  const t = total(S.sel);
  const L = t.L.filter(l => !l.it.none);
  return 'AVNI Computers - my machine (' + new Date().toLocaleDateString('en-GB').replace(/\//g, '-') + ')\n' +
    L.map(l => '- ' + CAT[l.k].t + ': ' + (l.q > 1 ? l.q + ' x ' : '') + l.it.n + ' - ' + (l.p.v == null ? 'on quotation' : inr(l.p.v * l.q) + ' (' + PLABEL[l.p.k].toLowerCase() + ')')).join('\n') +
    (t.L.some(l => l.it.none) ? '\nLeft out at my choice: ' + t.L.filter(l => l.it.none).map(l => CAT[l.k].t).join(', ') : '') + '\nTotal: ' + inr(t.v) + (t.quote ? ' + ' + t.quote + ' part(s) on quotation' : '') + '\nMy budget: ' + inr(S.budget) +
    (Object.keys(warnings(S.sel)).length ? '\nPlease note: ' + Object.values(warnings(S.sel)).join(' ') : '') +
    '\nBest used for: ' + bestFor(S.sel).join('; ') + '\nLink: ' + location.href;
}
function drawBuilt() {
  const t = total(S.sel);
  const L = t.L.filter(l => !l.it.none);
  const left = t.L.filter(l => l.it.none).map(l => CAT[l.k].t);
  $('built').innerHTML =
    '<div class="panel sheet"><div class="sheetHead"><div><span class="eyebrow">Your machine</span><h2>' + inr(t.v) + (t.quote ? ' <small>+ ' + t.quote + ' on quotation</small>' : '') + '</h2><p class="muted">' + esc(words(t.v)) + ' · your budget was ' + inr(S.budget) + '</p></div></div>' +
    '<table class="sheetT"><thead><tr><th>Part</th><th>What we will fit</th><th class="r">Qty</th><th class="r">Price</th></tr></thead><tbody>' +
    L.map(l => '<tr><td>' + esc(CAT[l.k].t) + '</td><td>' + esc(l.it.n) + '</td><td class="r">' + l.q + '</td><td class="r">' + (l.p.v == null ? 'On quotation' : inr(l.p.v * l.q)) + '<br><span class="pl ' + l.p.k + '">' + PLABEL[l.p.k] + '</span></td></tr>').join('') +
    (left.length ? '<tr class="left"><td colspan="4">Left out at your choice: ' + esc(left.join(', ')) + '</td></tr>' : '') + '</tbody><tfoot><tr><td colspan="3">Total</td><td class="r">' + inr(t.v) + '</td></tr></tfoot></table>' +
    (Object.keys(warnings(S.sel)).length ? '<div class="note warn" style="margin-top:14px"><b>⚠ Please note</b><ul>' + Object.values(warnings(S.sel)).map(w => '<li>' + esc(w) + '</li>').join('') + '</ul></div>' : '') +
    '<h3 style="margin-top:18px">Best used for</h3><ul class="bf">' + bestFor(S.sel).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div>' +
    '<div class="panel how"><h3>What happens next</h3><ol><li><b>Send us this list.</b> Copy it or share it with the buttons below.</li><li><b>We check every price</b> with Indian sellers and makers, and give you one firm quotation with GST.</li><li><b>We build and test</b> the machine — every part, at full load — before it reaches you.</li></ol>' +
    '<div class="btnrow"><button class="btn primary" id="shareBtn">Share this list</button><button class="btn" id="copyBtn">Copy the list</button><button class="btn" id="printBtn">Print or save as PDF</button><button class="btn" data-goto="3">← Change a part</button></div>' +
    '<p class="tiny muted">Nothing is sent from this page. Prices are working numbers until we quote.</p></div>';
  $('copyBtn').onclick = () => copy(listText());
  $('printBtn').onclick = () => window.print();
  $('shareBtn').onclick = () => {
    const text = listText();
    if (navigator.share) navigator.share({ title: 'My AVNI machine', text }).catch(() => {});
    else copy(text);
  };
}
function copy(text) {
  const done = () => toast('Copied. Paste it in WhatsApp or e-mail to us.');
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, () => fallback());
  else fallback();
  function fallback() { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('Could not copy here. Select the list and copy it.'); } ta.remove(); }
}
let toastT = 0;
function toast(t) { const el = $('toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600); }

/* ------------------------------------------------------------------ wiring */
function setBudget(v, from) {
  S.budget = Math.max(0, Math.min(1e11, v || 0));
  if (from !== 'in') $('budgetIn').value = S.budget ? S.budget.toLocaleString('en-IN') : '';
  if (from !== 'top') $('topBudget').value = S.budget ? S.budget.toLocaleString('en-IN') : '';
  $('budgetWords').textContent = S.budget ? words(S.budget) : 'type any amount';
  document.querySelectorAll('#quick button').forEach(b => b.classList.toggle('on', +b.dataset.v === S.budget));
  drawBar(); writeHash();
}
function init() {
  readHash();
  try { const th = LS && LS.getItem('avni-theme'); if (th) document.documentElement.dataset.theme = th; } catch (e) {}
  drawBudget();

  $('budgetIn').addEventListener('input', e => setBudget(readMoney(e.target.value), 'in'));
  $('budgetIn').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('goMachines').click(); } });
  $('topBudget').addEventListener('change', e => { setBudget(readMoney(e.target.value), 'top'); if (S.step === 2) drawMachines(); });
  $('quick').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setBudget(+b.dataset.v); });
  $('usedChk').addEventListener('change', e => { S.used = e.target.checked; writeHash(); });
  $('goMachines').addEventListener('click', () => { if (!S.budget) { toast('Type your budget first.'); $('budgetIn').focus(); return; } setStep(2); });
  document.querySelector('.steps').addEventListener('click', e => { const b = e.target.closest('button[data-step]'); if (b && !b.disabled) setStep(+b.dataset.step); });
  $('themeBtn').addEventListener('click', () => {
    const d = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = d; try { LS && LS.setItem('avni-theme', d); } catch (e) {}
  });

  document.addEventListener('click', e => {
    const g = e.target.closest('[data-goto]'); if (g) { setStep(+g.dataset.goto); return; }
    const pick = e.target.closest('[data-pick]');
    if (pick) { const r = SUG[+pick.dataset.pick]; if (S.sel) S.history.push(S.sel); S.sel = settle(r.s, null).s; S.lastCh = []; setStep(3); return; }
    const ch = e.target.closest('[data-change]'); if (ch) { openPicker(ch.dataset.change); return; }
    const qb = e.target.closest('[data-q]');
    if (qb) { const k = qb.dataset.q; const v = Math.max(1, S.sel[k] + (+qb.dataset.d)); apply(Object.assign({}, S.sel, { [k]: v }), k); return; }
  });
  $('barNext').addEventListener('click', () => setStep(4));

  // picker
  $('pkClose').addEventListener('click', closePicker);
  $('picker').addEventListener('click', e => { if (e.target === $('picker')) closePicker(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && PK) closePicker(); });
  $('pkText').addEventListener('input', e => { PK.text = e.target.value.trim(); drawPicker(); });
  $('pkSort').addEventListener('change', e => { PK.sort = e.target.value; drawPicker(); });
  $('pkMode').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; PK.mode = b.dataset.mode; $('pkMode').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); drawPicker(); });
  $('pkBrands').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; PK.brand = b.dataset.brand; $('pkBrands').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); drawPicker(); });
  $('pkBands').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; PK.band = +b.dataset.band; $('pkBands').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); drawPicker(); });
  $('pkList').addEventListener('click', e => {
    const b = e.target.closest('[data-choose]'); if (!b) return;
    const k = PK.k, id = b.dataset.choose;
    closePicker();
    apply(Object.assign({}, S.sel, { [k]: id }), k);
    const row = $('row-' + k); if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast(CAT[k].t + ' changed.');
  });

  setStep(S.step);
}
// test hook for the site check script (no DOM needed)
window.AVNI_BUILD = { suggest, settle, total, bestFor, price, CAT };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
