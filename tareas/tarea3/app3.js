// app3.js — Tarea 3: Simuladores con EJES FIJOS
// El rango de X e Y nunca cambia. Solo los datos se desplazan.

/* ─── HELPERS MATEMÁTICOS ─── */
function factorial(n) {
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
function comb(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let r = 1;
  for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1);
  return r;
}

/* ─── CONSTANTES DE EJES FIJOS ─── */
// Normal: eje X fijo −25 a +25, eje Y fijo 0 a 0.85
const NORMAL_XMIN = -25, NORMAL_XMAX = 25, NORMAL_YMAX = 0.85, NORMAL_PTS = 200;

// Binomial: eje X fijo 0..40, eje Y fijo 0..0.5
const BINOM_XMAX = 40, BINOM_YMAX = 0.5;

// Geométrica: eje X fijo k=1..30, eje Y fijo 0..1
const GEO_KMAX = 30, GEO_YMAX = 1.0;

// Binomial Negativa: eje X fijo 0..60, eje Y fijo 0..0.4
const BN_KMAX = 60, BN_YMAX = 0.4;

// Poisson: eje X fijo k=0..40, eje Y fijo 0..0.4
const POIS_KMAX = 40, POIS_YMAX = 0.4;

// Exponencial: eje X fijo 0..10, eje Y fijo 0..5.5
const EXP_XMAX = 10, EXP_YMAX = 5.5, EXP_PTS = 200;

/* ─── CHART FACTORY ─── */
const ACCENT = '#e85d8a';
const charts = {};

// Crea o actualiza con datos y opciones de ejes fijos
function makeChart(id, type, labels, data, xFixed, yFixed, extraDataset = {}) {
  const ctx = document.getElementById(id).getContext('2d');
  if (charts[id]) {
    // Actualizar solo los datos — ejes no se tocan
    charts[id].data.labels = labels;
    charts[id].data.datasets[0].data = data;
    charts[id].update('none'); // sin animación para que se vea fluido
    return;
  }
  // Crear por primera vez
  charts[id] = new Chart(ctx, {
    type,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ACCENT + '50',
        borderColor: ACCENT,
        borderWidth: type === 'line' ? 2.5 : 1.5,
        borderRadius: type === 'bar' ? 3 : 0,
        pointRadius: 0,
        tension: 0.4,
        fill: type === 'line',
        ...extraDataset
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,        // sin animación = ejes no saltan
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#13161e',
          borderColor: ACCENT,
          borderWidth: 1,
          titleColor: '#eeeef0',
          bodyColor: '#7a7f94',
          callbacks: { label: ctx => ` ${ctx.parsed.y.toFixed(4)}` }
        }
      },
      scales: {
        x: {
          type: 'category',
          min: xFixed?.min,
          max: xFixed?.max,
          ticks: {
            color: '#4a4f64',
            font: { size: 11, family: 'DM Mono' },
            maxTicksLimit: 20,
            maxRotation: 0,
          },
          grid: { color: 'rgba(255,255,255,0.05)' },
        },
        y: {
          min: 0,
          max: yFixed,
          ticks: {
            color: '#4a4f64',
            font: { size: 11, family: 'DM Mono' },
            maxTicksLimit: 8,
          },
          grid: { color: 'rgba(255,255,255,0.05)' },
        }
      }
    }
  });
}

function setStats(id, pills) {
  document.getElementById(id).innerHTML =
    pills.map(([k, v]) => `<span class="stat-pill">${k} = ${v}</span>`).join('');
}

/* ════════════════════════════════════════
   1. NORMAL — eje X fijo −25 a +25
════════════════════════════════════════ */
function normalPDF(x, mu, sigma) {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
}

// Labels fijas para Normal: −25 a +25
const NORMAL_LABELS = Array.from({ length: NORMAL_PTS }, (_, i) =>
  (NORMAL_XMIN + (NORMAL_XMAX - NORMAL_XMIN) * i / (NORMAL_PTS - 1)).toFixed(2)
);

function drawNormal() {
  const mu    = parseFloat(document.getElementById('normal-mu').value);
  const sigma = parseFloat(document.getElementById('normal-sigma').value);
  document.getElementById('normal-mu-val').textContent    = mu;
  document.getElementById('normal-sigma-val').textContent = sigma.toFixed(1);

  const ys = NORMAL_LABELS.map(x => normalPDF(parseFloat(x), mu, sigma));

  makeChart('chartNormal', 'line', NORMAL_LABELS, ys,
    null, NORMAL_YMAX,
    { fill: true, backgroundColor: ACCENT + '25' }
  );
  setStats('normal-stats', [
    ['μ', mu], ['σ', sigma.toFixed(1)],
    ['Moda', mu], ['Var', (sigma ** 2).toFixed(2)]
  ]);
}

document.getElementById('normal-mu').addEventListener('input', drawNormal);
document.getElementById('normal-sigma').addEventListener('input', drawNormal);

/* ════════════════════════════════════════
   2. BINOMIAL — eje X fijo 0..40
════════════════════════════════════════ */
// Labels fijas 0..40
const BINOM_LABELS = Array.from({ length: BINOM_XMAX + 1 }, (_, k) => String(k));

function drawBinomial() {
  const n = parseInt(document.getElementById('binom-n').value);
  const p = parseFloat(document.getElementById('binom-p').value);
  document.getElementById('binom-n-val').textContent = n;
  document.getElementById('binom-p-val').textContent = p.toFixed(2);

  // Llenar 0..BINOM_XMAX; fuera del rango de n → 0
  const data = BINOM_LABELS.map(k => {
    const ki = parseInt(k);
    return ki <= n ? comb(n, ki) * Math.pow(p, ki) * Math.pow(1 - p, n - ki) : 0;
  });

  makeChart('chartBinomial', 'bar', BINOM_LABELS, data, null, BINOM_YMAX);
  setStats('binom-stats', [
    ['E(X)', (n * p).toFixed(2)],
    ['Var', (n * p * (1 - p)).toFixed(3)],
    ['n', n], ['p', p.toFixed(2)]
  ]);
}

document.getElementById('binom-n').addEventListener('input', drawBinomial);
document.getElementById('binom-p').addEventListener('input', drawBinomial);

/* ════════════════════════════════════════
   3. GEOMÉTRICA — eje X fijo k=1..30
════════════════════════════════════════ */
const GEO_LABELS = Array.from({ length: GEO_KMAX }, (_, i) => String(i + 1));

function drawGeometrica() {
  const p = parseFloat(document.getElementById('geo-p').value);
  document.getElementById('geo-p-val').textContent = p.toFixed(2);

  const data = GEO_LABELS.map(k => Math.pow(1 - p, parseInt(k) - 1) * p);

  makeChart('chartGeometrica', 'bar', GEO_LABELS, data, null, GEO_YMAX);
  setStats('geo-stats', [
    ['E(X)', (1 / p).toFixed(2)],
    ['Var', ((1 - p) / p ** 2).toFixed(3)],
    ['p', p.toFixed(2)]
  ]);
}

document.getElementById('geo-p').addEventListener('input', drawGeometrica);

/* ════════════════════════════════════════
   4. BINOMIAL NEGATIVA — eje X fijo 0..60
════════════════════════════════════════ */
const BN_LABELS = Array.from({ length: BN_KMAX + 1 }, (_, k) => String(k));

function drawBinomNeg() {
  const r = parseInt(document.getElementById('bn-r').value);
  const p = parseFloat(document.getElementById('bn-p').value);
  document.getElementById('bn-r-val').textContent = r;
  document.getElementById('bn-p-val').textContent = p.toFixed(2);

  const data = BN_LABELS.map(k => {
    const ki = parseInt(k);
    if (ki < r) return 0;
    const val = comb(ki - 1, r - 1) * Math.pow(p, r) * Math.pow(1 - p, ki - r);
    return isFinite(val) ? val : 0;
  });

  makeChart('chartBinomNeg', 'bar', BN_LABELS, data, null, BN_YMAX);
  setStats('bn-stats', [
    ['E(X)', (r / p).toFixed(2)],
    ['Var', (r * (1 - p) / p ** 2).toFixed(3)],
    ['r', r], ['p', p.toFixed(2)]
  ]);
}

document.getElementById('bn-r').addEventListener('input', drawBinomNeg);
document.getElementById('bn-p').addEventListener('input', drawBinomNeg);

/* ════════════════════════════════════════
   5. POISSON — eje X fijo k=0..40
════════════════════════════════════════ */
const POIS_LABELS = Array.from({ length: POIS_KMAX + 1 }, (_, k) => String(k));

function drawPoisson() {
  const lambda = parseFloat(document.getElementById('pois-l').value);
  document.getElementById('pois-l-val').textContent = lambda.toFixed(1);

  const data = POIS_LABELS.map(k => {
    const ki = parseInt(k);
    const val = Math.exp(-lambda) * Math.pow(lambda, ki) / factorial(ki);
    return isFinite(val) ? val : 0;
  });

  makeChart('chartPoisson', 'bar', POIS_LABELS, data, null, POIS_YMAX);
  setStats('pois-stats', [
    ['E(X)', lambda.toFixed(1)],
    ['Var', lambda.toFixed(1)],
    ['λ', lambda.toFixed(1)]
  ]);
}

document.getElementById('pois-l').addEventListener('input', drawPoisson);

/* ════════════════════════════════════════
   6. EXPONENCIAL — eje X fijo 0..10
════════════════════════════════════════ */
const EXP_LABELS = Array.from({ length: EXP_PTS }, (_, i) =>
  (EXP_XMAX * i / (EXP_PTS - 1)).toFixed(3)
);

function drawExponencial() {
  const lambda = parseFloat(document.getElementById('exp-l').value);
  document.getElementById('exp-l-val').textContent = lambda.toFixed(1);

  const data = EXP_LABELS.map(x => lambda * Math.exp(-lambda * parseFloat(x)));

  makeChart('chartExponencial', 'line', EXP_LABELS, data,
    null, EXP_YMAX,
    { fill: true, backgroundColor: ACCENT + '25' }
  );
  setStats('exp-stats', [
    ['E(X)', (1 / lambda).toFixed(3)],
    ['Var', (1 / lambda ** 2).toFixed(4)],
    ['λ', lambda.toFixed(1)]
  ]);
}

document.getElementById('exp-l').addEventListener('input', drawExponencial);

/* ─── INICIALIZAR ─── */
document.addEventListener('DOMContentLoaded', () => {
  drawNormal();
  drawBinomial();
  drawGeometrica();
  drawBinomNeg();
  drawPoisson();
  drawExponencial();
});
