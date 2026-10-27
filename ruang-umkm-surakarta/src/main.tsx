import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './lib/auth/AuthContext';
import { CartProvider } from './lib/cart/CartContext';


createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    <App />
  </StrictMode>,
)
