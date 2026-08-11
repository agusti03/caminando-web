// src/pages/DetalleMamifero.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import '@google/model-viewer';

import './Coleccion.css';
import BotonVolver from '../components/BotonVolver';
import { estaJuegoCompletado } from '../utils/progreso';

import kiraImg from '../assets/kira.png';

const obtenerImagenUrl = (slug) => {
  if (!slug) return null;
  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(`mamiferos/${slug}.png`);

  return data?.publicUrl || null;
};

const obtenerModelo3DUrl = (slug) => {
  if (!slug) return null;
  const { data } = supabase.storage
    .from('modelos-3d')
    .getPublicUrl(`smilodon.glb`);

  return data?.publicUrl || null;
};

function DetalleMamifero() {
  const { slugId } = useParams();
  const navigate = useNavigate();
  const mainRef = useRef(null);
  
  const [fosil, setFosil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [juegoGanado, setJuegoGanado] = useState(false);
  const [modal3DAbierto, setModal3DAbierto] = useState(false);

  function renderEstadoBase({ navigate, ariaLabel, titulo, mensaje }) {
    return (
      <main className="escenario-coleccion" aria-label={ariaLabel}>
        <BotonVolver
          className="btn-volver"
          onClick={() => navigate('/coleccion')}
          aria-label="Volver a la colección"
          tabIndex={0}
        />

        <div className="cuaderno-contenedor">
          <section className="pagina-hoja hoja-izquierda" aria-label={ariaLabel}>
            <h2 className="titulo-seccion" tabIndex={0}>{titulo}</h2>
            <p>{mensaje}</p>
          </section>

          <div className="anillado-espiral" aria-hidden="true">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="anillo"></div>
            ))}
          </div>

          <section className="pagina-hoja hoja-derecha" aria-hidden="true" />
        </div>
      </main>
    );
  }

  useEffect(() => {
    setJuegoGanado(estaJuegoCompletado(slugId));
  }, [slugId]);

  useEffect(() => {
    async function fetchFosil() {
      const { data, error } = await supabase
        .from('mamiferos')
        .select('*')
        .eq('slug', slugId)
        .single();

      if (!error && data) {
        setFosil(data);
      }
      setLoading(false);
    }
    fetchFosil();
  }, [slugId]);

  useEffect(() => {
    if (mainRef.current && !loading) {
      mainRef.current.focus();
    }
  }, [loading]);

  useEffect(() => {
    const manejarKeyDown = (e) => {
      if (e.key === 'Escape' && modal3DAbierto) {
        setModal3DAbierto(false);
      }
    };
    window.addEventListener('keydown', manejarKeyDown);
    return () => window.removeEventListener('keydown', manejarKeyDown);
  }, [modal3DAbierto]);

  if (loading) {
    return renderEstadoBase({
      navigate,
      ariaLabel: 'Cargando detalle de fósil',
      titulo: 'Detalle del fósil',
      mensaje: 'Cargando colección...',
    });
  }

  if (!fosil) {
    return renderEstadoBase({
      navigate,
      ariaLabel: 'Fósil no encontrado',
      titulo: 'Detalle del fósil',
      mensaje: 'Fósil no encontrado.',
    });
  }

  const datosFicha = [
    { etiqueta: "ÉPOCA", valor: fosil.epoca, subtexto: fosil.epoca_subtexto, icono: "📅" },
    { etiqueta: "HÁBITAT", valor: fosil.habitat, subtexto: null, icono: "📍" },
    { etiqueta: "TAMAÑO", valor: fosil.tamano, subtexto: null, icono: "📏" },
    { etiqueta: "PESO", valor: fosil.peso, subtexto: null, icono: "⚖️" }
  ];

  const urlModelo3D = obtenerModelo3DUrl(fosil.slug);

  return (
    <main
      ref={mainRef}
      className="escenario-coleccion"
      tabIndex={-1}
      aria-label={`Detalle del ${fosil.nombre}`}
    >
      <BotonVolver 
        className="btn-volver" 
        onClick={() => navigate('/coleccion')} 
        aria-label="Volver a la colección"
        tabIndex={0} 
      />

      <div className="cuaderno-contenedor" role="region" aria-label={`Cuaderno de investigación: ${fosil.nombre}`}>
        
        {/* 📖 HOJA IZQUIERDA */}
        <article className="pagina-hoja hoja-izquierda">
          <h1 className="titulo-seccion" tabIndex={0}>{fosil.nombre}</h1>

          <div className="contenedor-imagen-fosil">
            <img 
              src={obtenerImagenUrl(fosil.slug)} 
              alt={`Ilustración de un ${fosil.nombre}`}
              className="imagen-fosil"
              tabIndex={0}
            />
          </div>

          <h2 className="titulo-subseccion" tabIndex={0}>Descripción</h2>
          <p className="texto-descripcion" tabIndex={0}>
            {fosil.descripcion}
          </p>

          {/* 🦴 BOTÓN DE MODELO 3D (BLOQUEADO / DESBLOQUEADO) */}
          <div style={{ marginTop: '15px' }}>
            {juegoGanado ? (
              <button 
                className="boton-ver-3d"
                onClick={() => setModal3DAbierto(true)}
                aria-label={`Ver modelo 3D interactivo de ${fosil.nombre}`}
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#6f5045',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                  transition: 'transform 0.2s ease, background-color 0.2s ease'
                }}
              >
                <span aria-hidden="true">🦴</span> Ver modelo 3D
              </button>
            ) : (
              <button 
                disabled
                aria-label="Modelo 3D bloqueado. Completa la trivia para desbloquearlo"
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#d6cfc7',
                  color: '#7a7067',
                  border: '2px dashed #b5ab9e',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'not-allowed',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span aria-hidden="true">🔒</span> Modelo 3D bloqueado (Completa la trivia)
              </button>
            )}
          </div>
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
            <div className="bloque-interactivo-juego">
              <div className="datos-borrosos-fondo" aria-hidden="true">
                {[...Array(8)].map((_, i) => <div key={i} className="linea-borrosa"></div>)}
              </div>

              <div className="contenedor-personaje-dialogo">
                <div className="globo-texto" tabIndex={0} aria-label="Kira dice: ¡Ups, no puedo leer mis anotaciones! ¡Ayúdame a recuperar más información de esta especie!">
                  <p style={{ margin: 0 }}>¡Ups, no puedo leer mis anotaciones!</p>
                  <p style={{ margin: 0 }}>¡Ayúdame a recuperar más información de esta especie!</p>
                </div>
                <img src={kiraImg} alt="" aria-hidden="true" className="imagen-exploradora" />
              </div>

              <button 
                className="boton-jugar" 
                onClick={() => navigate(`/juego/${fosil.juego_id}/${fosil.slug}`)} 
                aria-label="Jugar la trivia para desbloquear información"
              >
                <span aria-hidden="true">🎮</span> ¡Jugar!
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {fosil.dato_curioso && (
                <section 
                  tabIndex={0}
                  className="post-it-curioso"
                  style={{ backgroundColor: '#fffde7', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '15px', boxShadow: '2px 4px 10px rgba(0,0,0,0.08)', transform: 'rotate(-0.5deg)', marginBottom: '10px' }} 
                  aria-label={`Dato curioso: ${fosil.dato_curioso}`}
                >
                  <h3 style={{ margin: '0 0 5px 0', fontFamily: '"Patrick Hand"', color: '#4e342e', fontSize: '1.15rem' }}>
                    ¿Sabías que?
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontFamily:"Nunito Sans", color: '#5d4037', lineHeight: '1.4', fontWeight: '500' }}>
                    {fosil.dato_curioso}
                  </p>
                </section>
              )}

              <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                <h3 className="sr-only">Ficha técnica del fósil</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 2 }}>
                  {datosFicha.map((item, index) => {
                    if (!item.valor) return null;
                    return (
                      <li 
                        key={index} 
                        tabIndex={0} 
                        aria-label={`${item.etiqueta}: ${item.valor}. ${item.subtexto ? item.subtexto : ''}`}
                        style={{ backgroundColor: '#f7f2e8', border: '2px solid #e6dfd3', borderRadius: '12px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}
                      >
                        <div aria-hidden="true" style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#6f5045', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.3rem', color: '#fff', flexShrink: 0 }}>
                          {item.icono}
                        </div>

                        <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6f5045', letterSpacing: '0.5px' }}>{item.etiqueta}</span>
                          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6f5045', margin: '2px 0' }}>{item.valor}</span>
                          {item.subtexto && (
                            <span style={{ fontSize: '0.85rem', color: '#6f5045' }}>{item.subtexto}</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </article>
      </div>

      {/* 🔮 MODAL VISUALIZADOR 3D (Solo accesible si juegoGanado === true) */}
      {modal3DAbierto && juegoGanado && (
        <div 
          className="modal-overlay-3d"
          onClick={() => setModal3DAbierto(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Visor 3D de ${fosil.nombre}`}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            className="modal-contenido-3d"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '800px',
              height: '80vh',
              backgroundColor: '#1a1a1a',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px 20px',
              backgroundColor: '#2a2a2a',
              color: '#ffffff'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Modelo 3D - {fosil.nombre}</h2>
              <button 
                onClick={() => setModal3DAbierto(false)}
                aria-label="Cerrar visor 3D"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '4px 8px'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
              <model-viewer
                src={urlModelo3D}
                alt={`Modelo 3D interactivo de ${fosil.nombre}`}
                camera-controls
                auto-rotate
                shadow-intensity="1"
                ar
                style={{ width: '100%', height: '100%' }}
              >
                <div slot="poster" style={{ color: '#fff', textAlign: 'center', paddingTop: '20%' }}>
                  Cargando modelo 3D...
                </div>
              </model-viewer>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default DetalleMamifero;