// main.js — Portafolio de Probabilidad y Estadística
// Animaciones y utilidades globales del index

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer para animaciones al hacer scroll
  const cards = document.querySelectorAll('.task-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
});
