import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonVolver from '../components/BotonVolver';
import { FaTimes } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import BotonAyuda from '../components/BotonAyuda';
import ModalAyuda from '../components/ModalAyuda';
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

const ROWS = ['A', 'B', 'C', 'D', 'E'];
const COLS = [1, 2, 3, 4, 5];

function Excavacion({ onBack }) {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isKiraVisible, setIsKiraVisible] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [layersReady, setLayersReady] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const [isAccessibilityMode] = useState(() => {
    return localStorage.getItem('accesibilidadExcavacion') === 'true';
  });

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

  // Reaparecer Kira automáticamente cuando el progreso llegue al 100%
  useEffect(() => {
    if (progress >= 100) {
      setIsKiraVisible(true);
    }
  }, [progress]);

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
    
    const rawProgress = (transparentPixels / totalSampled) * 100;
    // Margen de tolerancia: si el progreso supera el 96%, lo consideramos completado para evitar frustración por píxeles residuales
    const newProgress = rawProgress > 96 ? 100 : Math.round(rawProgress);

    if (newProgress !== progress) setProgress(newProgress);
  };

  const getTerrainAt = (x, y) => {
    if (!layersReady) return "Cargando...";
    // Revisamos de arriba hacia abajo (capa 3 a 1)
    for (let l = 3; l >= 1; l--) {
      const canvas = canvasRefs[l].current;
      if (!canvas) continue;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      // Si el canal alfa es > 0, esta capa es la que el usuario ve/toca
      if (pixel[3] > 0) {
        if (l === 3) return "Tierra Dura";
        if (l === 2) return "Tierra";
        if (l === 1) return "Arena";
      }
    }
    return "Fósil descubierto";
  };

  const digAt = (x, y) => {
    if (!selectedTool) return;

    const tool = TOOLS.find(t => t.id === selectedTool);
    const currentCanvas = canvasRefs[tool.layer].current;
    if (!currentCanvas) return;

    const isSmallScreen = window.innerWidth < 768;
    const effectiveSize = isSmallScreen ? tool.size * 0.6 : tool.size;

    if (tool.layer < 3) {
      const canvasAbove = canvasRefs[tool.layer + 1].current;
      const ctxAbove = canvasAbove.getContext('2d', { willReadFrequently: true });
      const pixel = ctxAbove.getImageData(x, y, 1, 1).data;
      if (pixel[3] > 0) return;
    }

    const ctx = currentCanvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, effectiveSize, 0, Math.PI * 2);
    ctx.fill();

    if (tool.layer === 1) {
      calculateProgress();
    }
    // Forzamos re-render para actualizar las etiquetas de la rejilla
    setRefreshCounter(prev => prev + 1);
  };

  const digCell = (rIdx, cIdx) => {
    if (!selectedTool) return;

    const tool = TOOLS.find(t => t.id === selectedTool);
    const currentCanvas = canvasRefs[tool.layer].current;
    if (!currentCanvas) return;

    const cellWidth = currentCanvas.width / COLS.length;
    const cellHeight = currentCanvas.height / ROWS.length;
    const startX = cIdx * cellWidth;
    const startY = rIdx * cellHeight;
    const centerX = startX + cellWidth / 2;
    const centerY = startY + cellHeight / 2;

    // Verificamos si la capa superior bloquea esta celda (usando el centro como referencia)
    if (tool.layer < 3) {
      const canvasAbove = canvasRefs[tool.layer + 1].current;
      const ctxAbove = canvasAbove.getContext('2d', { willReadFrequently: true });
      const pixel = ctxAbove.getImageData(centerX, centerY, 1, 1).data;
      if (pixel[3] > 0) return;
    }

    const ctx = currentCanvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    // Se añade un pequeño margen de solapamiento (1px) para evitar bordes residuales por redondeo de coordenadas
    ctx.fillRect(startX - 1, startY - 1, cellWidth + 2, cellHeight + 2);

    if (tool.layer === 1) {
      calculateProgress();
    }
    setRefreshCounter(prev => prev + 1);
  };

  const handleDig = (e) => {
    const tool = TOOLS.find(t => t.id === selectedTool);
    if (!tool) return;
    
    const currentCanvas = canvasRefs[tool.layer].current;
    if (!currentCanvas) return;

    const rect = currentCanvas.getBoundingClientRect();

    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);

    if (clientX === undefined || clientY === undefined) return;

    const x = (clientX - rect.left) * (currentCanvas.width / rect.width);
    const y = (clientY - rect.top) * (currentCanvas.height / rect.height);

    digAt(x, y);
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1) handleDig(e);
  };

  return (
    <div className="excavacion-page">
      <BotonVolver className="btn-volver" onClick={() => navigate(-1)}></BotonVolver>

      <BotonAyuda onClick={() => setShowHelpModal(true)} />

      {/* Botón de Ajustes */}
      <button
        className="btn-ajustes"
        onClick={() => navigate('/ajustes')}
        title="Ajustes"
      >
        <IoSettingsSharp className="ajustes-icono" />
      </button>

      <ModalAyuda 
        isOpen={showHelpModal} 
        onClose={() => setShowHelpModal(false)} 
        title="Cómo jugar"
      >
        <p>¡Bienvenido a la excavación arqueológica!</p>
        <ul>
          <li>Usa el <strong>Pico</strong> para romper la capa de tierra dura.</li>
          <li>Usa la <strong>Pala</strong> para quitar la tierra normal.</li>
          <li>Usa el <strong>Pincel</strong> para limpiar la arena y revelar el fósil.</li>
          <li>Solo puedes usar una herramienta en la capa que está visible. Si intentas usar una herramienta en una capa oculta, no tendrá efecto.</li>
          <li>El <strong>Progreso</strong> de limpieza del fósil se muestra en la barra superior.</li>
          <li>¡Tu objetivo es descubrir completamente el fósil oculto!</li>
        </ul>
      </ModalAyuda>

      <div className="progreso-limpieza">
        <span className="progreso-label">Progreso</span>
        <div className="barra-progreso">
          <div className="progreso-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="progreso-porcentaje">{progress}%</span>
      </div>

      <div className={`kira-guia ${!isKiraVisible ? 'guia-oculta' : ''}`}>
        {isKiraVisible && (
          <div className="globo-texto">
            <p>
              {progress >= 100
                ? "¡Buen trabajo! Descubriste el fósil de un gliptodonte"
                : "Hola! Soy Kira, paleontóloga. Para comenzar la excavación, seleccioná el pico y empezá a picar. Si necesitas ayuda, haz clic en el botón de ayuda."}
            </p>
            <button className="kira-cerrar" onClick={() => setIsKiraVisible(false)} title="Cerrar diálogo">
              <FaTimes />
            </button>
          </div>
        )}
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
          {isAccessibilityMode && layersReady && (
            <div className="accessibility-grid">
              {ROWS.map((row, rIdx) => 
                COLS.map((col, cIdx) => {
                  const canvas = canvasRefs[1].current;
                  if (!canvas) return null;
                  
                  const cellWidth = canvas.width / COLS.length;
                  const cellHeight = canvas.height / ROWS.length;
                  const centerX = (cIdx + 0.5) * cellWidth;
                  const centerY = (rIdx + 0.5) * cellHeight;
                  
                  const terrain = getTerrainAt(centerX, centerY);
                  
                  return (
                    <button
                      key={`${row}${col}`}
                      className="grid-cell"
                      aria-label={`Sector ${row}${col}, ${terrain}`}
                      onClick={() => digCell(rIdx, cIdx)}
                    >
                      <span className="sr-only">Sector {row}{col}</span>
                    </button>
                  );
                })
              )}
            </div>
          )}
          <canvas ref={canvasRefs[1]} className="excavacion-canvas layer-arena" />
          <canvas ref={canvasRefs[2]} className="excavacion-canvas layer-tierra" />
          <canvas ref={canvasRefs[3]} className="excavacion-canvas layer-tierra-dura" />
        </div>
      </main>

      {progress < 100 ? (
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
      ) : (
        <button 
          className="btn-coleccion-final" 
          onClick={() => navigate('/coleccion')}
        >
          Ver Colección de Fósiles
        </button>
      )}
    </div>
  );
}

export default Excavacion;