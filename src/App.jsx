import { useEffect, useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom'
import { FaBookOpen, FaCompass } from 'react-icons/fa';
import { FaMapLocationDot } from 'react-icons/fa6';
import { IoSettingsSharp } from 'react-icons/io5';
import BotonAyuda from './components/BotonAyuda';
import ModalAyuda from './components/ModalAyuda';
import Recursos from './pages/Recursos';
import Excavacion from './pages/Excavacion';

function App() {
  
  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const RECURSOS_PATH = '/recursos';
  const EXCAVACION_PATH = '/excavacion';
  
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

      <div className="polaroid">
        <div className="clip-metalico">📎</div>
        <img src="ruta-a-tu-foto-campamento.jpg" alt="Campamento base" />
        <p className="polaroid-texto">Campamento base, 2024</p>
      </div>

      <div className="huellas-contenedor">
        <img src="ruta-huella-violeta.png" className="huella h1" alt="huella" />
        <img src="ruta-huella-amarilla.png" className="huella h2" alt="huella" />
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

            <button className="btn-exploracion btn-verde" onClick={() => navigate('/coleccion')}>
              <FaMapLocationDot className="icono-btn" /> Mi colección de fósiles
            </button>

            <button className="btn-exploracion btn-oxido" onClick={() => navigate('/ajustes')}>
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

      <div className="logo-circular">
        <img src="caminando-logo.png" alt="Logo Caminando" />
      </div>
    </div>
  );
}

export default App;