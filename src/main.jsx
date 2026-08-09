import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import App from './App.jsx'
import Coleccion from './pages/Coleccion.jsx'
import DetalleMamifero from './pages/DetalleMamifero.jsx' 
import Juego from './pages/Juego.jsx'
import Ajustes from './pages/Ajustes.jsx'
import Mapa from './pages/Mapa.jsx'
import Excavacion from './pages/Excavacion.jsx'
import Recursos from './pages/Recursos.jsx'
import { SettingsProvider } from './contexts/SettingsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/coleccion" element={<Coleccion />} />
          <Route path="/detalle/:slugId" element={<DetalleMamifero />} />          
          <Route path="/juego/:juegoId" element={<Juego />} />
          <Route path="/juego/:juegoId/:slugId" element={<Juego />} />
          <Route path="/ajustes" element={<Ajustes />} />
          <Route path="/recursos" element={<Recursos />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/excavacion/:slugId" element={<Excavacion />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  </StrictMode>,
)