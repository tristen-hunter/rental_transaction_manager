import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if (typeof window !== 'undefined') {
  window.addEventListener("wheel", () => {
    if (document.activeElement instanceof HTMLInputElement && 
        document.activeElement.type === "number") {
      document.activeElement.blur();
    }
  }, { passive: false });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
