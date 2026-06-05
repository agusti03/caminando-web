// src/components/TransicionCuaderno.jsx
import { useEffect, useRef, useState } from 'react';
import './TransicionCuaderno.css';

function TransicionCuaderno({ children }) {
  const contenedorRef = useRef(null);
  const hojasRef = useRef([]);
  const [animacionCompleta, setAnimacionCompleta] = useState(false);
  const [numeroPaginas] = useState(3);
  const [esMobile, setEsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setEsMobile(window.innerWidth <= 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      hojasRef.current.forEach((hoja, index) => {
        if (hoja) {
          setTimeout(() => {
            hoja.classList.add('animacion-activa');
          }, index * 250);
        }
      });
    });

    const completarAnimacion = setTimeout(() => {
      setAnimacionCompleta(true);
    }, numeroPaginas * 400);

    return () => {
      cancelAnimationFrame(timer);
      clearTimeout(completarAnimacion);
    };
  }, [numeroPaginas]);

  return (
    <div ref={contenedorRef} className={`transicion-cuaderno-contenedor ${esMobile ? 'mobile' : 'desktop'}`}>
      <div className={`contenido-pagina ${animacionCompleta ? 'visible' : ''}`}>
        {children}
      </div>

      {!animacionCompleta && (
        <div className="overlay-hojas">
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