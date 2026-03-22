// app3.js — Tarea 3: Gráficas de Distribuciones de Probabilidad

const ACCENT = '#e85d8a';
const COLORS = ['#e85d8a','#5b8dee','#e8c547','#4ecb71','#a076e8'];

const chartDefaults = {
  responsive: true,
  plugins: {
    legend: { labels: { color: '#7a7f94', font: { family: 'DM Sans' } } },
    tooltip: { backgroundColor: '#13161e', borderColor: '#e85d8a', borderWidth: 1,
      titleColor: '#eeeef0', bodyColor: '#7a7f94' }
  },
  scales: {
    x: { ticks: { color: '#7a7f94' }, grid: { color: 'rgba(255,255,255,0.04)' } },
    y: { ticks: { color: '#7a7f94' }, grid: { color: 'rgba(255,255,255,0.04)' }, beginAtZero: true }
  }
};

function barChart(id, labels, data, color, label) {
  const ctx = document.getElementById(id).getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: color + '88',
        borderColor: color,
        borderWidth: 2,
        borderRadius: 4,
      }]
    },
    options: { ...chartDefaults }
  });
}

function lineChart(id, labels, data, color, label) {
  const ctx = document.getElementById(id).getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label,
        data,
        borderColor: color,
        backgroundColor: color + '22',
        pointBackgroundColor: color,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
      }]
    },
    options: { ...chartDefaults }
  });
}

/* ============ GEOMÉTRICA ============ */
{
  const p = 0.5;
  const ks = [1,2,3,4,5,6,7,8];
  const probs = ks.map(k => Math.pow(1-p, k-1) * p);
  barChart('chartGeometrica', ks.map(String), probs, COLORS[0], 'P(X=k), p=0.5');
}

/* ============ EXPONENCIAL ============ */
{
  const lambda = 0.5;
  const xs = Array.from({length: 30}, (_, i) => i * 0.3);
  const ys = xs.map(x => lambda * Math.exp(-lambda * x));
  const labels = xs.map(x => x.toFixed(1));
  lineChart('chartExponencial', labels, ys, COLORS[1], 'f(x) = 0.5·e^(−0.5x)');
}

/* ============ POISSON ============ */
{
  const lambda = 3;
  const ks = [0,1,2,3,4,5,6,7,8];
  function factorial(n) { return n <= 1 ? 1 : n * factorial(n-1); }
  const probs = ks.map(k => (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k));
  barChart('chartPoisson', ks.map(String), probs, COLORS[2], 'P(X=k), λ=3');
}

/* ============ BINOMIAL ============ */
{
  const n = 5, p = 0.5;
  function comb(n, k) {
    if (k === 0 || k === n) return 1;
    let result = 1;
    for (let i = 0; i < k; i++) result = result * (n - i) / (i + 1);
    return result;
  }
  const ks = Array.from({length: n+1}, (_, i) => i);
  const probs = ks.map(k => comb(n, k) * Math.pow(p, k) * Math.pow(1-p, n-k));
  barChart('chartBinomial', ks.map(String), probs, COLORS[3], 'P(X=k), n=5, p=0.5');
}

/* ============ BINOMIAL NEGATIVA ============ */
{
  const r = 3, p = 0.5;
  function comb(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    let result = 1;
    for (let i = 0; i < k; i++) result = result * (n - i) / (i + 1);
    return result;
  }
  const ks = [3,4,5,6,7,8,9,10];
  const probs = ks.map(k => comb(k-1, r-1) * Math.pow(p, r) * Math.pow(1-p, k-r));
  barChart('chartBinomNeg', ks.map(String), probs, COLORS[4], 'P(X=k), r=3, p=0.5');
}
