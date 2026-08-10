import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import JuegoCuestionario from '../components/juegos/JuegoCuestionario';
import JuegoAhorcado from '../components/juegos/JuegoAhorcado';
import BotonVolver from '../components/BotonVolver';
import './Coleccion.css';
import './Juego.css';

function Juego() {
  const { juegoId, slugId } = useParams(); // Captura el "1" de /juego/1 y el slug del animal
  const navigate = useNavigate();
  const [juegoData, setJuegoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJuego() {
      if (!juegoId) {
        setLoading(false);
        return;
      }

      const juegoIdNumerico = Number(juegoId);

      if (Number.isNaN(juegoIdNumerico)) {
        setLoading(false);
        return;
      }

      // Buscamos en tu tabla de juegos el registro que coincide con el ID
      const { data, error } = await supabase
        .from('juegos') // Cambia 'juegos' por el nombre real de tu tabla en Supabase
        .select('*')
        .eq('id', juegoIdNumerico)
        .single();

      if (!error && data) {
        setJuegoData(data);
      }
      setLoading(false);
    }

    fetchJuego();
  }, [juegoId]);

  if (loading) {
    return (
      <main className="escenario-coleccion juego-estado-page" aria-live="polite">
        <section className="juego-estado-card" aria-label="Cargando juego">
          <div className="juego-loader" aria-hidden="true" />
          <h2 className="juego-estado-titulo">Preparando la excavacion</h2>
          <p className="juego-estado-texto">Estamos cargando el juego para que puedas continuar la aventura.</p>
        </section>
      </main>
    );
  }

  if (!juegoData) {
    return (
      <main className="escenario-coleccion juego-estado-page">
        <section className="juego-estado-card" aria-label="Juego no disponible">
          <h2 className="juego-estado-titulo">Juego no disponible</h2>
          <p className="juego-estado-texto">No encontramos un juego para este fosil todavia.</p>
          <button className="btn-popup-accion btn-popup-marron juego-estado-accion" onClick={() => navigate(-1)}>
            Volver
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="escenario-coleccion">
      <BotonVolver className="btn-volver" onClick={() => navigate(-1)} aria-label="Volver" tabIndex={0} />
      {juegoData.tipo === 'ahorcado' && (
        <JuegoAhorcado contenido={juegoData} juegoId={Number(juegoId)} slugId={slugId} />
      )}
      {juegoData.tipo === 'cuestionario' && (
        <JuegoCuestionario contenido={juegoData} juegoId={Number(juegoId)} slugId={slugId} />
      )}
    </main>
  );
}

export default Juego;