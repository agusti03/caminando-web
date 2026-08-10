// src/pages/Coleccion.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaLock, FaMapMarkedAlt, FaInfoCircle, FaCheck } from 'react-icons/fa'
import { supabase } from '../config/supabaseClient'

// Asegúrate de importar getFosilesDescubiertos también
import { estaFosilDescubierto, getFosilesDescubiertos } from '../utils/progreso' 

//CSS
import './Coleccion.css'

//Componentes
import BotonVolver from '../components/BotonVolver'

function Coleccion() {
  const navigate = useNavigate()
  
  const [mostrarAviso, setMostrarAviso] = useState(false)
  const [fosiles, setFosiles] = useState([])
  const [loading, setLoading] = useState(true)

  const botonCerrarPopupRef = useRef(null)

  useEffect(() => {
    if (mostrarAviso && botonCerrarPopupRef.current) {
      botonCerrarPopupRef.current.focus()
    }
  }, [mostrarAviso])

  useEffect(() => {
    async function fetchFosiles() {
      const { data, error } = await supabase.from('mamiferos').select('*')

      if (!error && data) {
        // 1. Obtenemos la lista de slugs que el usuario ya descubrió
        const slugsDescubiertos = getFosilesDescubiertos()

        // 2. Separamos los datos de Supabase en descubiertos y no descubiertos
        const descubiertos = data.filter(f => slugsDescubiertos.includes(f.slug))
        const noDescubiertos = data.filter(f => !slugsDescubiertos.includes(f.slug))

        // 3. Mezclamos los no descubiertos y sacamos exactamente 3
        const tresRandomBloqueados = [...noDescubiertos]
          .sort(() => 0.5 - Math.random()) // Mezcla rápida
          .slice(0, 3) // Tomamos los 3 primeros

        // 4. Juntamos todo (primero los que ya tenés, luego los misteriosos)
        const coleccionFinal = [...descubiertos, ...tresRandomBloqueados]

        // 5. Procesamos el estado de animación y desbloqueo como antes
        const fosilesProcesados = coleccionFinal.map(fosil => {
          const isUnlocked = slugsDescubiertos.includes(fosil.slug)
          
          let justUnlocked = false;
          try { 
            justUnlocked = sessionStorage.getItem(`justUnlocked_${fosil.slug}`) === 'true' 
          } catch (e) { }

          return {
            ...fosil,
            unlocked: isUnlocked,
            justUnlocked: justUnlocked
          }
        })
        
        setFosiles(fosilesProcesados)
      }
      setLoading(false)
    }
    
    fetchFosiles()
  }, [])

  useEffect(() => {
    if (fosiles.length === 0) return;
    
    const timer = setTimeout(() => {
      fosiles.forEach(fosil => {
        if (fosil.justUnlocked) {
          try { sessionStorage.removeItem(`justUnlocked_${fosil.slug}`) } catch (e) { }
        }
      })
    }, 60);

    return () => clearTimeout(timer);
  }, [fosiles])

  return (
    <main className="escenario-coleccion" aria-label="Tu Colección de Fósiles">
      <BotonVolver className="btn-volver" onClick={() => navigate('/')} aria-label="Volver a la página principal" />

        <div className="cuaderno-contenedor">
          
          {/* HOJA IZQUIERDA */}
          <section className="pagina-hoja hoja-izquierda" aria-label="Fósiles recolectados">
            <h2 className="titulo-seccion" tabIndex={0}>Tu colección de fósiles</h2>

            <div className="grid-fosiles">
              
              {loading ? (
                <p>Cargando colección...</p>
              ) : (
                fosiles.map((fosil) => {
                  const claseImagen = fosil.unlocked 
                    ? (fosil.justUnlocked ? 'blocked' : 'illuminated') 
                    : 'silueta';
                    
                  return (
                    <div key={fosil.id} className={`tarjeta-fosil ${fosil.unlocked ? 'descubierto' : 'bloqueado'}`}>
                      
                      {fosil.unlocked && <div className="check-descubierto" aria-hidden="true">✓</div>}
                      
                      <img
                        src={fosil.imagen_url || `/assets/fosiles/${fosil.slug}.png`}
                        alt={`Ilustración de un ${fosil.nombre}`}
                        className={`img-animal ${claseImagen}`}
                        onError={(e) => { e.target.src = '/assets/silueta-default.png' }} 
                      />
                      
                      {/* Si está bloqueado, podrías ocultar el nombre poniendo "???" */}
                      <span className="nombre-animal">{fosil.unlocked ? fosil.nombre : "Fósil misterioso"}</span>
                      
                      {fosil.unlocked ? (
                        <button 
                          className="btn-detalle" 
                          onClick={() => navigate(`/detalle/${fosil.slug}`)} 
                          aria-label={`Ver detalle del ${fosil.nombre}`}
                        >
                          <FaInfoCircle aria-hidden="true" /> Ver detalle
                        </button>
                      ) : (
                        <button 
                          className="etiqueta-bloqueado btn-bloqueado" 
                          onClick={() => setMostrarAviso(true)} 
                          aria-label="Fósil no descubierto. Presiona para ver cómo desbloquear."
                        >
                          <FaLock aria-hidden="true" /> Fósil no descubierto
                        </button>
                      )}
                    </div>
                  )
                })
              )}
              
            </div>
          </section>

          {/* ANILLADO CENTRAL */}
          <div className="anillado-espiral" aria-hidden="true">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="anillo"></div>
            ))}
          </div>

          {/* HOJA DERECHA */}
          <section className="pagina-hoja hoja-derecha" aria-label="Sección de exploración">
            <div className="brujula-contenedor" aria-hidden="true">
              <div className="brujula-norte">N</div>
              <div className="brujula-este">E</div>
              <div className="brujula-sur">S</div>
              <div className="brujula-oeste">O</div>
              <div className="aguja-brujula"></div>
            </div>

            <p className="texto-sigue-explorando" tabIndex={0}>¡Sigue explorando!</p>
            <p className="texto-descripcion-derecha" tabIndex={0}>
              Visita el mapa para encontrar más fósiles en La Plata.
            </p>

            <button className="btn-ir-mapa" onClick={() => navigate('/mapa')}>
              <FaMapMarkedAlt aria-hidden="true" /> Ir al mapa
            </button>
          </section>
        </div>

      {/* POP-UP / MODAL EMERGENTE GLOBAL */}
      {mostrarAviso && (
        <div className="aviso-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-aviso-titulo">
          <div className="aviso-modal-popup">
            <p id="modal-aviso-titulo" className="aviso-texto">
              ¡Debes realizar excavaciones para desbloquear más fósiles!
            </p>
            <div className="aviso-botones-layout">
              <button className="btn-popup-accion btn-popup-verde" onClick={() => navigate('/mapa')}>
                <FaMapMarkedAlt aria-hidden="true" /> Ir al mapa
              </button>
              <button ref={botonCerrarPopupRef} className="btn-popup-accion btn-popup-marron" onClick={() => setMostrarAviso(false)}>
                <FaCheck aria-hidden="true" /> Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Coleccion