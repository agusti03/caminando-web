import { useState, useRef, useEffect } from 'react';
import BotonVolver from '../components/BotonVolver';
import './Excavacion.css';

import picoIcon from '../assets/pico.svg';
import palaIcon from '../assets/pala.svg';
import pincelIcon from '../assets/pincel.svg';
import kiraImg from '../assets/kira.png';
import tierraDuraTexture from '../assets/tierra-dura.png';
import tierraTexture from '../assets/tierra.png';
import arenaTexture from '../assets/arena.png';
import fosilImg from '../assets/fosil.png';

const TOOLS = [
  { id: 'pico', name: 'Pico', icon: picoIcon, layer: 3, size: 80 },
  { id: 'pala', name: 'Pala', icon: palaIcon, layer: 2, size: 60 },
  { id: 'pincel', name: 'Pincel', icon: pincelIcon, layer: 1, size: 40 },
];

function Excavacion({ onBack }) {
  const [selectedTool, setSelectedTool] = useState(null);
  const containerRef = useRef(null);
  const canvasRefs = {
    3: useRef(null), // Tierra Dura
    2: useRef(null), // Tierra
    1: useRef(null), // Arena
  };

  // Inicializar canvases con texturas
  useEffect(() => {
    const setupCanvases = async () => {
      if (!containerRef.current) return;

      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth === 0 || clientHeight === 0) return;

      const layers = [
        { ref: canvasRefs[3], src: tierraDuraTexture },
        { ref: canvasRefs[2], src: tierraTexture },
        { ref: canvasRefs[1], src: arenaTexture },
      ];

      // Cargamos todas las imágenes primero
      const loadedImages = await Promise.all(
        layers.map((layer) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ ref: layer.ref, img });
            img.onerror = () => resolve({ ref: layer.ref, img: null });
            img.src = layer.src;
          });
        })
      );

      // Dibujamos cada capa
      loadedImages.forEach(({ ref, img }) => {
        const canvas = ref.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext('2d');
        canvas.width = clientWidth;
        canvas.height = clientHeight;

        // Lógica para cubrir el canvas manteniendo la relación de aspecto (Object-fit: cover)
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = canvas.width / 2 - (img.width / 2) * scale;
        const y = canvas.height / 2 - (img.height / 2) * scale;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      });
    };

    setupCanvases();
    window.addEventListener('resize', setupCanvases);
    return () => {
      window.removeEventListener('resize', setupCanvases);
    };
  }, []);

  const handleDig = (e) => {
    if (!selectedTool) return;
    
    const tool = TOOLS.find(t => t.id === selectedTool);
    const canvas = canvasRefs[tool.layer].current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    // Obtener coordenadas (mouse o touch)
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);

    if (clientX === undefined || clientY === undefined) return;

    // Ajustar por posición del canvas y escala de resolución
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    // "Borrar" circulo
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, tool.size, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1) handleDig(e);
  };

  return (
    <div className="excavacion-page">
      <BotonVolver className="btn-volver" onClick={onBack} />

      <div className="kira-guia">
        <div className="globo-texto">
          <p>Para comenzar, elegí el pico y rompé la tierra dura</p>
        </div>
        <img src={kiraImg} alt="Kira" className="kira-img" />
      </div>

      <main className="area-excavacion" ref={containerRef}>
        <div 
          className="capas-interactivas"
          onMouseMove={handleMouseMove}
          onTouchStart={handleDig}
          onTouchMove={handleDig}
          onMouseDown={handleDig}
        >
          <img src={fosilImg} className="fosil-capa" alt="Fósil" />
          <canvas ref={canvasRefs[1]} className="excavacion-canvas layer-arena" />
          <canvas ref={canvasRefs[2]} className="excavacion-canvas layer-tierra" />
          <canvas ref={canvasRefs[3]} className="excavacion-canvas layer-tierra-dura" />
        </div>
      </main>

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