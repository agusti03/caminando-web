import { useEffect, useMemo, useState } from 'react';
import { Marker, MapContainer, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaCheckCircle, FaCompass } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import BotonVolver from '../components/BotonVolver';
import BotonAyuda from '../components/BotonAyuda';
import ModalAyuda from '../components/ModalAyuda';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import { obtenerMamiferos } from '../services/mamiferosService';
import { getFosilesDescubiertos } from '../utils/progreso';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow
});

// 🟢 SVG codificado correctamente para compatibilidad total
const svgVerde = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="25" height="41"><path fill="#2e7d32" stroke="#1b5e20" stroke-width="1.5" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12zm0 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>`;

const iconoVerde = new L.Icon({
  iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgVerde)}`,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const coordenadaPin = [-34.903944444, -58.015777778];

const ControlMapa = ({ posiciones }) => {
  const map = useMap();

  useEffect(() => {
    if (!posiciones.length) {
      map.setView(coordenadaPin, 12);
      map.invalidateSize();
      return;
    }

    if (posiciones.length === 1) {
      map.setView(posiciones[0], 12);
      map.invalidateSize();
      return;
    }

    map.fitBounds(posiciones, {
      padding: [40, 40],
      maxZoom: 13,
    });
    map.invalidateSize();
  }, [map, posiciones]);

  return null;
};

function Mapa({ onBack }) {
  const navigate = useNavigate();
  const [mostrarNota, setMostrarNota] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [marcadoresMamiferos, setMarcadoresMamiferos] = useState([]);
  const [descubiertos, setDescubiertos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const posicionesMamiferos = useMemo(() => {
    return marcadoresMamiferos
      .filter((mamifero) => Number.isFinite(mamifero.latitud) && Number.isFinite(mamifero.longitud))
      .map((mamifero) => [mamifero.latitud, mamifero.longitud]);
  }, [marcadoresMamiferos]);

  useEffect(() => {
    setDescubiertos(getFosilesDescubiertos());

    const cargarDatos = async () => {
      setCargando(true);
      const datosMamiferos = await obtenerMamiferos();

      const mamiferosConJuego = (datosMamiferos || []).filter(
        (mamifero) => mamifero.juego_id !== null && mamifero.juego_id !== undefined
      );

      setMarcadoresMamiferos(mamiferosConJuego);
      setCargando(false);
    };

    cargarDatos();
  }, []);

  return (
    <main className="mapa-page-bg">
      <BotonVolver className="btn-volver" onClick={() => navigate(-1)} />

      <div className="mapa-acciones">
        <BotonAyuda onClick={() => setShowHelpModal(true)} />

        <button
          className="btn-ajustes"
          onClick={() => navigate('/ajustes')}
          title="Ajustes"
        >
          <IoSettingsSharp className="ajustes-icono" />
        </button>
      </div>

      <ModalAyuda 
        isOpen={showHelpModal} 
        onClose={() => setShowHelpModal(false)} 
        title="Cómo usar el mapa"
      >
        <p>
          En el mapa están marcadas las ubicaciones de diferentes fósiles de grandes mamíferos descubiertos en la ciudad de La Plata. ¡Hacé clic en los puntos para obtener más información y comenzar la excavación para luego agregarlos a tu colección!
        </p>
      </ModalAyuda>

      <h1 className="mapa-titulo">Expedición: La Plata</h1>

      <section className="mapa-panel" aria-label="Mapa de excavación">
        <div className="mapa-frame">
          <MapContainer
            center={coordenadaPin}
            zoom={12}
            className="leaflet-map-container"
            zoomControl={false}
            scrollWheelZoom={false}
            attributionControl={false}
          >
            <ControlMapa posiciones={posicionesMamiferos} />
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="map-tiles-vintage"
            />

            <ZoomControl position="bottomright" />

            {!cargando && marcadoresMamiferos.map((mamifero) => {
              const esDescubierto = descubiertos.includes(mamifero.slug);

              return (
                <Marker 
                  key={`${mamifero.id}-${esDescubierto}`} 
                  position={[mamifero.latitud, mamifero.longitud]}
                  icon={esDescubierto ? iconoVerde : new L.Icon.Default()}
                >
                  <Popup>
                    <h1>{mamifero.nombre}</h1>

                    {esDescubierto && (
                      <span style={{ color: '#2e7d32', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>
                        <FaCheckCircle /> Fósil descubierto
                      </span>
                    )}

                    <p>{mamifero.descripcion}</p>
                    <button
                      className="popup-btn-excavar"
                      onClick={() => navigate(`/excavacion/${mamifero.slug}`)}
                    >
                      {esDescubierto ? 'Volver a excavar' : 'Excavar'}
                    </button>
                  </Popup>
                </Marker>
              );
            })}
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
}

export default Mapa;