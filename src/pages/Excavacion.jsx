import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import BotonVolver from '../components/BotonVolver';
import { FaTimes } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import BotonAyuda from '../components/BotonAyuda';
import ModalAyuda from '../components/ModalAyuda';
import { supabase } from '../config/supabaseClient'; 
import { guardarFosilDescubierto } from '../utils/progreso';

import './Excavacion.css';

import picoIcon from '../assets/pico.svg';
import palaIcon from '../assets/pala.svg';
import pincelIcon from '../assets/pincel.svg';
import kiraImg from '../assets/kira.png';
import tierraDuraTexture from '../assets/tierra-dura.png';
import tierraTexture from '../assets/tierra.png';
import arenaTexture from '../assets/arena.png';
import fosilDefaultImg from '../assets/fosil.png'; // Fallback por defecto

const TOOLS = [
  { id: 'pico', name: 'Pico', icon: picoIcon, layer: 3, size: 80 },
  { id: 'pala', name: 'Pala', icon: palaIcon, layer: 2, size: 60 },
  { id: 'pincel', name: 'Pincel', icon: pincelIcon, layer: 1, size: 40 },
];

const ROWS = ['A', 'B', 'C', 'D', 'E'];
const COLS = [1, 2, 3, 4, 5];

function Excavacion({ onBack }) {
  const navigate = useNavigate();
  const { slugId } = useParams(); // 4. Capturamos el slug de la URL (ej: /excavacion/gliptodonte)
  const { accesibilidadExcavacion: isAccessibilityMode } = useSettings();
  const [selectedTool, setSelectedTool] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isKiraVisible, setIsKiraVisible] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [layersReady, setLayersReady] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Estado para guardar los datos del mamífero actual (nombre, imagen, etc.)
  const [mamifero, setMamifero] = useState(null);
  const [isAccessibilityMode] = useState(() => {
    return localStorage.getItem('accesibilidadExcavacion') === 'true';
  });
  const containerRef = useRef(null);
  const fosilRef = useRef(null);
  const kiraDialogueRef = useRef(null);
  const fossilCanvasRef = useRef(null);
  const canvasRefs = {
    3: useRef(null),
    2: useRef(null),
    1: useRef(null),
  };

  // 5. Cargar los datos del mamífero desde Supabase basado en el slug de la URL
  useEffect(() => {
    async function fetchMamiferoData() {
      if (!slugId) return;
      const { data, error } = await supabase
        .from('mamiferos')
        .select('*')
        .eq('slug', slugId)
        .single();

      if (!error && data) {
        setMamifero(data);
      }
    }
    fetchMamiferoData();
  }, [slugId]);

  // Imagen del fósil dinámica (si el mamífero tiene una en Supabase o assets, sino usa el default)
  const imagenFosilSrc = mamifero?.imagen_url || fosilDefaultImg;

  // Inicializar canvases con texturas (usando la imagen del fósil correspondiente)
  useEffect(() => {
    const setupCanvases = async () => {
      if (!containerRef.current) return;

      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth === 0 || clientHeight === 0) return;

      const layers = [
        { ref: canvasRefs[3], src: tierraDuraTexture, type: 'terrain' },
        { ref: canvasRefs[2], src: tierraTexture, type: 'terrain' },
        { ref: canvasRefs[1], src: arenaTexture, type: 'terrain' },
        { ref: fossilCanvasRef, src: imagenFosilSrc, type: 'fossil' },
      ];

      const loadedImages = await Promise.all(
        layers.map((layer) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ ...layer, img });
            img.onerror = () => resolve({ ...layer, img: null });
            img.src = layer.src;
          });
        })
      );

      loadedImages.forEach(({ ref, img }) => {
        const canvas = ref.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext('2d');
        canvas.width = clientWidth;
        canvas.height = clientHeight;

        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = canvas.width / 2 - (img.width / 2) * scale;
        const y = canvas.height / 2 - (img.height / 2) * scale;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      });

      const fossilItem = loadedImages.find(item => item.type === 'fossil');
      if (fossilItem && fossilItem.img && fossilCanvasRef.current) {
        const fossilCanvas = fossilCanvasRef.current;
        const fossilCtx = fossilCanvas.getContext('2d', { willReadFrequently: true });
        fossilCanvas.width = clientWidth;
        fossilCanvas.height = clientHeight;

        const img = fossilItem.img;
        const fossilMaxWidth = 800;
        const fossilWidthPercent = 0.8;

        let drawWidth = Math.min(clientWidth * fossilWidthPercent, fossilMaxWidth);
        let drawHeight = (img.naturalHeight / img.naturalWidth) * drawWidth;

        if (drawHeight > clientHeight) {
          drawHeight = clientHeight;
          drawWidth = (img.naturalWidth / img.naturalHeight) * drawHeight;
        }

        const drawX = (clientWidth - drawWidth) / 2;
        const drawY = (clientHeight - drawHeight) / 2;

        fossilCtx.clearRect(0, 0, fossilCanvas.width, fossilCanvas.height);
        fossilCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      }

      setLayersReady(true);
    };

    const timeoutId = setTimeout(setupCanvases, 100);
    window.addEventListener('resize', setupCanvases);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', setupCanvases);
    };
  }, [imagenFosilSrc]);

  // 6. Al llegar al 100%, guardamos dinámicamente usando el slug de la URL
  useEffect(() => {
    if (progress >= 100 && slugId) {
      setIsKiraVisible(true);
      setTimeout(() => {
        kiraDialogueRef.current?.focus();
      }, 100);

      // Guardamos en el vector local usando nuestra función modular
      guardarFosilDescubierto(slugId);
      
      // Dejamos la señal en sessionStorage para que la colección active la animación de desbloqueo
      try {
        sessionStorage.setItem(`justUnlocked_${slugId}`, 'true');
      } catch (e) {
        // Ignorar si falla storage privado
      }
    }
  }, [progress, slugId]);

  const calculateProgress = () => {
    const arenaCanvas = canvasRefs[1].current;
    const fossilCanvas = fossilCanvasRef.current;
    if (!arenaCanvas || !fossilCanvas) return;

    const arenaCtx = arenaCanvas.getContext('2d', { willReadFrequently: true });
    const fossilCtx = fossilCanvas.getContext('2d', { willReadFrequently: true });

    const { width, height } = arenaCanvas;
    const fossilImageData = fossilCtx.getImageData(0, 0, width, height).data;
    const arenaImageData = arenaCtx.getImageData(0, 0, width, height).data;

    let totalFossilPixels = 0;
    let clearedFossilPixels = 0;
    const sampleStep = 10;

    for (let i = 3; i < fossilImageData.length; i += 4 * sampleStep) {
      if (fossilImageData[i] > 0) {
        totalFossilPixels++;
        if (arenaImageData[i] === 0) {
          clearedFossilPixels++;
        }
      }
    }
    
    let newProgress = 0;
    if (totalFossilPixels > 0) {
      newProgress = (clearedFossilPixels / totalFossilPixels) * 100;
    }

    newProgress = newProgress > 96 ? 100 : Math.round(newProgress);
    if (newProgress !== progress) setProgress(newProgress);
  };

  const getTerrainAt = (x, y, w = 1, h = 1) => {
    if (!layersReady) return "Cargando...";

    for (let l = 3; l >= 1; l--) {
      const canvas = canvasRefs[l].current;
      if (!canvas) continue;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      if (pixel[3] > 0) {
        if (l === 3) return "Tierra Dura";
        if (l === 2) return "Tierra";
        if (l === 1) return "Arena";
      }
    } 

    const fossilCanvas = fossilCanvasRef.current;
    if (fossilCanvas) {
        const fossilCtx = fossilCanvas.getContext('2d', { willReadFrequently: true });
        const startX = Math.max(0, Math.floor(x - w / 2));
        const startY = Math.max(0, Math.floor(y - h / 2));
        const scanW = Math.min(fossilCanvas.width - startX, Math.ceil(w));
        const scanH = Math.min(fossilCanvas.height - startY, Math.ceil(h));
        
        const fossilData = fossilCtx.getImageData(startX, startY, scanW, scanH).data;
        for (let i = 3; i < fossilData.length; i += 4) {
            if (fossilData[i] > 0) return "Fósil descubierto";
        }
    }
    return "Nada encontrado";
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

    if (tool.layer < 3) {
      const canvasAbove = canvasRefs[tool.layer + 1].current;
      const ctxAbove = canvasAbove.getContext('2d', { willReadFrequently: true });
      const pixel = ctxAbove.getImageData(centerX, centerY, 1, 1).data;
      if (pixel[3] > 0) return;
    }

    const ctx = currentCanvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
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

  const nombreMamiferoTexto = mamifero?.nombre || 'fósil';

  return (
    <div className="excavacion-page">
      <BotonVolver className="btn-volver" onClick={() => navigate(-1)}></BotonVolver>

      <BotonAyuda onClick={() => setShowHelpModal(true)} />

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
          <li>Solo puedes usar una herramienta en la capa que está visible.</li>
          <li>El <strong>Progreso</strong> de limpieza se muestra en la barra superior.</li>
        </ul>
      </ModalAyuda>

      <div 
        className="progreso-limpieza"
        tabIndex={0}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`Progreso de excavación: ${progress} por ciento`}
      >
        <span className="progreso-label">Progreso</span>
        <div className="barra-progreso" aria-hidden="true">
          <div className="progreso-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="progreso-porcentaje">{progress}%</span>
      </div>

      <div className={`kira-guia ${!isKiraVisible ? 'guia-oculta' : ''}`}>
        {isKiraVisible && (
          <div 
            className="globo-texto" 
            tabIndex={0} 
            ref={kiraDialogueRef}
          >
            <p>
              {progress >= 100
                ? `¡Buen trabajo! Descubriste el fósil de un ${nombreMamiferoTexto}`
                : `Hola! Soy Kira, paleontóloga. Vamos a excavar los restos de un ${nombreMamiferoTexto}. Seleccioná el pico y empezá a picar.`}
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
          <canvas ref={fossilCanvasRef} style={{ display: 'none' }} aria-hidden="true" />

          <img 
            src={imagenFosilSrc} 
            ref={fosilRef} 
            className="fosil-capa" 
            alt={`Fósil de ${nombreMamiferoTexto}`} 
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
                  
                  const terrain = getTerrainAt(centerX, centerY, cellWidth, cellHeight);
                  
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