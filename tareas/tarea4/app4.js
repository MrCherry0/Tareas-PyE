// app4.js — Tarea 4: Problemas de Covarianza
// Página estática — animaciones de entrada para las secciones

document.addEventListener('DOMContentLoaded', () => {
  // Animar steps con delay progresivo
  document.querySelectorAll('.step').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + i * 120);
  });
});
