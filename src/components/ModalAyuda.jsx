import React from 'react';
import './ModalAyuda.css';

const ModalAyuda = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <h2>{title}</h2>
        {children}
        <button className="modal-cerrar-btn" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  );
};

export default ModalAyuda;