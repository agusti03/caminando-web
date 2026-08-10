import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import ModalAyuda from '../ModalAyuda';
import { guardarJuegoCompletado } from '../../utils/progreso';
import { supabase } from '../../config/supabaseClient';
import '../../pages/Coleccion.css';
import './JuegoCuestionario.css';

const obtenerUrlImagenPregunta = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;

  // Evitamos duplicar "juegos/" si en el JSON ya lo tenías escrito así
  const rutaLimpia = path.startsWith('juegos/') ? path : `juegos/${path}`;

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(rutaLimpia);

  return data?.publicUrl || null;
};

function JuegoCuestionario({ contenido, juegoId, slugId }) {
  const [respuestas, setRespuestas] = useState({});
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  const preguntas = Array.isArray(contenido?.preguntas)
    ? contenido.preguntas
    : Array.isArray(contenido?.contenido?.preguntas)
      ? contenido.contenido.preguntas
      : [];

  const handleOpcionClick = (idPregunta, idOpcion) => {
    setRespuestas(prev => ({
      ...prev,
      [idPregunta]: idOpcion
    }));
  };

  useEffect(() => {
    if (!contenido || preguntas.length === 0 || juegoTerminado) return;

    const todasCorrectas = preguntas.every((preg) => 
      respuestas[preg.id] === preg.correcta
    );

    if (todasCorrectas && preguntas.length > 0) {
      setJuegoTerminado(true);
      setMostrarModal(true);

      if (slugId) {
        guardarJuegoCompletado(slugId);
      }
    }
  }, [respuestas, contenido, preguntas, juegoTerminado, slugId]);

  const cerrarModal = () => {
    setMostrarModal(false);

    if (slugId) {
      navigate(`/detalle/${slugId}`, { replace: true });
    } else {
      navigate(-1);
    }
  };

  if (!contenido || preguntas.length === 0) {
    return (
      <div className="cuaderno-contenedor">
        <section className="pagina-hoja">
          <h2>Juego no disponible</h2>
          <p>No hay preguntas configuradas para este juego.</p>
        </section>
      </div>
    );
  }

  return (
    <>
      <ModalAyuda
        isOpen={mostrarModal}
        onClose={cerrarModal}
        title="¡Bien hecho!"
      >
        <p>Has recuperado la información perdida del cuaderno.</p>
      </ModalAyuda>

      <div className="cuaderno-contenedor">
        {preguntas.map((item, index) => {
          const respuestaUsuario = respuestas[item.id];
          const estaContestada = respuestaUsuario !== undefined;
          const esCorrecta = respuestaUsuario === item.correcta;
          const urlImagen = item.imagen_path ? obtenerUrlImagenPregunta(item.imagen_path) : null;

          return (
            <section key={item.id} className="pagina-hoja cuestionario-pagina">

              <p className="cuestionario-pregunta">{item.pregunta}</p>
              
              {/* 🖼️ Solo se muestra la imagen si urlImagen NO es null */}
              {urlImagen && (
                <div className="contenedor-imagen-pregunta">
                  <img 
                    src={urlImagen} 
                    alt={`Ilustración para la pregunta ${index + 1}`}
                    className="imagen-pregunta"
                    onError={(e) => {
                      // Si falla la carga por algún motivo, oculta la etiqueta para que no muestre un icono roto
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}


              <div className="cuestionario-opciones">
                {item.opciones.map((opcion) => {
                  const estaSeleccionada = respuestaUsuario === opcion.id;
                  let backgroundColor = '#4e342e';
                  
                  if (esCorrecta && opcion.id === item.correcta) {
                    backgroundColor = '#689f38';
                  }

                  return (
                    <button 
                      key={opcion.id}
                      className="btn-popup-accion btn-popup-marron cuestionario-opcion"
                      style={{ 
                        backgroundColor,
                        opacity: estaContestada && !estaSeleccionada && !esCorrecta ? 0.6 : 1,
                        cursor: esCorrecta ? 'not-allowed' : 'pointer' 
                      }}
                      onClick={() => handleOpcionClick(item.id, opcion.id)}
                      disabled={esCorrecta}
                    >
                      {opcion.texto}
                    </button>
                  );
                })}
              </div>

              {estaContestada && !esCorrecta && (
                <div role="alert" className="alerta-error">
                  {item.mensaje_error}
                </div>
              )}

              {esCorrecta && (
                <div role="alert" className="alerta-exito">
                  <FaCheckCircle size={20} /> {item.mensaje_exito}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}

export default JuegoCuestionario;