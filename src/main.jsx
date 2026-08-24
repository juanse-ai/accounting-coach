import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Inter empaquetada, no por CDN: así lo pide el design system.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
// La 900 la usa sólo la presentación: sus títulos piden el peso black.
import '@fontsource/inter/900.css'

import './estilos/fail-fast-tokens.css'
import './estilos.css'
// Después de la hoja de la app: la presentación redefine su paleta sobre
// `.aprende` y tiene que ganar sin subir la especificidad a mano.
import './estilos/aprende.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
