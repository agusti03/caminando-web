// src/pages/Coleccion.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaLock, FaMapMarkedAlt, FaInfoCircle, FaCheck } from 'react-icons/fa'

//CSS
import './Coleccion.css'

//Componentes
import TransicionHoja from '../components/TransicionCuaderno'
import BotonVolver from '../components/BotonVolver'

//Imagenes
import gliptodonteImg from '../assets/detalle-gliptodonte-gliptodonte.png'

function Coleccion() {
  const navigate = useNavigate()
  const [mostrarAviso, setMostrarAviso] = useState(false)

  // 💡 Ref para forzar el foco del teclado dentro del modal emergente
  const botonCerrarPopupRef = useRef(null)

  // Efecto que detecta cuando se abre el modal y lleva el foco hacia él
  useEffect(() => {
    if (mostrarAviso && botonCerrarPopupRef.current) {
      botonCerrarPopupRef.current.focus()
    }
  }, [mostrarAviso])

  return (
    <main className="escenario-coleccion" aria-label="Tu Colección de Fósiles">

      <BotonVolver className="btn-volver" onClick={() => navigate(-1)} aria-label="Volver a la pantalla anterior" />

      <TransicionHoja>
        <div className="cuaderno-contenedor">
          {/* HOJA IZQUIERDA */}
          <section className="pagina-hoja hoja-izquierda" aria-label="Fósiles recolectados">
            <h2 className="titulo-seccion" tabIndex={0}>Tu colección de fósiles</h2>

            <div className="grid-fosiles">
              {/* Fósil Descubierto */}
              <div className="tarjeta-fosil descubierto">
                <div className="check-descubierto" aria-hidden="true">✓</div>
                <img src={gliptodonteImg} alt="Ilustración de un gliptodonte descubierto" className="img-animal" />
                <span className="nombre-animal">Gliptodonte</span>
                <button className="etiqueta-bloqueado btn-bloqueado" onClick={() => navigate('/detalle-gliptodonte')} aria-label="Ver detalle del Gliptodonte">
                  <FaInfoCircle aria-hidden="true" /> Ver detalle
                </button>
              </div>

              {/* Fósil Oculto 1 */}
              <div className="tarjeta-fosil bloqueado">
                <img src="ruta-silueta-bloqueada1.png" alt="Silueta de fósil oculto número 1" className="img-animal silueta" />
                <button className="etiqueta-bloqueado btn-bloqueado" onClick={() => setMostrarAviso(true)} aria-label="Fósil 1 no descubierto. Presiona para ver cómo desbloquear.">
                  <FaLock aria-hidden="true" /> Fósil no descubierto
                </button>
              </div>

              {/* Fósil Oculto 2 */}
              <div className="tarjeta-fosil bloqueado">
                <img src="ruta-silueta-bloqueada2.png" alt="Silueta de fósil oculto número 2" className="img-animal silueta" />
                <button className="etiqueta-bloqueado btn-bloqueado" onClick={() => setMostrarAviso(true)} aria-label="Fósil 2 no descubierto. Presiona para ver cómo desbloquear.">
                  <FaLock aria-hidden="true" /> Fósil no descubierto
                </button>
              </div>
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
            {/* Ocultamos la brújula visual para el lector, no aporta contenido textual directo, pero la sección sí */}
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
      </TransicionHoja>

      {/* 🏆 POP-UP / MODAL EMERGENTE GLOBAL CORREGIDO */}
      {mostrarAviso && (
        <div 
          className="aviso-overlay" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-aviso-titulo"
        >
          <div className="aviso-modal-popup">
            <p id="modal-aviso-titulo" className="aviso-texto">
              ¡Debes realizar excavaciones para desbloquear más fósiles!
            </p>
            <div className="aviso-botones-layout">
              {/* Botón Ir al mapa */}
              <button className="btn-popup-accion btn-popup-verde" onClick={() => navigate('/mapa')}>
                <FaMapMarkedAlt aria-hidden="true" /> Ir al mapa
              </button>
              {/* Botón Ok - Recibe el foco automáticamente */}
              <button 
                ref={botonCerrarPopupRef}
                className="btn-popup-accion btn-popup-marron" 
                onClick={() => setMostrarAviso(false)}
              >
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