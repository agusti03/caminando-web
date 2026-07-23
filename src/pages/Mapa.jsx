import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import BotonVolver from '../components/BotonVolver';
import 'leaflet/dist/leaflet.css'; 
import './Mapa.css';

const Mapa = () => {
  const navigate = useNavigate();
  const [mostrarNota, setMostrarNota] = useState(true);
  const centroLaPlata = [-34.92, -57.95];

  return (
    <main className="mapa-page-bg">
      <BotonVolver className="btn-volver btn-volver-mapa" onClick={() => navigate(-1)} />

      <button
        className="btn-ajustes-mapa"
        type="button"
        onClick={() => navigate('/ajustes')}
        aria-label="Abrir ajustes"
      >
        <IoSettingsSharp aria-hidden="true" />
      </button>

      <h1 className="mapa-titulo">Expedición: La Plata</h1>

      <section className="mapa-panel" aria-label="Mapa de excavación">
        <div className="mapa-frame">
          <MapContainer
            center={centroLaPlata}
            zoom={15}
            className="leaflet-map-container"
            zoomControl={false}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="map-tiles-vintage"
            />
          </MapContainer>

          {mostrarNota && (
            <aside className="nota-postit" role="note" aria-label="Nota informativa del mapa">
              <button
                type="button"
                className="nota-cerrar"
                onClick={() => setMostrarNota(false)}
                aria-label="Cerrar la nota"
              >
                <FaTimes aria-hidden="true" />
              </button>
              <p>Se ha informado al museo de posibles hallazgos de fósiles.</p>
              <p>
                <strong>Selecciona uno de los puntos</strong> para inspeccionar el área y comenzar la excavación.
              </p>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
};

export default Mapa;