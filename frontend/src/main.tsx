import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'

// ?still — без анимаций, как в макете: для скриншотов и слайдов.
if (/still/.test(location.search)) {
  const st = document.createElement('style')
  st.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}'
  document.head.appendChild(st)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
