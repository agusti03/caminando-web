// src/components/TransicionCuaderno.jsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './TransicionCuaderno.css';

function TransicionCuaderno({ children }) {
  const contenedorRef = useRef(null);
  const contenidoRef = useRef(null);
  const hojasRef = useRef([]);
  const [animacionCompleta, setAnimacionCompleta] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [size, setSize] = useState({ width: 'auto', height: 'auto' });
  const [numeroPaginas] = useState(3);
  const [esMobile, setEsMobile] = useState(window.innerWidth <= 480);

  const measureSize = () => {
    const contentEl = contenidoRef.current;
    if (!contentEl) return;
    const rect = contentEl.getBoundingClientRect();
    setSize({ width: `${Math.round(rect.width)}px`, height: `${Math.round(rect.height)}px` });
  };

  useEffect(() => {
    const handleResize = () => {
      setEsMobile(window.innerWidth <= 480);
      requestAnimationFrame(measureSize);
    };

    window.addEventListener('resize', handleResize);
    measureSize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useLayoutEffect(() => {
    measureSize();
  }, [animacionCompleta, esMobile]);

  useEffect(() => {
    setAnimacionCompleta(false);
    setFadeOut(false);

    const activationTimers = [];
    const timer = requestAnimationFrame(() => {
      hojasRef.current.forEach((hoja, index) => {
        if (hoja) {
          const activationTimer = setTimeout(() => {
            hoja.classList.add('animacion-activa');
          }, index * 250);
          activationTimers.push(activationTimer);
        }
      });
    });

    const pageDelay = 250;
    const flipDuration = 1000;
    const lastFlipStart = (numeroPaginas - 1) * pageDelay;
    const totalAnimationDuration = lastFlipStart + flipDuration;
    const fadeStart = Math.max(totalAnimationDuration - 300, 0);
    const fadeDuration = 350;

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, fadeStart);

    const completarAnimacion = setTimeout(() => {
      setAnimacionCompleta(true);
    }, fadeStart + fadeDuration);

    return () => {
      cancelAnimationFrame(timer);
      activationTimers.forEach(clearTimeout);
      clearTimeout(fadeTimer);
      clearTimeout(completarAnimacion);
    };
  }, [numeroPaginas]);

  return (
    <div
      ref={contenedorRef}
      className={`transicion-cuaderno-contenedor ${esMobile ? 'mobile' : 'desktop'}`}
      style={{ width: size.width, height: size.height }}
    >
      <div ref={contenidoRef} className={`contenido-pagina ${animacionCompleta ? 'visible' : ''}`}>
        {children}
      </div>

      {!animacionCompleta && (
        <div className={`overlay-hojas ${fadeOut ? 'fade-out' : ''}`}>
          {[...Array(numeroPaginas)].map((_, index) => (
            <div
              key={index}
              ref={(el) => (hojasRef.current[index] = el)}
              className="hoja-giratoria"
              style={{
                zIndex: numeroPaginas - index,
              }}
            >
              {/* Desktop: Lado izquierdo FIJO, lado derecho GIRA */}
              {/* Mobile: Página completa que sube */}
              <div className="hoja-media hoja-media-izquierda">
                <div className="hoja-cara hoja-delantera-izq"></div>
                <div className="hoja-cara hoja-trasera-izq"></div>
              </div>

              <div className="hoja-media hoja-media-derecha">
                <div className="hoja-cara hoja-delantera-der"></div>
                <div className="hoja-cara hoja-trasera-der"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransicionCuaderno;