import React, { useEffect, useRef } from 'react';

// CSS
import './ModalAyuda.css';

const ModalAyuda = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  // 1. Cada vez que el modal se abra, forzamos al lector de pantalla a mirar aquí dentro.
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}> {/* Al hacer clic fuera, también cierra */}
      <div 
        className="modal-contenido"
        ref={modalRef}
        tabIndex="-1"                  // Permite que React le haga .focus() por código
        role="dialog"                  // Avisa al lector que es una ventana emergente
        aria-modal="true"              // "Aísla" el fondo para que el lector no lea los ajustes de atrás
        aria-labelledby="modal-title"   // Conecta el título para que lo lea apenas se abra
        onClick={(e) => e.stopPropagation()} // Evita que se cierre el modal al hacer clic adentro
      >
        <h2 id="modal-title">{title}</h2>
        
        <div className="modal-cuerpo">
          {children}
        </div>

        <button className="modal-cerrar-btn" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  );
};

export default ModalAyuda;