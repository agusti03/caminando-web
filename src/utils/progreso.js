// src/utils/progreso.js

// --- FÓSILES (EXCAVACIÓN) ---
export const getFosilesDescubiertos = () => {
  const data = localStorage.getItem('fosilDescubierto');
  return data ? JSON.parse(data) : []; // Retorna el vector o uno vacío si no existe
};

export const guardarFosilDescubierto = (slug) => {
  const descubiertos = getFosilesDescubiertos();
  if (!descubiertos.includes(slug)) {
    descubiertos.push(slug);
    localStorage.setItem('fosilDescubierto', JSON.stringify(descubiertos));
  }
};

export const estaFosilDescubierto = (slug) => {
  const descubiertos = getFosilesDescubiertos();
  return descubiertos.includes(slug);
};

// --- JUEGOS (TRIVIAS) ---
export const getJuegosCompletados = () => {
  const data = localStorage.getItem('juegoCompletado');
  return data ? JSON.parse(data) : [];
};

export const guardarJuegoCompletado = (slug) => {
  const completados = getJuegosCompletados();
  if (!completados.includes(slug)) {
    completados.push(slug);
    localStorage.setItem('juegoCompletado', JSON.stringify(completados));
  }
};

export const estaJuegoCompletado = (slug) => {
  const completados = getJuegosCompletados();
  return completados.includes(slug);
};