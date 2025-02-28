import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './css/base.css'
import './css/embla.css'
import './css/sandbox.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
