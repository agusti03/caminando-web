// src/App.jsx
import './App.css';
import { Link } from 'react-router-dom'
import { FaCompass, FaBookOpen } from 'react-icons/fa'; // Categoría Font Awesome
import { FaMapLocationDot } from 'react-icons/fa6';     // Categoría Font Awesome 6
import { IoSettingsSharp } from 'react-icons/io5';       // Categoría Ionicons 5

function App() {
  return (
    <div className="escenario-exploracion">
      
      {/* 1. Elemento Izquierda: Foto Polaroid */}
      <div className="polaroid">
        <div className="clip-metalico">📎</div>
        <img src="ruta-a-tu-foto-campamento.jpg" alt="Campamento base" />
        <p className="polaroid-texto">Campamento base, 2024</p>
      </div>

      {/* 2. Elemento Izquierda: Huellas (pueden ser imágenes PNG transparentes) */}
      <div className="huellas-contenedor">
        <img src="ruta-huella-violeta.png" className="huella h1" alt="huella" />
        <img src="ruta-huella-amarilla.png" className="huella h2" alt="huella" />
      </div>

      {/* 3. BLOQUE CENTRAL: El cuaderno de hojas rayadas */}
      <div className="cuaderno-campo">
        <div className="margen-agujeros">
          {/* Circulitos del espiral simulados */}
          {[...Array(15)].map((_, i) => <div key={i} className="agujero"></div>)}
        </div>
        
        <div className="hoja-contenido">
          <h1 className="titulo-principal">Caminando sobre Gliptodontes</h1>
          <p className="subtitulo">Descubrí los gigantes que habitaron La Plata hace miles de años</p>
          
          {/* Botonera vertical estilizada */}
          <div className="botonera-cuaderno">
            <button className="btn-exploracion btn-marron">
              <FaCompass className="icono-btn" /> Realizar excavación
            </button>
            <Link className="btn-exploracion btn-verde" to="/coleccion">
              <FaMapLocationDot className="icono-btn" /> Mi colección de fósiles
            </Link>
            <button className="btn-exploracion btn-oxido">
              <IoSettingsSharp className="icono-btn" /> Ajustes
            </button>
            <button className="btn-exploracion btn-azul">
              <FaBookOpen className="icono-btn" /> Recursos
            </button>
          </div>
        </div>
      </div>

      {/* 4. Elemento Derecha: El Post-it */}
      <div className="post-it">
        <div className="cinta-adhesiva"></div>
        <p className="post-it-texto">
          Se ha informado al museo de posibles hallazgos de fósiles. 
          <span> Selecciona uno de los puntos</span> para inspeccionar el área y comenzar la excavación.
        </p>
      </div>

      {/* 5. Elemento Derecha Abajo: Logo Circular */}
      <div className="logo-circular">
        <img src="ruta-tu-logo-circular.png" alt="Logo Caminando" />
      </div>

    </div>
  );
}

export default App;