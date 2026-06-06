import { FaArrowLeft } from 'react-icons/fa';

function BotonVolver({ onClick, className = "boton-volver" }) {
  return (
    <button className={className} type="button" onClick={onClick}>
      <FaArrowLeft /> Volver
    </button>
  );
}

export default BotonVolver;