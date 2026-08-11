import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaUndo } from 'react-icons/fa';
import ModalAyuda from '../ModalAyuda';
import { guardarJuegoCompletado } from '../../utils/progreso';
import '../../pages/Coleccion.css';
import './JuegoAhorcado.css';

const ALFABETO = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

const normalizarCaracter = (char) => {
    return String(char || '')
        .normalize('NFD')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();
};

// Función para desempaquetar el JSONB de Supabase sin importar cómo venga envuelto
const obtenerConfiguracion = (raw) => {
    if (!raw) return {};

    let datos = raw;
    
    // Si viene como string, lo parseamos
    if (typeof raw === 'string') {
        try {
            datos = JSON.parse(raw);
        } catch (e) {
            console.error('Error parseando JSON de contenido:', e);
            return {};
        }
    }

    // Si viene la fila entera de la BD ({ id, tipo, contenido: { ... } }) o anidado
    const config = datos.contenido ? (typeof datos.contenido === 'string' ? JSON.parse(datos.contenido) : datos.contenido) : datos;

    return {
        palabra: config?.palabra || config?.palabraOriginal || datos?.palabra || '',
        pregunta: config?.pregunta || datos?.pregunta || 'Ahorcado paleontológico',
        pista: config?.pista || datos?.pista || '',
        intentosMaximos: config?.intentosMaximos || datos?.intentosMaximos || 6,
        mensajeExito: config?.mensajeExito || datos?.mensajeExito || '¡Excelente! Has recuperado la información perdida.',
        mensajeError: config?.mensajeError || datos?.mensajeError || '❌ ¡Has agotado tus intentos!'
    };
};

// Componente visual para mostrar el progreso del ahorcado mediante SVG
const DibujoAhorcado = ({ errores }) => {
    return (
        <div className="ahorcado-dibujo-contenedor">
            <svg height="160" width="140" viewBox="0 0 140 160" className="ahorcado-svg">
                {/* Estructura de la horca */}
                <line x1="10" y1="150" x2="130" y2="150" stroke="#5c3d2e" strokeWidth="4" strokeLinecap="round" />
                <line x1="30" y1="150" x2="30" y2="20" stroke="#5c3d2e" strokeWidth="4" strokeLinecap="round" />
                <line x1="30" y1="20" x2="90" y2="20" stroke="#5c3d2e" strokeWidth="4" strokeLinecap="round" />
                <line x1="90" y1="20" x2="90" y2="40" stroke="#8b5a2b" strokeWidth="3" strokeLinecap="round" />

                {/* Partes del cuerpo según la cantidad de errores */}
                {errores >= 1 && <circle cx="90" cy="52" r="12" stroke="#333" strokeWidth="3" fill="none" />}
                {errores >= 2 && <line x1="90" y1="64" x2="90" y2="100" stroke="#333" strokeWidth="3" strokeLinecap="round" />}
                {errores >= 3 && <line x1="90" y1="75" x2="70" y2="90" stroke="#333" strokeWidth="3" strokeLinecap="round" />}
                {errores >= 4 && <line x1="90" y1="75" x2="110" y2="90" stroke="#333" strokeWidth="3" strokeLinecap="round" />}
                {errores >= 5 && <line x1="90" y1="100" x2="75" y2="130" stroke="#333" strokeWidth="3" strokeLinecap="round" />}
                {errores >= 6 && <line x1="90" y1="100" x2="105" y2="130" stroke="#333" strokeWidth="3" strokeLinecap="round" />}
            </svg>
        </div>
    );
};

function JuegoAhorcado({ contenido, slugId }) {
    const navigate = useNavigate();
    const [letrasIntentadas, setLetrasIntentadas] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    const config = useMemo(() => obtenerConfiguracion(contenido), [contenido]);

    const palabraOriginal = config.palabra;
    const palabraNormalizada = useMemo(
        () => palabraOriginal.split('').map((char) => normalizarCaracter(char)).join(''),
        [palabraOriginal]
    );

    const letrasObjetivo = useMemo(() => {
        return new Set(
            palabraNormalizada
                .split('')
                .filter((char) => /[A-ZÑ]/.test(char))
        );
    }, [palabraNormalizada]);

    const errores = useMemo(() => {
        return letrasIntentadas.filter((letra) => !letrasObjetivo.has(letra)).length;
    }, [letrasIntentadas, letrasObjetivo]);

    const gano = letrasObjetivo.size > 0 && [...letrasObjetivo].every((letra) => letrasIntentadas.includes(letra));
    const perdio = errores >= config.intentosMaximos;
    const bloqueado = gano || perdio;

    useEffect(() => {
        if (!gano) return;

        setMostrarModal(true);
        if (slugId) {
            guardarJuegoCompletado(slugId);
        }
    }, [gano, slugId]);

    const cerrarModal = () => {
        setMostrarModal(false);

        if (slugId) {
            navigate(`/detalle/${slugId}`, { replace: true });
            return;
        }

        navigate(-1);
    };

    const reiniciarJuego = () => {
        setLetrasIntentadas([]);
    };

    const intentarLetra = (letra) => {
        if (bloqueado || letrasIntentadas.includes(letra)) return;

        setLetrasIntentadas((prev) => [...prev, letra]);
    };

    if (!palabraOriginal) {
        return (
            <div className="cuaderno-contenedor">
                <section className="pagina-hoja">
                    <h2>Juego no disponible</h2>
                    <p>No hay palabra configurada para este juego.</p>
                </section>
            </div>
        );
    }

    return (
        <>
            <ModalAyuda isOpen={mostrarModal} onClose={cerrarModal} title="¡Bien hecho!">
                <p>Has recuperado la información perdida del cuaderno.</p>
            </ModalAyuda>

            <div className="cuaderno-contenedor">
                <section className="pagina-hoja ahorcado-pagina">
                    {/* Pregunta o título traído del JSONB */}
                    <h2 className="ahorcado-titulo">{config.pregunta}</h2>

                    {/* Ilustración de progreso */}
                    <DibujoAhorcado errores={errores} />

                    {config.pista && (
                        <p className="ahorcado-pista">
                            <strong>Pista:</strong> {config.pista}
                        </p>
                    )}

                    {/* Palabra a adivinar */}
                    <div className="ahorcado-palabra" aria-label="Palabra oculta">
                        {palabraOriginal.split('').map((char, index) => {
                            const charNormalizado = normalizarCaracter(char);
                            const esLetra = /[A-ZÑ]/.test(charNormalizado);
                            const visible = !esLetra || letrasIntentadas.includes(charNormalizado);

                            return (
                                <span
                                    key={`${char}-${index}`}
                                    className={`ahorcado-letra ${!esLetra ? 'ahorcado-letra-separador' : ''}`}
                                >
                                    {visible ? char.toUpperCase() : '_'}
                                </span>
                            );
                        })}
                    </div>

                    {/* Contador de errores */}
                    <p className="ahorcado-contador">
                        Errores: {errores} / {config.intentosMaximos}
                    </p>

                    {/* Teclado */}
                    <div className="ahorcado-teclado" role="group" aria-label="Teclado del ahorcado">
                        {ALFABETO.map((letra) => {
                            const usada = letrasIntentadas.includes(letra);
                            const acerto = usada && letrasObjetivo.has(letra);

                            return (
                                <button
                                    key={letra}
                                    type="button"
                                    className={`btn-popup-accion ahorcado-tecla ${acerto ? 'ahorcado-tecla-ok' : ''}`}
                                    onClick={() => intentarLetra(letra)}
                                    disabled={bloqueado || usada}
                                >
                                    {letra}
                                </button>
                            );
                        })}
                    </div>

                    {/* Alertas */}
                    {gano && (
                        <div role="alert" className="alerta-exito">
                            <FaCheckCircle size={20} /> {config.mensajeExito}
                        </div>
                    )}

                    {perdio && (
                        <div role="alert" className="alerta-error">
                            {config.mensajeError}
                        </div>
                    )}

                    {perdio && (
                        <button
                            type="button"
                            className="btn-popup-accion btn-popup-marron ahorcado-reintentar"
                            onClick={reiniciarJuego}
                        >
                            <FaUndo /> Reintentar
                        </button>
                    )}
                </section>
            </div>
        </>
    );
}

export default JuegoAhorcado;