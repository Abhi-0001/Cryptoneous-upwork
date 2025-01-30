import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Router, Route} from 'react-router'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Router>
      <Route to='/home'>
        <App />
      </Route>
    </Router>
    </BrowserRouter>
  </StrictMode>,
)
