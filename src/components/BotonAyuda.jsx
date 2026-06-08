import React from 'react';
import ayudaIcon from '../assets/ayuda.svg';
import './BotonAyuda.css';

const BotonAyuda = ({ onClick }) => {
  return (
    <button
      className="btn-ayuda"
      onClick={onClick}
      title="Ayuda"
    >
      <img src={ayudaIcon} alt="Ayuda" className="ayuda-icono" />
    </button>
  );
};

export default BotonAyuda;