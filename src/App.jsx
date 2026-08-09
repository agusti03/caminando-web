import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { FaBookOpen, FaCompass } from 'react-icons/fa';
import { FaMapLocationDot } from 'react-icons/fa6';
import { IoSettingsSharp } from 'react-icons/io5';
import BotonAyuda from './components/BotonAyuda';
import ModalAyuda from './components/ModalAyuda';
import Recursos from './pages/Recursos';
import Excavacion from './pages/Excavacion';
import './App.css';

//  Rutas a imágenes
import huellaImg from './assets/huella-de-gliptodonte.png'
import campamentoImg from './assets/campamento-base-2024.jpg'

function App() {
  
  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const RECURSOS_PATH = '/recursos';
  const EXCAVACION_PATH = '/mapa';
  const COLECCION_PATH = '/coleccion' ;
  const AJUSTES_PATH = '/ajustes' ;
  
  return (
    <div className="escenario-exploracion">
      <BotonAyuda onClick={() => setShowHelpModal(true)} />

      <ModalAyuda 
        isOpen={showHelpModal} 
        onClose={() => setShowHelpModal(false)} 
        title="¿Cómo funciona?"
      >
        <ul>
          <li><strong>Realizar Excavación:</strong> Descubrí grandes mamíferos presentes en la ciudad para agregarlos al cuadernillo.</li>
          <li><strong>Mi colección de fósiles:</strong> Descubrí datos interesantes de los fósiles que descubriste jugando juegos!</li>
          <li><strong>Ajustes:</strong> Configurá el sitio web a tu gusto, incluyendo opciones de accesibilidad.</li>
          <li><strong>Recursos:</strong> Si te quedaste con ganas de más, acá vas a encontrar más información.</li>
        </ul>
      </ModalAyuda>

      <ModalAyuda
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        title="¿Quiénes somos?"
      >
        <div className="modal-quienes-somos-cuerpo">
          <p>
            Somos un colectivo de extensión universitaria de la UNLP (Universidad Nacional de La Plata) con orígen en 2009.
          </p>
          <p>
            Reunimos a estudiantes de diversas disciplinas académicas y abordamos la temática del patrimonio, como formador de identidad y como contenido transversal dentro de las ciencias naturales. En particular, buscamos el acercamiento al patrimonio paleontológico.
          </p>
          <p>
            Podés acceder a más información en la sección "Más Recursos" y encontrar diverso material audiovisual que te puede interesar.
          </p>
        </div>
      </ModalAyuda>

      <div className="polaroid">
        <div className="clip-metalico">📎</div>
        <img src={campamentoImg} alt="Campamento base" />
        <p className="polaroid-texto">Campamento base, 2024</p>
      </div>

      <div className="huellas-contenedor">
        <img src={huellaImg} className="huella" alt="huella-de-gliptodonte" />
      </div>

      <div className="cuaderno-campo">
        <div className="margen-agujeros">
          {[...Array(15)].map((_, i) => <div key={i} className="agujero"></div>)}
        </div>

        <div className="hoja-contenido">
          <h1 className="titulo-principal">Caminando sobre Gliptodontes</h1>
          <p className="subtitulo">Descubrí los gigantes que habitaron La Plata hace miles de años</p>

          <div className="botonera-cuaderno">

            <button className="btn-exploracion btn-marron" type="button" onClick={() => navigate(EXCAVACION_PATH)}>
              <FaCompass className="icono-btn" /> Realizar excavación
            </button>

            <button className="btn-exploracion btn-verde" onClick={() => navigate(COLECCION_PATH)}>
              <FaMapLocationDot className="icono-btn" /> Mi colección de fósiles
            </button>

            <button className="btn-exploracion btn-oxido" onClick={() => navigate(AJUSTES_PATH)}>
              <IoSettingsSharp className="icono-btn" /> Ajustes
            </button>

            <button className="btn-exploracion btn-azul" type="button" onClick={() => navigate(RECURSOS_PATH)}>
              <FaBookOpen className="icono-btn" /> Recursos
            </button>

          </div>
        </div>
      </div>

      <div className="post-it">
        <div className="cinta-adhesiva"></div>
        <p className="post-it-texto">
          Se ha informado al museo de posibles hallazgos de fósiles.
          <span> Selecciona uno de los puntos</span> para inspeccionar el área y comenzar la excavación.
        </p>
      </div>

      <div className="logo-area">
        <div className="logo-circular">
          <img src="caminando-logo.png" alt="Logo Caminando" />
        </div>
        <button className="btn-quienes-somos" type="button" onClick={() => setShowAboutModal(true)}>
          ¿Quienes somos?
        </button>
      </div>
    </div>
  );
}

export default App;