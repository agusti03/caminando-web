// src/pages/DetalleGliptodonte.jsx
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './Coleccion.css';

import TransicionHoja from '../components/TransicionCuaderno' // <--- Importas el componente

function DetalleGliptodonte() {
  const navigate = useNavigate();

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

          {/* ANILLADO CENTRAL (Manteniendo consistencia de 20 anillos) */}
          <div className="anillado-espiral">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="anillo"></div>
            ))}
          </div>

          {/* HOJA DERECHA - SECCIÓN INTERACTIVA JUEGO */}
          <div className="pagina-hoja hoja-derecha">
            <div className="bloque-interactivo-juego">
              
              {/* Fondo de líneas borrosas */}
              <div className="datos-borrosos-fondo">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="linea-borrosa"></div>
                ))}
              </div>

              {/* Personaje y su Globo de Diálogo */}
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

              {/* Botón de acción */}
              <button className="boton-jugar" onClick={() => navigate('/juego')}>
                <span>🎮</span> ¡Jugar!
              </button>
              
            </div>
          </div>
        </div>
      </TransicionHoja>
    </div>
  );
}

export default DetalleGliptodonte;