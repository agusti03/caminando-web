// src/pages/Coleccion.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaLock, FaMapMarkedAlt, FaInfoCircle, FaCheck } from 'react-icons/fa'
import './Coleccion.css'

import TransicionHoja from '../components/TransicionCuaderno' // <--- Importas el componente

function Coleccion() {
  const navigate = useNavigate()
  // Estado para abrir y cerrar el pop-up
  const [mostrarAviso, setMostrarAviso] = useState(false)

  return (
    <div className="escenario-coleccion">
      <button className="btn-volver-top" onClick={() => navigate('/')}>
        <FaArrowLeft /> Volver
      </button>

      <TransicionHoja>
        <div className="cuaderno-contenedor">
          {/* HOJA IZQUIERDA */}
          <div className="pagina-hoja hoja-izquierda">
                  <h2 className="titulo-seccion">Tu colección de fósiles</h2>

                  <div className="grid-fosiles">
                    {/* Fósil Descubierto */}
                    <div className="tarjeta-fosil descubierto">
                      <div className="check-descubierto">✓</div>
                      <img src="/src/assets/detalle-gliptodonte-gliptodonte.png" alt="Gliptodonte" className="img-animal" />
                      <span className="nombre-animal">Gliptodonte</span>
                      <button className="etiqueta-bloqueado btn-bloqueado" onClick={() => navigate('/detalle-gliptodonte')}>
                        <FaInfoCircle /> Ver detalle
                      </button>
                    </div>

                    {/* Fósil Oculto 1 */}
                    <div className="tarjeta-fosil bloqueado">
                      <img src="ruta-silueta-bloqueada1.png" alt="Oculto" className="img-animal silueta" />
                      <button className="etiqueta-bloqueado btn-bloqueado" onClick={() => setMostrarAviso(true)}>
                        <FaLock /> Fósil no descubierto
                      </button>
                    </div>

                    {/* Fósil Oculto 2 */}
                    <div className="tarjeta-fosil bloqueado">
                      <img src="ruta-silueta-bloqueada2.png" alt="Oculto" className="img-animal silueta" />
                      <button className="etiqueta-bloqueado btn-bloqueado" onClick={() => setMostrarAviso(true)}>
                        <FaLock /> Fósil no descubierto
                      </button>
                    </div>
                  </div>
                </div>

                {/* ANILLADO CENTRAL */}
                <div className="anillado-espiral">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="anillo"></div>
                  ))}
                </div>

                {/* HOJA DERECHA */}
                <div className="pagina-hoja hoja-derecha">
                  <div className="brujula-contenedor">
                    <div className="brujula-norte">N</div>
                    <div className="brujula-este">E</div>
                    <div className="brujula-sur">S</div>
                    <div className="brujula-oeste">O</div>
                    <div className="aguja-brujula"></div>
                  </div>

                  <p className="texto-sigue-explorando">¡Sigue explorando!</p>
                  <p className="texto-descripcion-derecha">
                    Visita el mapa para encontrar más fósiles en La Plata.
                  </p>

                  <button className="btn-ir-mapa" onClick={() => navigate('/mapa')}>
                    <FaMapMarkedAlt /> Ir al mapa
                  </button>
                </div>
              </div>
            </TransicionHoja>

            {/* POP-UP / MODAL EMERGENTE GLOBAL */}
            {mostrarAviso && (
              <div className="aviso-overlay">
                <div className="aviso-modal-popup">
                  <p className="aviso-texto">
                    ¡Debes realizar excavaciones para desbloquear más fósiles!
                  </p>
                  <div className="aviso-botones-layout">
                    {/* Botón Ir al mapa (No hace nada) */}
                    <button className="btn-popup-accion btn-popup-verde" onClick={() => {}}>
                      <FaMapMarkedAlt /> Ir al mapa
                    </button>
                    {/* Botón Ok (Cierra el pop-up) */}
                    <button className="btn-popup-accion btn-popup-marron" onClick={() => setMostrarAviso(false)}>
                      <FaCheck /> Ok
                    </button>
                  </div>
                </div>
              </div>
            )}
    </div>
  )
}

export default Coleccion