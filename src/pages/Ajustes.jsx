import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa';
import { useSettings } from '../contexts/SettingsContext';

// CSS
import './Ajustes.css'; // <--- Importamos tu CSS normal
import './Coleccion.css';

// Componentes

import BotonVolver from '../components/BotonVolver';

export default function Ajustes() {
    const navigate = useNavigate();
    const {
        altoContraste,
        setAltoContraste,
        tamanioTexto,
        setTamanioTexto,
        narracion,
        setNarracion,
        sonidos,
        setSonidos,
        vibracion,
        setVibracion,
    } = useSettings();

    // Estado local para persistir el Modo de Accesibilidad en Excavación en el navegador (localStorage)
    const [accesibilidadExcavacion, setAccesibilidadExcavacion] = useState(() => {
        const saved = localStorage.getItem('accesibilidadExcavacion');
        return saved === 'true'; // Convertimos el string de localStorage a booleano
    });

    const toggleAccesibilidad = () => {
        const newVal = !accesibilidadExcavacion;
        setAccesibilidadExcavacion(newVal);
        localStorage.setItem('accesibilidadExcavacion', newVal.toString());
    };

    return (
    <div className="ajustes-screen">

    <BotonVolver className="btn-volver" onClick={() => navigate(-1)}></BotonVolver>

    <h1 className="ajustes-titulo">Ajustes</h1>

    <div className="ajustes-container">
        
        {/* Modo de Accesibilidad en Excavación */}
        <section className="ajustes-seccion">
        <h2 className="seccion-titulo">Modo de Interacción</h2>
        <div className="ajustes-fila">
            <div className="opcion-izquierda">
            <span>🛠️</span> <span>Modo de Accesibilidad en Excavación</span>
            </div>

            <button onClick={toggleAccesibilidad} 
                    className={`switch-btn ${accesibilidadExcavacion ? 'activo' : 'inactivo'}`}
                    aria-label="Accesibilidad de excavación"
                    aria-checked={accesibilidadExcavacion}
                    role="switch"
            >
                <div className="switch-manejador"></div>
            </button>

        </div>

        </section>

        {/* 2. APOYO VISUAL */}
        <section className="ajustes-seccion">
        <h2 className="seccion-titulo">Apoyo Visual</h2>
        {/* Alto contraste */}
        <div className="ajustes-fila">
            <div className="opcion-izquierda">
            <span>👁️</span> <span>Alto contraste</span>
            </div>

            <button onClick={() => setAltoContraste(!altoContraste)}
                    className={`switch-btn ${altoContraste ? 'activo' : 'inactivo'}`}
                    aria-label="Configuración de contraste"
                    aria-checked={altoContraste}
                    role="switch"
            >
            <div className="switch-manejador"></div>
            </button>
        </div>

        {/* Tamaño de texto */}
        <div className="ajustes-fila">
            <div className="opcion-izquierda">
            <span>👁️</span> <span>Tamaño de texto</span>
            </div>
            <div className="tamanio-selector">
            <button 
                onClick={() => setTamanioTexto('small')}
                className={`tamanio-btn txt-sm ${tamanioTexto === 'small' ? 'activo' : 'inactivo'}`}
            >A</button>
            <button 
                onClick={() => setTamanioTexto('medium')}
                className={`tamanio-btn txt-md ${tamanioTexto === 'medium' ? 'activo' : 'inactivo'}`}
            >A</button>
            <button 
                onClick={() => setTamanioTexto('large')}
                className={`tamanio-btn txt-lg ${tamanioTexto === 'large' ? 'activo' : 'inactivo'}`}
            >A</button>
            </div>
        </div>
        </section>

        {/* 3. APOYO AUDITIVO */}
        <section className="ajustes-seccion">
        <h2 className="seccion-titulo">Apoyo Auditivo</h2>
        
        {/* Narración */}
        <div className="ajustes-fila">

            <div className="opcion-izquierda">
            <span>🔊</span> <span>Narración</span>
            </div>

            <button onClick={() => setNarracion(!narracion)}
                    className={`switch-btn ${narracion ? 'activo' : 'inactivo'}`}
                    aria-label="Botón para activar narrador del celular"
                    aria-checked={narracion}
                    role="switch"
            >
            <div className="switch-manejador"></div>
            </button>
        </div>

        {/* Sonidos */}
        <div className="ajustes-fila">

            <div className="opcion-izquierda">
            <span>🎵</span> <span>Sonidos</span>
            </div>

            <button onClick={() => setSonidos(!sonidos)}
                    className={`switch-btn ${sonidos ? 'activo' : 'inactivo'}`}
                    aria-label="Botón para activar sonido"
                    aria-checked={sonidos}
                    role="switch"
            >
            <div className="switch-manejador"></div>
            </button>
        </div>

        {/* Vibración */}
        <div className="ajustes-fila">

            <div className="opcion-izquierda">
            <span>📳</span> <span>Vibración</span>
            </div>

            <button onClick={() => setVibracion(!vibracion)}
                    className={`switch-btn ${vibracion ? 'activo' : 'inactivo'}`}
                    aria-label="Botón para activar vibración para teléfono"
                    aria-checked={vibracion}
                    role="switch"
            >

            <div className="switch-manejador"></div>
            </button>
        </div>
        </section>

    </div>
    </div>
  );
}