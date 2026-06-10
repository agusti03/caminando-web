// src/pages/DetalleGliptodonte.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

//CSS
import './Coleccion.css';

//Componentes
import TransicionHoja from '../components/TransicionCuaderno';
import BotonVolver from '../components/BotonVolver';

//Imágenes
import gliptodonteImg from '../assets/detalle-gliptodonte-gliptodonte.png'
import kiraImg from '../assets/kira.png'

function DetalleGliptodonte() {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const [juegoGanado, setJuegoGanado] = useState(false);

  useEffect(() => {
    const completado = localStorage.getItem('triviaGliptodonteCompletada');
    if (completado === 'true') {
      setJuegoGanado(true);
    }
  }, []);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, []);

  const datosFosil = [
    { etiqueta: "ÉPOCA", valor: "Pleistoceno tardío", subtexto: "Hace 500,000 a 10,000 años atrás", icono: "📅" },
    { etiqueta: "HÁBITAT", valor: "Llanuras abiertas", subtexto: null, icono: "📍" },
    { etiqueta: "TAMAÑO", valor: "3 metros de largo", subtexto: null, icono: "📏" },
    { etiqueta: "PESO", valor: "Hasta 2,000 kg", subtexto: null, icono: "⚖️" }
  ];

  return (
    <main
      ref={mainRef}
      className="escenario-coleccion"
      tabIndex={-1} // Mantiene el foco inicial por JS, pero no ensucia el Tab
      aria-label="Detalle del gliptodonte"
    >
      {/* 1. PRIMER ELEMENTO AL HACER TAB: El botón de volver */}
      <BotonVolver 
        className="btn-volver" 
        onClick={() => navigate(-1)} 
        aria-label="Volver a la colección"
        tabIndex={0} // Forzamos que sea el primer punto de parada
      />

      <TransicionHoja>
        <div className="cuaderno-contenedor" role="region" aria-label="Cuaderno de investigación: Gliptodonte">
          
          {/* 📖 HOJA IZQUIERDA */}
          <article className="pagina-hoja hoja-izquierda">
            {/* Agregamos tabIndex={0} a los bloques de lectura principales si queremos que el teclado se detenga a leerlos */}
            <h1 className="titulo-seccion" tabIndex={0}>Gliptodonte</h1>

            <div className="contenedor-imagen-fosil">
              <img 
                src={gliptodonteImg}
                alt="Ilustración de un gliptodonte, mamífero gigante con caparazón acorazado"
                className="imagen-fosil"
                tabIndex={0} // La imagen descriptiva ahora es alcanzable para que lean su 'alt'
              />
            </div>

            <h2 className="titulo-subseccion" tabIndex={0}>Descripción</h2>
            <p className="texto-descripcion" tabIndex={0}>
              Mamífero gigante acorazado herbívoro. Su caparazón rígido estaba formado 
              por miles de placas óseas hexagonales fusionadas que cubrían todo el cuerpo. 
              Se alimentaba de pasto bajo y hojas. Habitaba llanuras de Sudamérica.
            </p>
          </article>

          {/* 📎 ANILLADO CENTRAL */}
          <div className="anillado-espiral" aria-hidden="true">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="anillo"></div>
            ))}
          </div>

          {/* 📖 HOJA DERECHA */}
          <article className="pagina-hoja hoja-derecha" style={{ justifyContent: 'flex-start', alignItems: 'stretch' }}>
            
            {!juegoGanado ? (
              /* ❌ ESTADO INICIAL: JUEGO NO COMPLETADO */
              <div className="bloque-interactivo-juego">
                <div className="datos-borrosos-fondo" aria-hidden="true">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="linea-borrosa"></div>
                  ))}
                </div>

                <div className="contenedor-personaje-dialogo">
                  <img 
                    src={kiraImg} 
                    alt="" 
                    aria-hidden="true"
                    className="imagen-exploradora"
                  />
                  {/* Le damos foco al globo para que el usuario de teclado lo escuche ANTES de llegar al botón jugar */}
                  <div className="globo-texto" tabIndex={0} aria-label="Kira dice: ¡Ups, no puedo leer mis anotaciones! ¡Ayúdame a recuperar más información de esta especie!">
                    <p style={{ margin: 0 }}>¡Ups, no puedo leer mis anotaciones!</p>
                    <p style={{ margin: 0 }}>¡Ayúdame a recuperar más información de esta especie!</p>
                  </div>
                </div>

                {/* El botón nativo ya es alcanzable con Tab automáticamente */}
                <button 
                  className="boton-jugar" 
                  onClick={() => navigate('/juego-gliptodonte')} 
                  aria-label="Jugar la trivia para desbloquear información"
                >
                  <span aria-hidden="true">🎮</span> ¡Jugar!
                </button>
              </div>
            ) : (
              /* ESTADO COMPLETADO: REVELA LOS DATOS */
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* Post-it alcanzable con Tab */}
                <section 
                  tabIndex={0}
                  style={{
                    backgroundColor: '#fffde7',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    padding: '15px',
                    boxShadow: '2px 4px 10px rgba(0,0,0,0.08)',
                    transform: 'rotate(-0.5deg)',
                    marginBottom: '10px'
                  }} 
                  aria-label="Dato curioso: ¿Sabías que? Su caparazón estaba formado por más de 1000 placas óseas hexagonales que estaban fusionadas. Algunos gliptodontes podían superar los 3000 kg."
                >
                  <h3 style={{ margin: '0 0 5px 0', fontFamily: '"Patrick Hand"', color: '#4e342e', fontSize: '1.15rem' }}>
                    ¿Sabías que?
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontFamily:"Nunito Sans" , color: '#5d4037', lineHeight: '1.4', fontWeight: '500' }}>
                    Su caparazón estaba formado por más de 1000 placas óseas hexagonales que estaban fusionadas. Algunos gliptodontes podían superar los 3000 kg.
                  </p>
                </section>

                <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                  
                  <h3 className="sr-only">Ficha técnica del fósil</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily:"Nunito Sans" ,display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 2 }}>
                    {datosFosil.map((item, index) => (
                      <li 
                        key={index} 
                        tabIndex={0} // 💡 CLAVE: Esto hace que cada tarjeta reciba el foco del Tabulador
                        aria-label={`${item.etiqueta}: ${item.valor}. ${item.subtexto ? item.subtexto : ''}`}
                        style={{
                          backgroundColor: '#f7f2e8', 
                          border: '2px solid #e6dfd3',
                          borderRadius: '12px',
                          padding: '12px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
                        }}
                      >
                        <div aria-hidden="true" style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#6f5045', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.3rem', color: '#fff', flexShrink: 0 }}>
                          {item.icono}
                        </div>

                        <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6f5045', letterSpacing: '0.5px' }}>
                            {item.etiqueta}
                          </span>
                          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6f5045', margin: '2px 0' }}>
                            {item.valor}
                          </span>
                          {item.subtexto && (
                            <span style={{ fontSize: '0.85rem', color: '#6f5045' }}>
                              {item.subtexto}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                </div>
              </div>
            )}

          </article>
        </div>
      </TransicionHoja>
    </main>
  );
}

export default DetalleGliptodonte;