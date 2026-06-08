import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [altoContraste, setAltoContraste] = useState(false);
  const [tamanioTexto, setTamanioTexto] = useState('medium');
  const [narracion, setNarracion] = useState(false);
  const [sonidos, setSonidos] = useState(false);
  const [vibracion, setVibracion] = useState(false);

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

  const value = {
    altoContraste,
    setAltoContraste,
    tamanioTexto,
    setTamanioTexto,
    narracion,
    setNarracion,
    sonidos,
    setSonidos,
    vibracion,
    setVibracion,
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
