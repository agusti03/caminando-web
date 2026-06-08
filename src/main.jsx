import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Coleccion from './pages/Coleccion.jsx'
import DetalleGliptodonte from './pages/DetalleGliptodonte.jsx'
import JuegoGliptodonte from './pages/JuegoGliptodonte.jsx'
import Ajustes from './pages/Ajustes.jsx'
import { SettingsProvider } from './contexts/SettingsContext.jsx'
import Excavacion from './pages/Excavacion.jsx'
import Recursos from './pages/Recursos.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/coleccion" element={<Coleccion />} />
          <Route path="/detalle-gliptodonte" element={<DetalleGliptodonte />} />
          <Route path="/juego-gliptodonte" element={<JuegoGliptodonte />} />
          <Route path="/ajustes" element={<Ajustes />} />
          <Route path="/recursos" element={<Recursos />} />
          <Route path="/excavacion" element={<Excavacion />} />

        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  </StrictMode>,
)
