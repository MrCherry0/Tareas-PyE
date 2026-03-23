// app2.js — Tarea 2: Diagrama de Venn con todas las regiones correctas
// Datos del PDF (intersección triple calculada con fórmula de la unión)

const REGIONS = {
  onlyA:  0.15,   // Solo A
  onlyB:  0.06,   // Solo B
  onlyC:  0.02,   // Solo C
  AB:     0.03,   // A∩B sin C
  AC:     0.02,   // A∩C sin B
  BC:     0.01,   // B∩C sin A
  ABC:    0.20,   // Triple
  none:   0.51,   // Ninguno
};

// Colores sólidos para cada región
const COLORS = {
  onlyA: '#1e4fa8',
  onlyB: '#a07c10',
  onlyC: '#1a7a3c',
  AB:    '#7030a0',
  AC:    '#107a68',
  BC:    '#a05010',
  ABC:   '#404060',
};

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('vennCanvas');
  if (!canvas) return;

  // Tamaño responsivo
  function resize() {
    const W = canvas.parentElement.offsetWidth;
    const H = Math.round(W * 0.58);
    canvas.width  = W;
    canvas.height = H;
    draw(canvas, W, H);
  }

  resize();
  window.addEventListener('resize', resize);
});

function draw(canvas, W, H) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  // Fondo oscuro
  ctx.fillStyle = '#13161e';
  ctx.fillRect(0, 0, W, H);

  // ── Geometría de los 3 círculos ──
  const r  = W * 0.22;
  const cx = W / 2;
  const cy = H / 2 + H * 0.03;
  const d  = r * 0.68; // separación entre centros

  // Círculo A (correo) — izquierda-arriba
  const cA = { x: cx - d * 0.55, y: cy - d * 0.42 };
  // Círculo B (celular) — derecha-arriba
  const cB = { x: cx + d * 0.55, y: cy - d * 0.42 };
  // Círculo C (laptop) — abajo-centro
  const cC = { x: cx,            y: cy + d * 0.52 };

  // ── Pintar regiones con compositing ──
  // Usamos paths de clipping para aislar cada región

  function circPath(c) {
    const p = new Path2D();
    p.arc(c.x, c.y, r, 0, Math.PI * 2);
    return p;
  }

  const pA = circPath(cA);
  const pB = circPath(cB);
  const pC = circPath(cC);

  // Helper: fill a region defined by clip + composite
  function fillRegion(color, alpha, insideList, outsideList) {
    ctx.save();
    // clip to first "inside"
    ctx.beginPath();
    ctx.arc(insideList[0].x, insideList[0].y, r, 0, Math.PI * 2);
    ctx.clip();
    // additional inside clips
    for (let i = 1; i < insideList.length; i++) {
      ctx.beginPath();
      ctx.arc(insideList[i].x, insideList[i].y, r, 0, Math.PI * 2);
      ctx.clip();
    }
    // paint the whole area first
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // knock out "outside" circles using destination-out
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 1;
    for (const c of outsideList) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // A∩B∩C (triple) — pintamos primero como base
  ctx.save();
  ctx.beginPath(); ctx.arc(cA.x, cA.y, r, 0, Math.PI*2); ctx.clip();
  ctx.beginPath(); ctx.arc(cB.x, cB.y, r, 0, Math.PI*2); ctx.clip();
  ctx.beginPath(); ctx.arc(cC.x, cC.y, r, 0, Math.PI*2); ctx.clip();
  ctx.fillStyle = COLORS.ABC; ctx.globalAlpha = 0.85;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  // A∩B sin C
  fillRegion(COLORS.AB, 0.8, [cA, cB], [cC]);
  // A∩C sin B
  fillRegion(COLORS.AC, 0.8, [cA, cC], [cB]);
  // B∩C sin A
  fillRegion(COLORS.BC, 0.8, [cB, cC], [cA]);

  // Solo A
  fillRegion(COLORS.onlyA, 0.72, [cA], [cB, cC]);
  // Solo B
  fillRegion(COLORS.onlyB, 0.72, [cB], [cA, cC]);
  // Solo C
  fillRegion(COLORS.onlyC, 0.72, [cC], [cA, cB]);

  // ── Bordes de los círculos ──
  [[cA,'#5b8dee'],[cB,'#e8c547'],[cC,'#4ecb71']].forEach(([c, col]) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.9;
    ctx.stroke();
    ctx.globalAlpha = 1;
  });

  // ── Etiquetas de los conjuntos ──
  const fs = Math.max(12, Math.round(W * 0.026));
  ctx.font = `bold ${fs}px DM Sans, sans-serif`;
  ctx.textAlign = 'center';

  // A — arriba izquierda
  ctx.fillStyle = '#8ab4f8';
  ctx.fillText('A', cA.x - r * 0.55, cA.y - r * 0.72);
  ctx.font = `${Math.round(fs * 0.75)}px DM Mono, monospace`;
  ctx.fillStyle = 'rgba(138,180,248,0.7)';
  ctx.fillText('(correo)', cA.x - r * 0.55, cA.y - r * 0.72 + fs * 1.1);

  ctx.font = `bold ${fs}px DM Sans, sans-serif`;
  // B — arriba derecha
  ctx.fillStyle = '#f5d76e';
  ctx.fillText('B', cB.x + r * 0.55, cB.y - r * 0.72);
  ctx.font = `${Math.round(fs * 0.75)}px DM Mono, monospace`;
  ctx.fillStyle = 'rgba(245,215,110,0.7)';
  ctx.fillText('(celular)', cB.x + r * 0.55, cB.y - r * 0.72 + fs * 1.1);

  ctx.font = `bold ${fs}px DM Sans, sans-serif`;
  // C — abajo centro
  ctx.fillStyle = '#6ee89a';
  ctx.fillText('C', cC.x, cC.y + r * 0.82);
  ctx.font = `${Math.round(fs * 0.75)}px DM Mono, monospace`;
  ctx.fillStyle = 'rgba(110,232,154,0.7)';
  ctx.fillText('(laptop)', cC.x, cC.y + r * 0.82 + fs * 1.1);

  // ── Etiquetas de probabilidad en cada región ──
  const lfs = Math.max(10, Math.round(W * 0.022));

  function probLabel(text, x, y, color) {
    ctx.save();
    ctx.font = `bold ${lfs}px DM Mono, monospace`;
    ctx.fillStyle = color || '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // sombra para legibilidad
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 6;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  const od = r * 0.45; // offset para regiones exclusivas

  // Solo A
  probLabel('Solo A', cA.x - od, cA.y - od * 0.2, '#cde0ff');
  probLabel('0.15',   cA.x - od, cA.y - od * 0.2 + lfs * 1.3, '#fff');

  // Solo B
  probLabel('Solo B', cB.x + od, cB.y - od * 0.2, '#fff3c0');
  probLabel('0.06',   cB.x + od, cB.y - od * 0.2 + lfs * 1.3, '#fff');

  // Solo C
  probLabel('Solo C', cC.x, cC.y + od * 0.55, '#c0f0d0');
  probLabel('0.02',   cC.x, cC.y + od * 0.55 + lfs * 1.3, '#fff');

  // A∩B sin C (arriba centro)
  const abX = (cA.x + cB.x) / 2;
  const abY = (cA.y + cB.y) / 2 - r * 0.12;
  probLabel('A∩B', abX, abY, '#ddb8ff');
  probLabel('0.03', abX, abY + lfs * 1.3, '#fff');

  // A∩C sin B (izquierda abajo)
  const acX = (cA.x + cC.x) / 2 - r * 0.1;
  const acY = (cA.y + cC.y) / 2 + r * 0.1;
  probLabel('A∩C', acX, acY, '#9ef0e0');
  probLabel('0.02', acX, acY + lfs * 1.3, '#fff');

  // B∩C sin A (derecha abajo)
  const bcX = (cB.x + cC.x) / 2 + r * 0.1;
  const bcY = (cB.y + cC.y) / 2 + r * 0.1;
  probLabel('B∩C', bcX, bcY, '#ffd090');
  probLabel('0.01', bcX, bcY + lfs * 1.3, '#fff');

  // A∩B∩C (centro)
  const triX = (cA.x + cB.x + cC.x) / 3;
  const triY = (cA.y + cB.y + cC.y) / 3;
  probLabel('A∩B∩C', triX, triY - lfs * 0.7, '#e8e8ff');
  probLabel('0.20',   triX, triY + lfs * 0.8, '#fff');

  // Ninguno — esquina
  ctx.save();
  ctx.font = `${lfs * 0.9}px DM Mono, monospace`;
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Ninguno = 0.51', W * 0.025, H * 0.04);
  ctx.restore();
}
