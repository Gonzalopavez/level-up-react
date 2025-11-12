import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from './routes/appRouter';

// 1. Importar los 3 "Cerebros"
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import { SearchProvider } from './hooks/useSearch'; 


import 'sweetalert2/dist/sweetalert2.min.css';      // El CSS base

// 2. CSS de Bootstrap (para las columnas, botones, etc.)
import 'bootstrap/dist/css/bootstrap.min.css'; 

// 3. Iconos de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';

// 4.  CSS (para el fondo negro, colores neón, etc.)
import './main.css'; 

// 5. JavaScript de Bootstrap (para que "funcione" el login, carrito, etc.)
import * as bootstrap from 'bootstrap';
(window as any).bootstrap = bootstrap; 

// ---------------------------------

// 6. El "Motor de Arranque" (Renderizado)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Envolvemos la App con los 3 "Cerebros" */}
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <AppRouter />
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);