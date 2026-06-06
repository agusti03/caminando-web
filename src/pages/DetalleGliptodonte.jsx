// src/pages/DetalleGliptodonte.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './Coleccion.css';
import TransicionHoja from '../components/TransicionCuaderno';

function DetalleGliptodonte() {
  const navigate = useNavigate();
  
  // Estado para saber si el juego fue completado con éxito
  const [juegoGanado, setJuegoGanado] = useState(false);

  useEffect(() => {
    // Comprobamos el almacenamiento al cargar el cuaderno
    const completado = localStorage.getItem('triviaGliptodonteCompletada');
    if (completado === 'true') {
      setJuegoGanado(true);
    }
  }, []);

  // Datos estructurados de la imagen para renderizar los recuadros limpios
  const datosFosil = [
    { etiqueta: "ÉPOCA", valor: "Pleistoceno tardío", subtexto: "Hace 500,000 a 10,000 años atrás", icono: "📅" },
    { etiqueta: "HÁBITAT", valor: "Llanuras abiertas", subtexto: null, icono: "📍" },
    { etiqueta: "TAMAÑO", valor: "3 metros de largo", subtexto: null, icono: "📏" },
    { etiqueta: "PESO", valor: "Hasta 2,000 kg", subtexto: null, icono: "⚖️" }
  ];

  return (
    <div className="escenario-coleccion">
      <button className="btn-volver-top" onClick={() => navigate('/coleccion')}>
        <FaArrowLeft /> Volver
      </button>

      <TransicionHoja>
        <div className="cuaderno-contenedor">
          {/* HOJA IZQUIERDA - DETALLES DEL FÓSIL */}
          <div className="pagina-hoja hoja-izquierda">
            <h2 className="titulo-seccion">Gliptodonte</h2>

            <div className="contenedor-imagen-fosil">
              <img 
                src="/src/assets/detalle-gliptodonte-gliptodonte.png"
                alt="Ilustración de un gliptodonte"
                className="imagen-fosil"
              />
            </div>

            <h3 className="titulo-subseccion">Descripción</h3>
            <p className="texto-descripcion">
              Mamífero gigante acorazado herbívoro. Su caparazón rígido estaba formado 
              por miles de placas óseas hexagonales fusionadas que cubrían todo el cuerpo. 
              Se alimentaba de pasto bajo y hojas. Habitaba llanuras de Sudamérica.
            </p>
          </div>

          {/* ANILLADO CENTRAL */}
          <div className="anillado-espiral">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="anillo"></div>
            ))}
          </div>

          {/* HOJA DERECHA - SECCIÓN INTERACTIVA O DE DATOS RESTAURADOS */}
          <div className="pagina-hoja hoja-derecha" style={{ justifyContent: 'flex-start', alignItems: 'stretch' }}>
            
            {!juegoGanado ? (
              /* ❌ ESTADO INICIAL: JUEGO NO COMPLETADO (Muestra diálogo de Kira) */
              <div className="bloque-interactivo-juego">
                <div className="datos-borrosos-fondo">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="linea-borrosa"></div>
                  ))}
                </div>

                <div className="contenedor-personaje-dialogo">
                  <img 
                    src="/src/assets/detalle-gliptodonte-paleontologa.png" 
                    alt="Paleontóloga" 
                    className="imagen-exploradora"
                  />
                  <div className="globo-texto">
                    <p>¡Ups, no puedo leer mis anotaciones!</p>
                    <p>¡Ayúdame a recuperar más información de esta especie!</p>
                  </div>
                </div>

                <button className="boton-jugar" onClick={() => navigate('/juego-gliptodonte')}>
                  <span>🎮</span> ¡Jugar!
                </button>
              </div>
            ) : (
              /* ESTADO COMPLETADO: REVELA LOS DATOS ENMASCARANDO A KIRA AL FONDO */
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* 1. Recuadro amarillo "¿Sabías que...?" superior al estilo Post-it */}
                <div style={{
                  backgroundColor: '#fffde7',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '15px',
                  boxShadow: '2px 4px 10px rgba(0,0,0,0.08)',
                  transform: 'rotate(-0.5deg)',
                  marginBottom: '10px'
                }}>
                  <h4 style={{ margin: '0 0 5px 0', fontFamily: '"Comic Sans MS", cursive', color: '#4e342e', fontSize: '1.15rem' }}>
                    ¿Sabías que?
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#5d4037', lineHeight: '1.4', fontWeight: '500' }}>
                    Su caparazón estaba formado por más de 1000 placas óseas hexagonales que estaban fusionadas. Algunos gliptodontes podían superar los 3000 kg.
                  </p>
                </div>

                {/* Contenedor relativo para posicionar a Kira de fondo difuminada y las tarjetas encima */}
                <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                  
                  {/* 2. Kira difuminada (Background) */}
                  <img 
                    src="/src/assets/detalle-gliptodonte-paleontologa.png" 
                    alt="Paleontóloga" 
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      maxHeight: '340px',
                      width: 'auto',
                      opacity: 0.18,          // Se reduce mucho la opacidad
                      filter: 'blur(4px)',    // ✨ Aquí ocurre el difuminado técnico
                      pointerEvents: 'none',
                      zIndex: 1
                    }}
                  />

                  {/* 3. Renderizado de las 4 Tarjetas de Datos Recuperados (Foreground) */}
                  {datosFosil.map((item, index) => (
                    <div 
                      key={index} 
                      style={{
                        backgroundColor: '#f7f2e8', 
                        border: '2px solid #e6dfd3',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        zIndex: 2, // Por encima de Kira
                        boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
                      }}
                    >
                      {/* Círculo contenedor para el Icono / Avatar */}
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#bcaaa4',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '1.3rem',
                        color: '#fff'
                      }}>
                        {item.icono}
                      </div>

                      {/* Textos descriptivos */}
                      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#8d6e63', letterSpacing: '0.5px' }}>
                          {item.etiqueta}
                        </span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3e2723', margin: '2px 0' }}>
                          {item.valor}
                        </span>
                        {item.subtexto && (
                          <span style={{ fontSize: '0.85rem', color: '#795548' }}>
                            {item.subtexto}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        </div>
      </TransicionHoja>
    </div>
  );
}

export default DetalleGliptodonte;