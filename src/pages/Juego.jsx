import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import JuegoCuestionario from '../components/juegos/JuegoCuestionario';
import BotonVolver from '../components/BotonVolver';
import './Coleccion.css';

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
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Cargando juego...</div>;
  }

  if (!juegoData) {
    return (
      <main className="escenario-coleccion">
        <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
          <p>No hay juego disponible para este animal.</p>
          <button onClick={() => navigate(-1)}>Volver</button>
        </div>
      </main>
    );
  }

  return (
    <main className="escenario-coleccion">
      <BotonVolver className="btn-volver" onClick={() => navigate(-1)} aria-label="Volver" tabIndex={0} />
      <JuegoCuestionario contenido={juegoData} juegoId={Number(juegoId)} slugId={slugId} />
    </main>
  );
}

export default Juego;