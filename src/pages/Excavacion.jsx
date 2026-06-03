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
import ayudaIcon from '../assets/ayuda.svg'; // Asegúrate de que este archivo SVG exista en la ruta especificada
import fosilImg from '../assets/fosil.png';

const TOOLS = [
  { id: 'pico', name: 'Pico', icon: picoIcon, layer: 3, size: 80 },
  { id: 'pala', name: 'Pala', icon: palaIcon, layer: 2, size: 60 },
  { id: 'pincel', name: 'Pincel', icon: pincelIcon, layer: 1, size: 40 },
];

function Excavacion({ onBack }) {
  const [selectedTool, setSelectedTool] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [layersReady, setLayersReady] = useState(false);
  const containerRef = useRef(null);
  const fosilRef = useRef(null);
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

      setLayersReady(true);
    };

    setupCanvases();
    window.addEventListener('resize', setupCanvases);
    return () => {
      window.removeEventListener('resize', setupCanvases);
    };
  }, []);

  const calculateProgress = () => {
    const canvas = canvasRefs[1].current;
    const fosil = fosilRef.current;
    if (!canvas || !fosil) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const rect = fosil.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    // Mapear coordenadas del elemento de imagen al sistema interno del canvas
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;
    
    const startX = Math.max(0, (rect.left - canvasRect.left) * scaleX);
    const startY = Math.max(0, (rect.top - canvasRect.top) * scaleY);
    const width = Math.min(canvas.width - startX, rect.width * scaleX);
    const height = Math.min(canvas.height - startY, rect.height * scaleY);

    if (width <= 0 || height <= 0) return;

    const imageData = ctx.getImageData(startX, startY, width, height).data;
    let transparentPixels = 0;
    const sampleStep = 40; // Muestrear 1 de cada 40 píxeles para performance
    let totalSampled = 0;

    for (let i = 3; i < imageData.length; i += 4 * sampleStep) {
      totalSampled++;
      if (imageData[i] === 0) {
        transparentPixels++;
      }
    }
    
    const newProgress = Math.min(100, Math.round((transparentPixels / totalSampled) * 100));
    if (newProgress !== progress) setProgress(newProgress);
  };

  const handleDig = (e) => {
    if (!selectedTool) return;
    
    const tool = TOOLS.find(t => t.id === selectedTool);
    const currentCanvas = canvasRefs[tool.layer].current;
    if (!currentCanvas) return;

    const rect = currentCanvas.getBoundingClientRect();

    // Obtener coordenadas (mouse o touch)
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);

    if (clientX === undefined || clientY === undefined) return;

    // Ajustar por posición del canvas y escala de resolución
    const x = (clientX - rect.left) * (currentCanvas.width / rect.width);
    const y = (clientY - rect.top) * (currentCanvas.height / rect.height);

    // Lógica de "bloqueo": solo permitir excavar si la capa superior ya está transparente en este punto
    if (tool.layer < 3) {
      const canvasAbove = canvasRefs[tool.layer + 1].current;
      // willReadFrequently optimiza el rendimiento para lecturas constantes de píxeles
      const ctxAbove = canvasAbove.getContext('2d', { willReadFrequently: true });
      const pixel = ctxAbove.getImageData(x, y, 1, 1).data;
      // Si el canal Alpha (pixel[3]) es mayor a 0, la capa superior aún bloquea esta zona
      if (pixel[3] > 0) return;
    }

    const ctx = currentCanvas.getContext('2d');
    // "Borrar" circulo
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, tool.size, 0, Math.PI * 2);
    ctx.fill();

    // Solo calculamos progreso si estamos limpiando la capa de arena (layer 1)
    if (tool.layer === 1) {
      calculateProgress();
    }
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1) handleDig(e);
  };

  return (
    <div className="excavacion-page">
      <BotonVolver className="btn-volver" onClick={onBack} />

      {/* Botón de Ayuda */}
      <button
        className="btn-ayuda"
        onClick={() => setShowHelpModal(true)}
        title="Ayuda"
      >
        <img src={ayudaIcon} alt="Ayuda" className="ayuda-icono" />
      </button>

      {/* Modal de Ayuda */}
      {showHelpModal && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h2>Cómo jugar</h2>
            <p>¡Bienvenido a la excavación arqueológica!</p>
            <ul>
              <li>Usa el <strong>Pico</strong> para romper la capa de tierra dura.</li>
              <li>Usa la <strong>Pala</strong> para quitar la tierra normal.</li>
              <li>Usa el <strong>Pincel</strong> para limpiar la arena y revelar el fósil.</li>
              <li>Solo puedes usar una herramienta en la capa que está visible. Si intentas usar una herramienta en una capa oculta, no tendrá efecto.</li>
              <li>El <strong>Progreso</strong> de limpieza del fósil se muestra en la barra superior.</li>
              <li>¡Tu objetivo es descubrir completamente el fósil oculto!</li>
            </ul>
            <button className="modal-cerrar-btn" onClick={() => setShowHelpModal(false)}>
              Entendido
            </button>
          </div>
        </div>
      )}

      <div className="progreso-limpieza">
        <span className="progreso-label">Progreso</span>
        <div className="barra-progreso">
          <div className="progreso-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="progreso-porcentaje">{progress}%</span>
      </div>

      <div className="kira-guia">
        <div className="globo-texto">
          <p>
            {progress >= 100
              ? "¡Buen trabajo! Descubriste el fósil de un gliptodonte"
              : "Hola! Soy Kira, paleontóloga. Para comenzar la excavación, seleccioná el pico y empezá a picar. Si necesitas ayuda, haz clic en el botón de ayuda."}
          </p>
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
          <img 
            src={fosilImg} 
            ref={fosilRef} 
            className="fosil-capa" 
            alt="Fósil" 
            style={{ opacity: layersReady ? 1 : 0 }} 
          />
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