// src/pages/JuegoGliptodonte.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaBookOpen } from 'react-icons/fa';
import './Coleccion.css';
import TransicionHoja from '../components/TransicionCuaderno';

function JuegoGliptodonte() {
    const navigate = useNavigate();
    const [mostrarPopup, setMostrarPopup] = useState(false);

    const [respuestaTrivia1, setRespuestaTrivia1] = useState(null);
    const [respuestaTrivia2, setRespuestaTrivia2] = useState(null);
    const [mostrarAvisoGanador, setMostrarAvisoGanador] = useState(false);

    useEffect(() => {
        const yaVisto = localStorage.getItem('popupJuegoVisto');
        if (!yaVisto) {
            setMostrarPopup(true);
        }
    }, []);

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

    // Efecto para detectar cuando AMBAS trivias están correctas
    useEffect(() => {
        if (trivia1Completada && trivia2Completada) {
            localStorage.setItem('triviaGliptodonteCompletada', 'true');
            // Delay de 800ms para feedback visual antes del aviso
            const timer = setTimeout(() => {
                setMostrarAvisoGanador(true);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [trivia1Completada, trivia2Completada]);

    return (
    <div className="escenario-coleccion">

      <button className="btn-volver-top" onClick={() => navigate('/detalle-gliptodonte')}>
        <FaArrowLeft /> Volver
      </button>

      <TransicionHoja>
        <div className="cuaderno-contenedor">

          {/* ================= HOJA IZQUIERDA: TRIVIA 1 ================= */}
          <div className="pagina-hoja" style={{ gap: '15px', justifyContent: 'center', alignItems: 'stretch' }}>
            <h2 className="titulo-seccion" style={{ fontSize: '1.8rem', margin: '0 0 10px 0' }}>
              Pregunta 1
            </h2>
            <p className="texto-descripcion-derecha" style={{ maxWidth: '100%', textAlign: 'left', fontWeight: 'bold', margin: '0' }}>
              ¿Cuál era más grande?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              <button 
                className="btn-popup-accion btn-popup-marron"
                style={{ 
                  maxWidth: '100%', 
                  textAlign: 'left', 
                  opacity: respuestaTrivia1 === 'camion' ? 0.6 : 1,
                  cursor: trivia1Completada ? 'not-allowed' : 'pointer' 
                }}
                onClick={() => handleTrivia1('camion')}
                disabled={trivia1Completada}
              >
                Un camión
              </button>
              
              <button 
                className="btn-popup-accion btn-popup-marron"
                style={{ 
                  maxWidth: '100%', 
                  textAlign: 'left', 
                  backgroundColor: trivia1Completada ? '#689f38' : '#4e342e' 
                }}
                onClick={() => handleTrivia1('gliptodonte')}
                disabled={trivia1Completada}
              >
                Un Gliptodonte
              </button>
            </div>

            {respuestaTrivia1 === 'camion' && (
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ffe9e9', border: '2px solid #d32f2f', borderRadius: '8px', color: '#c62828', fontWeight: 'bold' }}>
                ❌ ¡Ups! Inténtalo de nuevo, ¡el Gliptodonte era una criatura gigantesca!
              </div>
            )}

            {trivia1Completada && (
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', border: '2px solid #2e7d32', borderRadius: '8px', color: '#1b5e20', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaCheckCircle size={20} /> ¡Excelente! El Gliptodonte medía casi lo mismo que un automóvil pequeño y pesaba toneladas.
              </div>
            )}
          </div>

          {/* ANILLADO CENTRAL */}
          <div className="anillado-espiral">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="anillo"></div>
            ))}
          </div>

          {/* ================= HOJA DERECHA: TRIVIA 2 ================= */}
          <div className="pagina-hoja hoja-derecha" style={{ gap: '15px', justifyContent: 'center', alignItems: 'stretch', textAlign: 'left' }}>
            <h2 className="titulo-seccion" style={{ fontSize: '1.8rem', margin: '0 0 10px 0', textAlign: 'left' }}>
              Pregunta 2
            </h2>
            <p className="texto-descripcion-derecha" style={{ maxWidth: '100%', fontWeight: 'bold', margin: '0' }}>
              Escribe aquí tu pregunta de opción múltiple...
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <button 
                className="btn-popup-accion btn-popup-marron"
                style={{ maxWidth: '100%', backgroundColor: trivia2Completada ? '#689f38' : '#4e342e' }}
                onClick={() => handleTrivia2('opcionA')}
                disabled={trivia2Completada}
              >
                Opción A (Correcta de ejemplo)
              </button>

              <button 
                className="btn-popup-accion btn-popup-marron"
                style={{ 
                  maxWidth: '100%', 
                  opacity: respuestaTrivia2 === 'opcionB' ? 0.6 : 1,
                  cursor: trivia2Completada ? 'not-allowed' : 'pointer' 
                }}
                onClick={() => handleTrivia2('opcionB')}
                disabled={trivia2Completada}
              >
                Opción B
              </button>

              <button 
                className="btn-popup-accion btn-popup-marron"
                style={{ 
                  maxWidth: '100%', 
                  opacity: respuestaTrivia2 === 'opcionC' ? 0.6 : 1,
                  cursor: trivia2Completada ? 'not-allowed' : 'pointer' 
                }}
                onClick={() => handleTrivia2('opcionC')}
                disabled={trivia2Completada}
              >
                Opción C
              </button>

              <button 
                className="btn-popup-accion btn-popup-marron"
                style={{ 
                  maxWidth: '100%', 
                  opacity: respuestaTrivia2 === 'opcionD' ? 0.6 : 1,
                  cursor: trivia2Completada ? 'not-allowed' : 'pointer' 
                }}
                onClick={() => handleTrivia2('opcionD')}
                disabled={trivia2Completada}
              >
                Opción D
              </button>
            </div>

            {respuestaTrivia2 && !trivia2Completada && (
              <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#ffe9e9', border: '2px solid #d32f2f', borderRadius: '8px', color: '#c62828', fontWeight: 'bold' }}>
                ❌ Esta opción no es correcta. ¡Sigue investigando!
              </div>
            )}

            {trivia2Completada && (
              <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#e8f5e9', border: '2px solid #2e7d32', borderRadius: '8px', color: '#1b5e20', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaCheckCircle size={20} /> ¡Respuesta correcta! Has recuperado otra anotación para el cuaderno de Kira.
              </div>
            )}
          </div>

        </div>
      </TransicionHoja>

      {/* 🏆 POP-UP GANADOR: Reubicado al nivel del DOM global para un centrado absoluto perfecto */}
      {mostrarAvisoGanador && (
        <div className="aviso-overlay">
          <div className="aviso-modal-popup" style={{ maxWidth: '450px', textAlign: 'center' }}>
            <FaBookOpen size={55} color="#689f38" style={{ marginBottom: '15px' }} />
            <h3 className="titulo-subseccion" style={{ fontSize: '1.6rem', margin: '0 0 10px 0', color: '#2e7d32', fontFamily: 'Arial, sans-serif' }}>
              ¡Logro Desbloqueado!
            </h3>
            <p className="aviso-texto" style={{ fontSize: '1.2rem', marginBottom: '25px', color: '#3e2723' }}>
              ¡Increíble! Has completado todas las actividades correctamente. Las anotaciones del cuaderno de Kira han sido completamente restauradas.
            </p>
            <div className="aviso-botones-layout">
              <button 
                className="btn-popup-accion btn-popup-marron" 
                style={{ maxWidth: '100%', backgroundColor: '#689f38', color: '#fff' }}
                onClick={() => navigate('/detalle-gliptodonte')}
              >
                Regresar al Cuaderno
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POP-UP BIENVENIDA */}
      {mostrarPopup && (
          <div className="aviso-overlay">
          <div className="aviso-modal-popup">
              <p className="aviso-texto">
              ¡Bienvenido a la trivia! <br />
              Ayuda a Kira completando las actividades para recuperar las anotaciones de su cuaderno. ¿Estás listo?
              </p>
              <div className="aviso-botones-layout">
              <button className="btn-popup-accion btn-popup-marron" onClick={cerrarPopup}>
                  ¡Entendido!
              </button>
              </div>
          </div>
          </div>
      )}
        
    </div>
  );
}

export default JuegoGliptodonte;