import { useEffect, useState } from 'react';
import { Marker, MapContainer, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import fosilImg from '../assets/fosil.png';
import BotonVolver from '../components/BotonVolver';
import BotonAyuda from '../components/BotonAyuda';
import ModalAyuda from '../components/ModalAyuda';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';

const coordenadaPin = [-34.903944444, -58.015777778];

const ControlMapa = () => {
  const map = useMap();

  useEffect(() => {
    map.setView(coordenadaPin, 16);
    map.invalidateSize();
  }, [map]);

  return null;
};

function Mapa ( {onBack}) {
  const navigate = useNavigate();
  const [mostrarNota, setMostrarNota] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  

  return (
    <main className="mapa-page-bg">
      <BotonVolver className="btn-volver" onClick={() => navigate(-1)} />

      <BotonAyuda onClick={() => setShowHelpModal(true)} />

      <button
        className="btn-ajustes"
        onClick={() => navigate('/ajustes')}
        title="Ajustes"
      >
        <IoSettingsSharp className="ajustes-icono" />
      </button>

      <ModalAyuda 
        isOpen={showHelpModal} 
        onClose={() => setShowHelpModal(false)} 
        title="Cómo usar el mapa"
      >
        <p>En el mapa están marcadas las ubicaciones de diferentes fósiles de grandes mamíferos descubiertos en la ciudad de La Plata. ¡Hacé clic en los puntos para obtener más información y comenzar la excavación para luego agregarlos a tu colección!</p>

      </ModalAyuda>

      <h1 className="mapa-titulo">Expedición: La Plata</h1>

      <section className="mapa-panel" aria-label="Mapa de excavación">
        <div className="mapa-frame">
          <MapContainer
            center={coordenadaPin}
            zoom={16}
            className="leaflet-map-container"
            zoomControl={false}
            scrollWheelZoom={false}
            attributionControl={false}
          >
            <ControlMapa />
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="map-tiles-vintage"
            />

            <ZoomControl position="bottomright" />

            <Marker position={coordenadaPin}>
              <Popup>
                <h1> Gliptodonte </h1>
                <img
                  src={fosilImg}
                  alt="Fósil de Gliptodonte"
                  className="popup-fosil-img"
                />
                <p>Se notifico un posible hallazgo de fósil de un gliptodonte en esta ubicación. Realizá la excavación para encontrarlo!</p>
                <button
                  className="popup-btn-excavar"
                  onClick={() => navigate('/excavacion')}
                >
                  Excavar
                </button>
                <br />
              </Popup>
            </Marker>
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