import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import JuegoCuestionario from '../components/juegos/JuegoCuestionario';
import BotonVolver from '../components/BotonVolver';

function Juego() {
  const { id } = useParams(); // Captura el "1" de /juego/1
  const navigate = useNavigate();
  const [juegoData, setJuegoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJuego() {
      // Buscamos en tu tabla de juegos el registro que coincide con el ID
      const { data, error } = await supabase
        .from('juegos') // Cambia 'juegos' por el nombre real de tu tabla en Supabase
        .select('*')
        .eq('id', Number(id))
        .single();

      if (!error && data) {
        setJuegoData(data);
      }
      setLoading(false);
    }

    fetchJuego();
  }, [id]);

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Cargando juego...</div>;
  }

  if (!juegoData) {
    return (
      <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
        <p>No hay juego disponible para este animal.</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  return <JuegoCuestionario contenido={juegoData} />;
}

export default Juego;