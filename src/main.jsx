import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Coleccion from './pages/Coleccion.jsx'
import DetalleGliptodonte from './pages/DetalleGliptodonte.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/coleccion" element={<Coleccion />} />
        <Route path="/detalle-gliptodonte" element={<DetalleGliptodonte />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
