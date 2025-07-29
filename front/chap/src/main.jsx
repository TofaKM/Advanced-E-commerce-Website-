import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' 
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { AuthProvider } from './context/AuthProvider.jsx'
import { LocProvider } from './context/LocProvider.jsx'
import { CategoryProvider } from './context/CategoryProvider.jsx'
import { ProductProvider } from './context/ProductProvider.jsx'
import { CartProvider } from './context/CartProvider.jsx'
import { CheckProvider } from './context/CheckProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CheckProvider>
      <CartProvider>
        <ProductProvider>
          <AuthProvider>
            <LocProvider>
              <CategoryProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </CategoryProvider>
            </LocProvider>
          </AuthProvider>
        </ProductProvider>
      </CartProvider>
    </CheckProvider>
  </StrictMode>,
)
