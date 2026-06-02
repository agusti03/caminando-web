import { useState } from 'react';
import BotonVolver from '../components/BotonVolver';
import './Excavacion.css';

import picoIcon from '../assets/pico.svg';
import palaIcon from '../assets/pala.svg';
import pincelIcon from '../assets/pincel.svg';

const TOOLS = [
  { id: 'pico', name: 'Pico', icon: picoIcon },
  { id: 'pala', name: 'Pala', icon: palaIcon },
  { id: 'pincel', name: 'Pincel', icon: pincelIcon },
];

function Excavacion({ onBack }) {
  const [selectedTool, setSelectedTool] = useState(null);

  return (
    <div className="excavacion-pagina">
      <BotonVolver className="btn-volver" onClick={onBack} />

      <div className="herramientas-contenedor">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            className={`herramienta-btn ${selectedTool === tool.id ? 'activa' : ''}`}
            onClick={() => setSelectedTool(tool.id)}
            title={tool.name}
          >
            <img src={tool.icon} alt={tool.name} className="herramienta-icono" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default Excavacion;