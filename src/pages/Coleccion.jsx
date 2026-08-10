// src/pages/Coleccion.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaLock, FaMapMarkedAlt, FaInfoCircle, FaCheck, FaCompass } from 'react-icons/fa'
import { supabase } from '../config/supabaseClient'

// Asegúrate de importar getFosilesDescubiertos también
import { estaFosilDescubierto, getFosilesDescubiertos } from '../utils/progreso' 

//CSS
import './Coleccion.css'

//Componentes
import BotonVolver from '../components/BotonVolver'

const obtenerImagenUrl = (slug) => {
  if (!slug) return null

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(`mamiferos/${slug}.png`)

  return data?.publicUrl || null
}

function Coleccion() {
  const navigate = useNavigate()
  
  const [mostrarAviso, setMostrarAviso] = useState(false)
  const [fosiles, setFosiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [paginaActual, setPaginaActual] = useState(0)

  const botonCerrarPopupRef = useRef(null)
  const FOSILES_POR_HOJA = 4
  const FOSILES_POR_CUADERNO = FOSILES_POR_HOJA * 2

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

  const totalPaginas = Math.max(1, Math.ceil(fosiles.length / FOSILES_POR_CUADERNO))
  const paginaInicio = paginaActual * FOSILES_POR_CUADERNO
  const fosilesDePagina = fosiles.slice(paginaInicio, paginaInicio + FOSILES_POR_CUADERNO)
  const fosilesHojaIzquierda = fosilesDePagina.slice(0, FOSILES_POR_HOJA)
  const fosilesHojaDerecha = fosilesDePagina.slice(FOSILES_POR_HOJA, FOSILES_POR_CUADERNO)

  const renderTarjeta = (fosil) => {
    const claseImagen = fosil.unlocked 
      ? (fosil.justUnlocked ? 'blocked' : 'illuminated') 
      : 'silueta'

    return (
      <div key={fosil.id} className={`tarjeta-fosil ${fosil.unlocked ? 'descubierto' : 'bloqueado'}`}>
        {fosil.unlocked && <div className="check-descubierto" aria-hidden="true">✓</div>}

        <img
          src={obtenerImagenUrl(fosil.slug)}
          alt={`Ilustración de un ${fosil.nombre}`}
          className={`img-animal ${claseImagen}`}
        />

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
  }

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
                fosilesHojaIzquierda.map(renderTarjeta)
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
          <section className="pagina-hoja hoja-derecha" aria-label="Fósiles de la siguiente hoja">
            <div className="grid-fosiles">
              {loading ? (
                <p>Cargando colección...</p>
              ) : (
                fosilesHojaDerecha.map(renderTarjeta)
              )}
            </div>
          </section>
        </div>

        {totalPaginas > 1 && (
          <div className="paginacion-inferior">
            <button className="btn-paginacion" disabled={paginaActual === 0} onClick={() => setPaginaActual(prev => Math.max(prev - 1, 0))}>
              ← Anterior
            </button>
            <span className="texto-pagina">Página {paginaActual + 1} / {totalPaginas}</span>
            <button className="btn-paginacion" disabled={paginaActual >= totalPaginas - 1} onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas - 1))}>
              Siguiente →
            </button>
          </div>
        )}

        <button className="btn-mapa-flotante" onClick={() => navigate('/mapa')} aria-label="Ir al mapa para descubrir más fósiles">
          <FaCompass aria-hidden="true" className="icono-brujula" />
          <span className="texto-flotante-mapa">Descubrir más fósiles</span>
        </button>

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