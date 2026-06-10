// src/pages/JuegoGliptodonte.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { FaCheckCircle, FaBookOpen } from 'react-icons/fa';

// CSS
import './Coleccion.css';

// Componentes
import TransicionHoja from '../components/TransicionCuaderno';
import BotonVolver from '../components/BotonVolver';

// Imagenes
import gliptodonteImg from '../assets/detalle-gliptodonte-gliptodonte.png'
import camionImg from '../assets/camion-de-basura.png'

function JuegoGliptodonte() {
    const navigate = useNavigate();
    const [mostrarPopup, setMostrarPopup] = useState(false);

    const [respuestaTrivia1, setRespuestaTrivia1] = useState(null);
    const [respuestaTrivia2, setRespuestaTrivia2] = useState(null);
    const [mostrarAvisoGanador, setMostrarAvisoGanador] = useState(false);

    // Refs para atrapar el foco en los modales
    const botonPopupBienvenidaRef = useRef(null);
    const botonPopupGanadorRef = useRef(null);

    useEffect(() => {
        const yaVisto = localStorage.getItem('popupJuegoVisto');
        if (!yaVisto) {
            setMostrarPopup(true);
        }
    }, []);

    // Regresar el foco al botón del popup de bienvenida apenas se monta
    useEffect(() => {
        if (mostrarPopup && botonPopupBienvenidaRef.current) {
            botonPopupBienvenidaRef.current.focus();
        }
    }, [mostrarPopup]);

    // Mover el foco al modal ganador en cuanto aparece
    useEffect(() => {
        if (mostrarAvisoGanador && botonPopupGanadorRef.current) {
            botonPopupGanadorRef.current.focus();
        }
    }, [mostrarAvisoGanador]);

    const cerrarPopup = () => {
        localStorage.setItem('popupJuegoVisto', 'true');
        setMostrarPopup(false);
    };

    const handleTrivia1 = (opcion) => {
        setRespuestaTrivia1(opcion);
    };

    const handleTrivia2 = (opcion) => {
        setRespuestaTrivia2(opcion);
    };

    const trivia1Completada = respuestaTrivia1 === 'gliptodonte';
    const trivia2Completada = respuestaTrivia2 === 'opcionA';

    useEffect(() => {
        if (trivia1Completada && trivia2Completada) {
            localStorage.setItem('triviaGliptodonteCompletada', 'true');
            const timer = setTimeout(() => {
                setMostrarAvisoGanador(true);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [trivia1Completada, trivia2Completada]);

    return (
    <main className="escenario-coleccion" aria-label="Juego de trivia del Gliptodonte">

      {/* Botón de volver accesible con tabulador */}
      <BotonVolver 
        className="btn-volver" 
        onClick={() => navigate(-1)} 
        aria-label="Volver al detalle del fósil"
        tabIndex={0}
      />

      <TransicionHoja>
        <div className="cuaderno-contenedor" style={{ position: 'relative' }}>

          {/* ================= HOJA IZQUIERDA: TRIVIA 1 ================= */}
          <section 
            className="pagina-hoja" 
            style={{ gap: '15px', justifyContent: 'center', alignItems: 'stretch' }}
            aria-label="Pregunta 1 de la trivia"
          >
            {/* El título y la pregunta ahora son alcanzables para lectura previa a los botones */}
            <h2 className="titulo-seccion" style={{ fontSize: '1.8rem', margin: '0 0 10px 0' }} tabIndex={0}>
              Pregunta 1
            </h2>

            <figure class="contenedor-imagenes">              
              <div class="grupo-flex">
                <img src={gliptodonteImg} alt="Ilustración de un gliptodonte" />
                <img src={camionImg} alt="Camión de basura" />
              </div>
            </figure>

            <p className="texto-descripcion-derecha" style={{ maxWidth: '100%', textAlign: 'left', fontFamily:"Nunito Sans", fontWeight: 'bold', margin: '0' }} tabIndex={0}>
              ¿Cuál era más grande?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              <button 
                className="btn-popup-accion btn-popup-marron"
                style={{ 
                  maxWidth: '100%', 
                  textAlign: 'left', 
                  fontFamily:"Nunito Sans",
                  opacity: respuestaTrivia1 === 'camion' ? 0.6 : 1,
                  cursor: trivia1Completada ? 'not-allowed' : 'pointer' 
                }}
                onClick={() => handleTrivia1('camion')}
                disabled={trivia1Completada}
                aria-label="Opción: Un camión"
              >
                Un camión
              </button>
              
              <button 
                className="btn-popup-accion btn-popup-marron"
                style={{ 
                  maxWidth: '100%', 
                  textAlign: 'left', 
                  fontFamily:"Nunito Sans",
                  backgroundColor: trivia1Completada ? '#689f38' : '#4e342e' 
                }}
                onClick={() => handleTrivia1('gliptodonte')}
                disabled={trivia1Completada}
                aria-label="Opción: Un Gliptodonte"
              >
                Un Gliptodonte
              </button>
            </div>

            {/* role="alert" hace que el lector de pantalla interrumpa y lea el error inmediatamente */}
            {respuestaTrivia1 === 'camion' && (
              <div 
                role="alert" 
                style={{ marginTop: '20px', padding: '15px', fontFamily:"Nunito Sans" ,backgroundColor: '#ffe9e9', border: '2px solid #d32f2f', borderRadius: '8px', color: '#c62828', fontWeight: 'bold' }}
              >
                ❌ ¡Ups! Inténtalo de nuevo, ¡el Gliptodonte era una criatura gigantesca!
              </div>
            )}

            {/* role="alert" anuncia el éxito inmediatamente al pulsar la respuesta correcta */}
            {trivia1Completada && (
              <div 
                role="alert" 
                style={{ marginTop: '20px', padding: '15px', fontFamily:"Nunito Sans" ,backgroundColor: '#e8f5e9', border: '2px solid #2e7d32', borderRadius: '8px', color: '#1b5e20', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <FaCheckCircle size={20} aria-hidden="true" /> ¡Excelente! El Gliptodonte medía casi lo mismo que un automóvil pequeño y pesaba toneladas.
              </div>
            )}
          </section>

          {/* ANILLADO CENTRAL */}
          <div className="anillado-espiral" aria-hidden="true">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="anillo"></div>
            ))}
          </div>

          {/* ================= HOJA DERECHA: TRIVIA 2 ================= */}
          <section 
            className="pagina-hoja hoja-derecha" 
            style={{ gap: '15px', justifyContent: 'center', alignItems: 'stretch', textAlign: 'left' }}
            aria-label="Pregunta 2 de la trivia"
          >
            <h2 className="titulo-seccion" style={{ fontSize: '1.8rem', margin: '0 0 10px 0', textAlign: 'center' }} tabIndex={0}>
              Pregunta 2
            </h2>
            <p className="texto-descripcion-derecha" style={{ maxWidth: '100%', fontFamily:"Nunito Sans" ,fontWeight: 'bold', margin: '0' }} tabIndex={0}>
              ¿Cuál es el animál más familiar al Gliptodonte?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <button 
                className="btn-popup-accion btn-popup-marron"
                style={{ maxWidth: '100%', fontFamily:"Nunito Sans" ,backgroundColor: trivia2Completada ? '#689f38' : '#4e342e' }}
                onClick={() => handleTrivia2('opcionA')}
                disabled={trivia2Completada}
                aria-label="Opción A (Correcta de ejemplo)"
              >
                Armadillo
              </button>

              <button 
                className="btn-popup-accion btn-popup-marron"
                style={{ 
                  maxWidth: '100%', 
                  opacity: respuestaTrivia2 === 'opcionB' ? 0.6 : 1,
                  cursor: trivia2Completada ? 'not-allowed' : 'pointer', 
                  fontFamily:"Nunito Sans"
                }}
                onClick={() => handleTrivia2('opcionB')}
                disabled={trivia2Completada}
                aria-label="Opción B"
              >
                Carpincho
              </button>

              <button 
                className="btn-popup-accion btn-popup-marron"
                style={{ 
                  maxWidth: '100%', 
                  opacity: respuestaTrivia2 === 'opcionC' ? 0.6 : 1,
                  cursor: trivia2Completada ? 'not-allowed' : 'pointer',
                  fontFamily:"Nunito Sans"
                }}
                onClick={() => handleTrivia2('opcionC')}
                disabled={trivia2Completada}
                aria-label="Opción C"
              >
                Orangután
              </button>

              <button 
                className="btn-popup-accion btn-popup-marron"
                style={{ 
                  maxWidth: '100%', 
                  opacity: respuestaTrivia2 === 'opcionD' ? 0.6 : 1,
                  cursor: trivia2Completada ? 'not-allowed' : 'pointer',
                  fontFamily:"Nunito Sans"
                }}
                onClick={() => handleTrivia2('opcionD')}
                disabled={trivia2Completada}
                aria-label="Opción D"
              >
                Tortuga
              </button>
            </div>

            {respuestaTrivia2 && !trivia2Completada && (
              <div 
                role="alert"
                style={{ marginTop: '15px', padding: '12px', backgroundColor: '#ffe9e9', border: '2px solid #d32f2f', borderRadius: '8px', color: '#c62828', fontWeight: 'bold' }}
              >
                ❌ Esta opción no es correcta. ¡Sigue investigando!
              </div>
            )}

            {trivia2Completada && (
              <div 
                role="alert"
                style={{ marginTop: '15px', padding: '12px', backgroundColor: '#e8f5e9', border: '2px solid #2e7d32', borderRadius: '8px', color: '#1b5e20', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <FaCheckCircle size={20} aria-hidden="true" /> ¡Respuesta correcta! Has recuperado más anotaciones para el cuaderno de Kira.
              </div>
            )}
          </section>

        </div>
      </TransicionHoja>

      {/* 🏆 MODAL DE LOGRO - Corregido con roles semánticos de diálogo y foco forzado */}
      {mostrarAvisoGanador && createPortal(
        <div className="aviso-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-logro-titulo">
          <div className="aviso-modal-popup">
            <FaBookOpen size={50} color="#689f38" style={{ marginBottom: '15px' }} aria-hidden="true" />
            <h3 id="modal-logro-titulo" className="titulo-subseccion" style={{ margin: '0 0 10px 0', color: '#2e7d32' }} tabIndex={0}>
              ¡Logro Desbloqueado!
            </h3>
            <p className="aviso-texto" style={{ fontSize: '1.15rem', marginBottom: '25px', fontFamily:"Nunito Sans"}} tabIndex={0}>
              ¡Increíble! Has completado todas las actividades correctamente. Las anotaciones del cuaderno de Kira han sido recuperadas.
            </p>
            <button 
              ref={botonPopupGanadorRef} // Recibe el foco automáticamente al abrirse
              className="btn-popup-accion btn-popup-verde" 
              style={{ maxWidth: '100%', margin: '0 auto' }}
              onClick={() => navigate('/detalle-gliptodonte')}
            >
              Regresar al Cuaderno
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* POP-UP BIENVENIDA - Atrapado para el teclado y con lectura fluida */}
      {mostrarPopup && (
          <div className="aviso-overlay" role="dialog" aria-modal="true" aria-label="Bienvenida a la trivia">
          <div className="aviso-modal-popup">
              <p className="aviso-texto" tabIndex={0}>
              ¡Bienvenido a la trivia! <br />
              Ayuda a Kira completando las actividades para recuperar las anotaciones de su cuaderno. ¿Estás listo?
              </p>
              <div className="aviso-botones-layout">
              <button 
                ref={botonPopupBienvenidaRef} // Al cargar la página, el tabulador caerá directamente aquí
                className="btn-popup-accion btn-popup-marron" 
                onClick={cerrarPopup}
              >
                  ¡Entendido!
              </button>
              </div>
          </div>
          </div>
      )}
        
    </main>
  );
}

export default JuegoGliptodonte;