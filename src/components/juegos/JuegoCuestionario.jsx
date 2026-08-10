import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import ModalAyuda from '../ModalAyuda';
import { guardarJuegoCompletado } from '../../utils/progreso';
import '../../pages/Coleccion.css';

function JuegoCuestionario({ contenido, juegoId, slugId }) {
  // Estado para guardar las respuestas. 
  // Se verá así: { "q1": "camion", "q2": "armadillo" }
  const [respuestas, setRespuestas] = useState({});
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  const preguntas = Array.isArray(contenido?.preguntas)
    ? contenido.preguntas
    : Array.isArray(contenido?.contenido?.preguntas)
      ? contenido.contenido.preguntas
      : [];

  // Función para manejar el clic en una opción
  const handleOpcionClick = (idPregunta, idOpcion) => {
    setRespuestas(prev => ({
      ...prev,
      [idPregunta]: idOpcion
    }));
  };

  // Efecto para verificar si YA contestó TODAS las preguntas correctamente
  useEffect(() => {
    if (!contenido || preguntas.length === 0 || juegoTerminado) return;

    // .every() verifica que TODAS las preguntas cumplan la condición
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
        <p>¡Bien hecho! Has recuperado la información perdida del cuaderno</p>
      </ModalAyuda>

        <div className="cuaderno-contenedor">
        
        {/* Usamos .map() para iterar sobre el array de preguntas */}
        {preguntas.map((item, index) => {
          
          // Variables auxiliares para saber el estado de esta pregunta en particular
          const respuestaUsuario = respuestas[item.id];
          const estaContestada = respuestaUsuario !== undefined;
          const esCorrecta = respuestaUsuario === item.correcta;

          return (
            <section key={item.id} className="pagina-hoja">
              <h2>Pregunta {index + 1}</h2>
              <p>{item.pregunta}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {/* Iteramos sobre las opciones de ESTA pregunta */}
                {item.opciones.map((opcion) => {
                  
                  // Lógica visual dinámica
                  const estaSeleccionada = respuestaUsuario === opcion.id;
                  let backgroundColor = '#4e342e'; // Color por defecto
                  
                  if (esCorrecta && opcion.id === item.correcta) {
                    backgroundColor = '#689f38'; // Verde si ya acertó y es la correcta
                  }

                  return (
                    <button 
                      key={opcion.id}
                      className="btn-popup-accion btn-popup-marron"
                      style={{ 
                        backgroundColor,
                        opacity: estaContestada && !estaSeleccionada && !esCorrecta ? 0.6 : 1,
                        cursor: esCorrecta ? 'not-allowed' : 'pointer' 
                      }}
                      onClick={() => handleOpcionClick(item.id, opcion.id)}
                      disabled={esCorrecta} // Bloquea los botones si ya acertó esta pregunta
                    >
                      {opcion.texto}
                    </button>
                  );
                })}
              </div>

              {/* Mensajes de feedback dinámicos */}
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