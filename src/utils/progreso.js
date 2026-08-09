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
export const getJuegoCompletadoKey = (slug) => `trivia_${slug}_Completada`;

export const getJuegosCompletados = () => {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  const data = localStorage.getItem('juegoCompletado');
  if (!data) {
    return [];
  }

  try {
    const parsedData = JSON.parse(data);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.warn('No se pudo leer el progreso de juegos desde localStorage:', error);
    return [];
  }
};

export const guardarJuegoCompletado = (slug) => {
  if (!slug || typeof localStorage === 'undefined') {
    return;
  }

  const completados = getJuegosCompletados();

  if (!completados.includes(slug)) {
    completados.push(slug);
    localStorage.setItem('juegoCompletado', JSON.stringify(completados));
  }

  localStorage.setItem(getJuegoCompletadoKey(slug), 'true');
};

export const estaJuegoCompletado = (slug) => {
  if (!slug || typeof localStorage === 'undefined') {
    return false;
  }

  const completadoLocal = localStorage.getItem(getJuegoCompletadoKey(slug)) === 'true';
  if (completadoLocal) {
    return true;
  }

  const completados = getJuegosCompletados();
  return completados.includes(slug);
};