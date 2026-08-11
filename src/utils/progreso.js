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
export const TRIVIA_COMPLETADA_KEY = 'triviaCompletada';

const migrarTriviasLegadas = () => {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  const slugsLegados = [];
  const keysToRemove = [];

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);

    if (!key || !key.startsWith('trivia_') || !key.endsWith('_Completada')) {
      continue;
    }

    const valor = localStorage.getItem(key);

    if (valor === 'true') {
      const slug = key.replace(/^trivia_/, '').replace(/_Completada$/, '');

      if (slug) {
        slugsLegados.push(slug);
      }
    }

    keysToRemove.push(key);
  }

  if (slugsLegados.length > 0) {
    const data = localStorage.getItem(TRIVIA_COMPLETADA_KEY);
    let completados = [];

    if (data) {
      try {
        const parsedData = JSON.parse(data);
        if (Array.isArray(parsedData)) {
          completados = parsedData;
        }
      } catch (error) {
        console.warn('No se pudo leer el progreso de juegos en migración:', error);
      }
    }

    slugsLegados.forEach((slug) => {
      if (!completados.includes(slug)) {
        completados.push(slug);
      }
    });

    localStorage.setItem(TRIVIA_COMPLETADA_KEY, JSON.stringify(completados));
  }

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });

  return slugsLegados;
};

export const getJuegoCompletadoKey = (slug) => `trivia_${slug}_Completada`;

export const getJuegosCompletados = () => {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  migrarTriviasLegadas();

  const data = localStorage.getItem(TRIVIA_COMPLETADA_KEY);

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
    localStorage.setItem(TRIVIA_COMPLETADA_KEY, JSON.stringify(completados));
  }
};

export const estaJuegoCompletado = (slug) => {
  if (!slug || typeof localStorage === 'undefined') {
    return false;
  }

  const completados = getJuegosCompletados();
  return completados.includes(slug);
};