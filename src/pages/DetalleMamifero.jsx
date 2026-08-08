// src/pages/DetalleMamifero.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient'; // Tu conexión a Supabase

import './Coleccion.css';
import TransicionHoja from '../components/TransicionCuaderno';
import BotonVolver from '../components/BotonVolver';

import kiraImg from '../assets/kira.png';
// Importa un helper para manejar las imágenes dinámicas (si las tienes locales)
// import { getFosilImage } from '../utils/imagenes'; 

function DetalleMamifero() {
  const { slugId } = useParams(); // Por ejemplo: /detalle/gliptodonte
  const navigate = useNavigate();
  const mainRef = useRef(null);
  
  const [fosil, setFosil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [juegoGanado, setJuegoGanado] = useState(false);

  useEffect(() => {
    // Verificamos en localStorage de forma dinámica
    const completado = localStorage.getItem(`trivia_${slugId}_Completada`);
    if (completado === 'true') {
      setJuegoGanado(true);
    }
  }, [slugId]);

  useEffect(() => {
    async function fetchFosil() {
      // Traemos toda la data de Supabase basándonos en el slug (ej. "gliptodonte")
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

  if (loading) return <div style={{ color: 'white' }}>Cargando datos del fósil...</div>;
  if (!fosil) return <div style={{ color: 'white' }}>Fósil no encontrado.</div>;

  // Armamos el array de datos mapeando las nuevas columnas de la BD
  const datosFicha = [
    { etiqueta: "ÉPOCA", valor: fosil.epoca, subtexto: fosil.epoca_subtexto, icono: "📅" },
    { etiqueta: "HÁBITAT", valor: fosil.habitat, subtexto: null, icono: "📍" },
    { etiqueta: "TAMAÑO", valor: fosil.tamano, subtexto: null, icono: "📏" },
    { etiqueta: "PESO", valor: fosil.peso, subtexto: null, icono: "⚖️" }
  ];

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

      <TransicionHoja>
        <div className="cuaderno-contenedor" role="region" aria-label={`Cuaderno de investigación: ${fosil.nombre}`}>
          
          {/* 📖 HOJA IZQUIERDA */}
          <article className="pagina-hoja hoja-izquierda">
            {/* Título dinámico */}
            <h1 className="titulo-seccion" tabIndex={0}>{fosil.nombre}</h1>

            <div className="contenedor-imagen-fosil">
              {/* Imagen dinámica: Puedes usar fosil.imagen_url si usas Supabase Storage, 
                  o una función que mapee el slug a la imagen importada localmente */}
              <img 
                src={fosil.imagen_url || `/assets/fosiles/${fosil.slug}.png`} 
                alt={`Ilustración de un ${fosil.nombre}`}
                className="imagen-fosil"
                tabIndex={0}
              />
            </div>

            <h2 className="titulo-subseccion" tabIndex={0}>Descripción</h2>
            {/* Descripción dinámica */}
            <p className="texto-descripcion" tabIndex={0}>
              {fosil.descripcion}
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
              <div className="bloque-interactivo-juego">
                <div className="datos-borrosos-fondo" aria-hidden="true">
                  {[...Array(8)].map((_, i) => <div key={i} className="linea-borrosa"></div>)}
                </div>

                <div className="contenedor-personaje-dialogo">
                  <img src={kiraImg} alt="" aria-hidden="true" className="imagen-exploradora" />
                  <div className="globo-texto" tabIndex={0} aria-label="Kira dice: ¡Ups, no puedo leer mis anotaciones! ¡Ayúdame a recuperar más información de esta especie!">
                    <p style={{ margin: 0 }}>¡Ups, no puedo leer mis anotaciones!</p>
                    <p style={{ margin: 0 }}>¡Ayúdame a recuperar más información de esta especie!</p>
                  </div>
                </div>

                {/* Botón dinámico que lleva al juego correcto basado en el ID del fósil */}
                <button 
                  className="boton-jugar" 
                  onClick={() => navigate(`/juego/${fosil.juego_id}`)} 
                  aria-label="Jugar la trivia para desbloquear información"
                >
                  <span aria-hidden="true">🎮</span> ¡Jugar!
                </button>
              </div>
            ) : (
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* Post-it dinámico (Solo se muestra si hay dato curioso) */}
                {fosil.dato_curioso && (
                  <section 
                    tabIndex={0}
                    className="post-it-curioso" // (Te sugiero pasar los estilos en línea a una clase CSS)
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
                    
                    {/* Iteramos los datos construidos dinámicamente, ignorando los que vengan vacíos de Supabase */}
                    {datosFicha.map((item, index) => {
                      if (!item.valor) return null; // Si no hay dato (ej. el animal no tiene peso en la BD), no renderiza la tarjeta.
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
                      )
                    })}
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

export default DetalleMamifero;