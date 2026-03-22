// app1.js — Tarea 1: Histograma y Estadísticas
// Genera datos aleatorios, los ordena, calcula estadísticas y genera gráficas

/* ============================================
   ESTADO GLOBAL
   ============================================ */
let datosA = [];
let datosB = [];
let histChart = null;
let boxChart = null;
let materiaActual = 'A';

/* ============================================
   UTILIDADES ESTADÍSTICAS
   ============================================ */

/** Genera n números aleatorios enteros entre min y max */
function generarAleatorios(n, min, max) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

/** Media aritmética */
function media(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/** Mediana */
function mediana(sorted) {
  const n = sorted.length;
  const mid = Math.floor(n / 2);
  return n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Moda */
function moda(arr) {
  const freq = {};
  arr.forEach(v => freq[v] = (freq[v] || 0) + 1);
  const maxFreq = Math.max(...Object.values(freq));
  if (maxFreq === 1) return 'No hay (todos diferentes)';
  const modas = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
  return modas.join(', ');
}

/** Cuartil k para datos ordenados */
function cuartil(sorted, k) {
  const n = sorted.length;
  const pos = k * (n + 1) / 4;
  const floor = Math.floor(pos);
  const frac = pos - floor;
  if (floor <= 0) return sorted[0];
  if (floor >= n) return sorted[n - 1];
  return sorted[floor - 1] + frac * (sorted[floor] - sorted[floor - 1]);
}

/* ============================================
   GENERAR DATOS
   ============================================ */
document.getElementById('btnGenerar').addEventListener('click', () => {
  datosA = generarAleatorios(25, 50, 100);
  datosB = generarAleatorios(25, 50, 100);

  // Mostrar tabla
  const tbody = document.getElementById('tbodyRaw');
  tbody.innerHTML = '';
  for (let i = 0; i < 25; i++) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i + 1}</td><td>${datosA[i]}</td><td>${datosB[i]}</td>`;
    tbody.appendChild(tr);
  }

  document.getElementById('tablaRaw').style.display = '';
  document.getElementById('seccionOrdenar').style.display = '';
});

/* ============================================
   ORDENAR DATOS
   ============================================ */
document.getElementById('btnOrdenar').addEventListener('click', () => {
  materiaActual = document.getElementById('selectMateria').value;
  const datos = materiaActual === 'A' ? [...datosA] : [...datosB];
  const sorted = datos.sort((a, b) => a - b);

  // Tabla ordenada
  const tbody = document.getElementById('tbodyOrdenada');
  tbody.innerHTML = '';
  sorted.forEach((v, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i + 1}</td><td>${v}</td>`;
    tbody.appendChild(tr);
  });

  document.getElementById('tablaOrdenada').style.display = '';
  document.getElementById('datosOrdenadosTexto').style.display = '';
  document.getElementById('datosOrdenadosTexto').textContent = sorted.join(', ');

  // Calcular estadísticas
  calcularEstadisticas(sorted);

  // Mostrar secciones
  document.getElementById('seccionCalcs').style.display = '';
  document.getElementById('seccionHistograma').style.display = '';
  document.getElementById('seccionBoxplot').style.display = '';

  // Generar gráficas
  generarHistograma(sorted);
  requestAnimationFrame(() => requestAnimationFrame(() => generarBoxplot(sorted)));
});

/* ============================================
   CÁLCULOS ESTADÍSTICOS
   ============================================ */
function calcularEstadisticas(sorted) {
  const n = sorted.length;
  const med = media(sorted).toFixed(2);
  const med2 = mediana(sorted);
  const mod = moda(sorted);
  const Q1 = cuartil(sorted, 1).toFixed(2);
  const Q2 = cuartil(sorted, 2).toFixed(2);
  const Q3 = cuartil(sorted, 3).toFixed(2);
  const RIC = (parseFloat(Q3) - parseFloat(Q1)).toFixed(2);
  const limInf = (parseFloat(Q1) - 1.5 * parseFloat(RIC)).toFixed(2);
  const limSup = (parseFloat(Q3) + 1.5 * parseFloat(RIC)).toFixed(2);
  const suma = sorted.reduce((a, b) => a + b, 0);

  const rows = [
    ['Media', `x̄ = Σxᵢ / n`, `${suma} / ${n} = ${med}`],
    ['Mediana', `Q₂ = posición (n+1)/2`, `Posición ${Math.ceil((n+1)/2)} → ${med2}`],
    ['Moda', 'Valor con mayor frecuencia', mod],
    ['Cuartil Q₁', `Q₁ = 1·(n+1)/4`, Q1],
    ['Cuartil Q₂', `Q₂ = 2·(n+1)/4`, Q2],
    ['Cuartil Q₃', `Q₃ = 3·(n+1)/4`, Q3],
    ['RIC', 'RIC = Q₃ − Q₁', `${Q3} − ${Q1} = ${RIC}`],
    ['Límite inferior', 'Q₁ − 1.5·RIC', `${Q1} − ${(1.5*parseFloat(RIC)).toFixed(2)} = ${limInf}`],
    ['Límite superior', 'Q₃ + 1.5·RIC', `${Q3} + ${(1.5*parseFloat(RIC)).toFixed(2)} = ${limSup}`],
  ];

  const tbody = document.getElementById('tbodyCalcs');
  tbody.innerHTML = '';
  rows.forEach(([car, form, calc]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${car}</td><td style="font-family:var(--font-mono);font-size:.82rem;color:var(--accent)">${form}</td><td>${calc}</td>`;
    tbody.appendChild(tr);
  });

  // Interpretación
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const noAtipicos = min >= parseFloat(limInf) && max <= parseFloat(limSup);
  document.getElementById('interpretacion').innerHTML = `
    <h4 style="margin-bottom:12px;color:var(--text)">💡 Interpretación</h4>
    <ul style="color:var(--text-muted);font-size:.88rem;line-height:2;padding-left:20px">
      <li><b style="color:var(--text)">Mínimo:</b> ${min}</li>
      <li><b style="color:var(--text)">Máximo:</b> ${max}</li>
      <li><b style="color:var(--text)">Rango sin atípicos:</b> ${limInf} – ${limSup}</li>
      <li><b style="color:${noAtipicos ? 'var(--accent-green, #4ecb71)' : '#e85d8a'}">
        ${noAtipicos ? '✓ No hay valores atípicos.' : '⚠ Existen valores atípicos.'}
      </b></li>
    </ul>
  `;

  // Actualizar leyenda del boxplot
  document.getElementById('boxplotLegend').innerHTML = [
    { label: 'Mínimo', value: min, desc: 'Valor más pequeño' },
    { label: 'Q₁', value: Q1, desc: 'Primer cuartil (25%)' },
    { label: 'Mediana', value: Q2, desc: 'Segundo cuartil (50%)' },
    { label: 'Q₃', value: Q3, desc: 'Tercer cuartil (75%)' },
    { label: 'Máximo', value: max, desc: 'Valor más grande' },
    { label: 'RIC', value: RIC, desc: 'Rango intercuartílico' },
  ].map(item => `
    <div class="legend-item">
      <div class="leg-label">${item.label}</div>
      <div class="leg-value">${item.value}</div>
      <div class="leg-desc">${item.desc}</div>
    </div>
  `).join('');
}

/* ============================================
   HISTOGRAMA
   ============================================ */
function generarHistograma(sorted) {
  // Intervalos: [0,10), [10,20), ..., [90,100]
  const labels = ['0–10','10–20','20–30','30–40','40–50','50–60','60–70','70–80','80–90','90–100'];
  const frecuencias = new Array(10).fill(0);
  sorted.forEach(v => {
    const idx = v === 100 ? 9 : Math.floor(v / 10);
    frecuencias[idx]++;
  });

  if (histChart) histChart.destroy();

  const ctx = document.getElementById('histogramaChart').getContext('2d');
  histChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: `Materia ${materiaActual}`,
        data: frecuencias,
        backgroundColor: 'rgba(232,197,71,0.5)',
        borderColor: 'rgba(232,197,71,0.9)',
        borderWidth: 2,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#7a7f94', font: { family: 'DM Sans' } } },
        tooltip: { backgroundColor: '#13161e', borderColor: '#e8c547', borderWidth: 1 }
      },
      scales: {
        x: {
          title: { display: true, text: 'Calificación', color: '#7a7f94' },
          ticks: { color: '#7a7f94' },
          grid: { color: 'rgba(255,255,255,0.04)' }
        },
        y: {
          title: { display: true, text: 'Frecuencia', color: '#7a7f94' },
          ticks: { color: '#7a7f94', stepSize: 1 },
          grid: { color: 'rgba(255,255,255,0.04)' },
          beginAtZero: true
        }
      }
    }
  });
}

/* ============================================
   BOXPLOT (dibujado a mano con Canvas)
   ============================================ */
function generarBoxplot(sorted) {
  if (boxChart) boxChart.destroy();

  const n = sorted.length;
  const minVal = sorted[0];
  const maxVal = sorted[n - 1];
  const Q1 = parseFloat(cuartil(sorted, 1).toFixed(2));
  const Q2 = parseFloat(cuartil(sorted, 2).toFixed(2));
  const Q3 = parseFloat(cuartil(sorted, 3).toFixed(2));

  const canvas = document.getElementById('boxplotChart');
  const ctx = canvas.getContext('2d');

  // Dimensiones
  const W = canvas.offsetWidth || 800;
  canvas.width = W;
  canvas.height = 400;
  ctx.clearRect(0, 0, W, canvas.height);

  const pad = 120;
  const plotW = W - pad * 2;
  const midY = canvas.height / 2;
  const boxH = 100;

  // Escala: mapear valor a posición X
  const scale = val => pad + ((val - 0) / 100) * plotW;

  // Eje
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, midY + boxH / 2 + 16);
  ctx.lineTo(W - pad, midY + boxH / 2 + 16);
  ctx.stroke();

  // Marcas del eje
  for (let i = 0; i <= 10; i++) {
    const x = scale(i * 10);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.moveTo(x, midY + boxH / 2 + 16);
    ctx.lineTo(x, midY + boxH / 2 + 22);
    ctx.stroke();
    ctx.fillStyle = '#4a4f64';
    ctx.font = '11px DM Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(i * 10, x, midY + boxH / 2 + 34);
  }

  // Bigotes (whiskers)
  ctx.strokeStyle = 'rgba(232,197,71,0.7)';
  ctx.lineWidth = 2;
  // Bigote izquierdo: min → Q1
  ctx.beginPath();
  ctx.moveTo(scale(minVal), midY);
  ctx.lineTo(scale(Q1), midY);
  ctx.stroke();
  // Bigote derecho: Q3 → max
  ctx.beginPath();
  ctx.moveTo(scale(Q3), midY);
  ctx.lineTo(scale(maxVal), midY);
  ctx.stroke();

  // Tapas de bigotes
  [minVal, maxVal].forEach(v => {
    ctx.beginPath();
    ctx.moveTo(scale(v), midY - boxH / 4);
    ctx.lineTo(scale(v), midY + boxH / 4);
    ctx.stroke();
  });

  // Caja Q1 → Q3
  ctx.fillStyle = 'rgba(232,197,71,0.12)';
  ctx.strokeStyle = 'rgba(232,197,71,0.8)';
  ctx.lineWidth = 2;
  const boxX = scale(Q1);
  const boxW2 = scale(Q3) - scale(Q1);
  ctx.fillRect(boxX, midY - boxH / 2, boxW2, boxH);
  ctx.strokeRect(boxX, midY - boxH / 2, boxW2, boxH);

  // Mediana
  ctx.strokeStyle = '#e8c547';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(scale(Q2), midY - boxH / 2);
  ctx.lineTo(scale(Q2), midY + boxH / 2);
  ctx.stroke();

  // Etiquetas
  ctx.fillStyle = '#e8c547';
  ctx.font = 'bold 11px DM Mono, monospace';
  ctx.textAlign = 'center';
  const labels = [
    { v: minVal, t: `Mín\n${minVal}` },
    { v: Q1, t: `Q₁\n${Q1}` },
    { v: Q2, t: `Med\n${Q2}` },
    { v: Q3, t: `Q₃\n${Q3}` },
    { v: maxVal, t: `Máx\n${maxVal}` },
  ];
  labels.forEach(({ v, t }) => {
    const x = scale(v);
    const lines = t.split('\n');
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '10px DM Mono, monospace';
    ctx.fillText(lines[0], x, midY - boxH / 2 - 18);
    ctx.fillStyle = '#e8c547';
    ctx.font = 'bold 11px DM Mono, monospace';
    ctx.fillText(lines[1], x, midY - boxH / 2 - 6);
  });
}
