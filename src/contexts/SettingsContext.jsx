/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect, useRef } from 'react';

const SettingsContext = createContext();

const STORAGE_KEY = 'settings.preferences';

const DEFAULT_SETTINGS = {
  altoContraste: false,
  tamanioTexto: 'medium',
  narracion: false,
  sonidos: true,
  vibracion: false,
  sonidoUI: 'click',
  accesibilidadExcavacion: false,
};

const readStoredSettings = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return DEFAULT_SETTINGS;
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    return {
      ...DEFAULT_SETTINGS,
      ...parsedValue,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const SOUND_PRESETS = {
  click: {
    oscillator: 'sine',
    start: 620,
    end: 420,
    gain: 0.12,
  },
  wood: {
    oscillator: 'triangle',
    start: 280,
    end: 180,
    gain: 0.14,
  },
  soft: {
    oscillator: 'sine',
    start: 420,
    end: 320,
    gain: 0.1,
  },
};

const MASTER_VOLUME = 6.35;

const createClickSound = (presetName = 'click') => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  const preset = SOUND_PRESETS[presetName] ?? SOUND_PRESETS.click;
  const audioContext = new AudioContextClass();

  return () => {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = preset.oscillator;
    oscillator.frequency.setValueAtTime(preset.start, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(preset.end, audioContext.currentTime + 0.04);

    gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(preset.gain * MASTER_VOLUME, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.08);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.09);

    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  };
};

export function SettingsProvider({ children }) {
  const initialSettings = readStoredSettings();
  const [altoContraste, setAltoContraste] = useState(initialSettings.altoContraste);
  const [tamanioTexto, setTamanioTexto] = useState(initialSettings.tamanioTexto);
  const [narracion, setNarracion] = useState(initialSettings.narracion);
  const [sonidos, setSonidos] = useState(initialSettings.sonidos);
  const [vibracion, setVibracion] = useState(initialSettings.vibracion);
  const [sonidoUI, setSonidoUI] = useState(initialSettings.sonidoUI);
  const [accesibilidadExcavacion, setAccesibilidadExcavacion] = useState(initialSettings.accesibilidadExcavacion);

  // Aplicar cambios al DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // Alto contraste
    if (altoContraste) {
      root.classList.add('alto-contraste');
    } else {
      root.classList.remove('alto-contraste');
    }
    
    // Tamaño de texto
    root.setAttribute('data-tamanio-texto', tamanioTexto);
    
  }, [altoContraste, tamanioTexto]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        altoContraste,
        tamanioTexto,
        narracion,
        sonidos,
        vibracion,
        sonidoUI,
        accesibilidadExcavacion,
      }));
    } catch (error) {
      // Ignoramos fallos de almacenamiento en modo privado o entornos restringidos.
    }

    const handleButtonClick = (event) => {
      if (!sonidos) {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const button = target?.closest('button');

      if (!button || button.disabled) {
        return;
      }

      if (button.getAttribute('aria-disabled') === 'true') {
        return;
      }

      const presetName = button.getAttribute('data-sound-preset') || sonidoUI;
      const playSound = createClickSound(presetName);

      playSound?.();
    };

    document.addEventListener('click', handleButtonClick, true);

    return () => {
      document.removeEventListener('click', handleButtonClick, true);
    };
  }, [altoContraste, tamanioTexto, narracion, sonidos, vibracion, sonidoUI, accesibilidadExcavacion]);

  const value = {
    altoContraste,
    setAltoContraste,
    tamanioTexto,
    setTamanioTexto,
    narracion,
    setNarracion,
    sonidos,
    setSonidos,
    sonidoUI,
    setSonidoUI,
    vibracion,
    setVibracion,
    accesibilidadExcavacion,
    setAccesibilidadExcavacion,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings debe usarse dentro de SettingsProvider');
  }
  return context;
}
