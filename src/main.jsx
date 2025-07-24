import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import './index.css'
import App from './App.jsx'
import SmoothScrollWrapper from './Component/SmoothScrollWrapper.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
    <SmoothScrollWrapper>
      <App />
    </SmoothScrollWrapper>
  </Router>
)
