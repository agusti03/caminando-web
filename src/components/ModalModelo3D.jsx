import { useEffect, useRef } from 'react';
import './ModalModelo3D.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const ModalModelo3D = ({ isOpen, onClose, modelUrl }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const container = mountRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#efe7d4');

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(2.8, 2.4, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.target.set(0, 0.5, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 6, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb7d7a8, 1.1);
    fillLight.position.set(-5, 3, -4);
    scene.add(fillLight);

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z, 1);

        model.position.sub(center);
        model.position.y -= size.y * 0.01;
        model.scale.setScalar(3.4 / maxSize);

        scene.add(model);
      },
      undefined,
      () => {
        console.warn('No se pudo cargar el modelo 3D.');
      }
    );

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(rect.width, 320);
      const height = Math.max(rect.height, 280);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    let animationFrame = requestAnimationFrame(animate);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    controlsRef.current = controls;

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);

      if (rendererRef.current) {
        renderer.dispose();
        container.removeChild(renderer.domElement);
      }

      if (sceneRef.current) {
        sceneRef.current.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.dispose?.();
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose?.());
            } else {
              child.material?.dispose?.();
            }
          }
        });
      }
    };
  }, [isOpen, modelUrl]);

  if (!isOpen) return null;

  return (
    <div className="modal-3d-overlay" onClick={onClose}>
      <div className="modal-3d-contenido" role="dialog" aria-modal="true" aria-label="Visor 3D" onClick={(event) => event.stopPropagation()}>
        <div className="modal-3d-header">
          <button type="button" className="modal-3d-cerrar" aria-label="Cerrar visor 3D" onClick={onClose}>×</button>
        </div>
        <div className="modal-3d-stage">
          <div ref={mountRef} className="modelo-3d-canvas" aria-label="Modelo 3D cargado" />
        </div>
      </div>
    </div>
  );
};

export default ModalModelo3D;
