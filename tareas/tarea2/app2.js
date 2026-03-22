// app2.js — Tarea 2: Diagrama de Venn
// Dibuja un diagrama de Venn de tres conjuntos con las probabilidades del problema 66

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('vennCanvas');
  if (!canvas) return;

  // Ajustar canvas al contenedor
  const container = canvas.parentElement;
  const W = Math.min(container.offsetWidth - 48, 640);
  const H = Math.round(W * 0.625);
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');

  // Centros de los tres círculos (triángulo)
  const r = W * 0.24; // radio
  const cx = W / 2;
  const cy = H / 2 + H * 0.04;
  const offset = r * 0.62;

  const cA = { x: cx - offset, y: cy - offset * 0.55, r };   // A = correo (azul)
  const cB = { x: cx + offset, y: cy - offset * 0.55, r };   // B = celular (amarillo)
  const cC = { x: cx, y: cy + offset * 0.7, r };              // C = laptop (verde)

  // Colores semitransparentes
  const colA = 'rgba(91,141,238,0.22)';
  const colB = 'rgba(232,197,71,0.22)';
  const colC = 'rgba(78,203,113,0.22)';

  // Dibujar círculos
  function drawCircle(c, color, strokeColor) {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.clearRect(0, 0, W, H);

  // Fondo
  ctx.fillStyle = 'rgba(19,22,30,0.6)';
  ctx.fillRect(0, 0, W, H);

  // Dibujar los tres círculos
  drawCircle(cA, colA, 'rgba(91,141,238,0.7)');
  drawCircle(cB, colB, 'rgba(232,197,71,0.7)');
  drawCircle(cC, colC, 'rgba(78,203,113,0.7)');

  // Etiquetas de conjuntos
  function label(text, prob, x, y, color) {
    ctx.font = `bold ${Math.round(W * 0.025)}px DM Sans, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
    ctx.font = `${Math.round(W * 0.022)}px DM Mono, monospace`;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(prob, x, y + Math.round(W * 0.028));
  }

  // Etiquetas externas
  const fs = W * 0.028;
  label('A', 'Correo', cA.x - r * 0.55, cA.y - r * 0.62, '#5b8dee');
  label('B', 'Celular', cB.x + r * 0.55, cB.y - r * 0.62, '#e8c547');
  label('C', 'Laptop', cC.x, cC.y + r * 0.75, '#4ecb71');

  // Probabilidades en cada región
  // (posiciones aproximadas para cada intersección)
  const s = Math.round(W * 0.022);
  function probLabel(text, x, y, color) {
    ctx.font = `bold ${s}px DM Mono, monospace`;
    ctx.fillStyle = color || 'rgba(255,255,255,0.9)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
  }

  const d = r * 0.35;

  // Solo A (excluye B y C)
  probLabel('0.077', cA.x - d * 1.0, cA.y - d * 0.3, '#5b8dee');

  // Solo B (excluye A y C)
  probLabel('0.030', cB.x + d * 1.0, cB.y - d * 0.3, '#e8c547');

  // Solo C (excluye A y B)
  probLabel('0.018', cC.x, cC.y + d * 0.8, '#4ecb71');

  // A ∩ B (excluye C)
  probLabel('P(A∩B)=0.069', (cA.x + cB.x) / 2, cA.y - d * 0.15, 'rgba(200,190,130,0.9)');

  // A ∩ C (excluye B)
  probLabel('P(A∩C)=0.059', (cA.x + cC.x) / 2 - d * 0.3, (cA.y + cC.y) / 2 + d * 0.1, 'rgba(84,185,126,0.9)');

  // B ∩ C (excluye A)
  probLabel('P(B∩C)=0.049', (cB.x + cC.x) / 2 + d * 0.3, (cB.y + cC.y) / 2 + d * 0.1, 'rgba(155,195,110,0.9)');

  // Triple intersección A ∩ B ∩ C
  probLabel('P(A∩B∩C)', (cA.x + cB.x + cC.x) / 3, (cA.y + cB.y + cC.y) / 3 - s * 0.5, 'rgba(255,255,255,0.85)');
  probLabel('= 0.161', (cA.x + cB.x + cC.x) / 3, (cA.y + cB.y + cC.y) / 3 + s * 0.8, 'rgba(255,255,255,0.85)');

  // Exterior (ni A, ni B, ni C)
  ctx.font = `${Math.round(W * 0.02)}px DM Mono, monospace`;
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('P(Aᶜ∩Bᶜ∩Cᶜ) = 0.51', W * 0.03, H * 0.05);
});
