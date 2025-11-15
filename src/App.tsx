
import { useEffect, useRef } from 'react'; 
import { Outlet } from 'react-router-dom';

// Componentes "carcasa"
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { LoginModal } from './components/loginModal';
import { CartOffcanvas } from './components/cartOffcanvas';

// "Cerebros"
import { useAuth } from './hooks/useAuth';
import { useCart } from './hooks/useCart';

function App() {
  
  const { currentUser } = useAuth();
  const { clearCart } = useCart();

  // "Memoria a Corto Plazo" (useRef)
  // Para recordar si el usuario ESTABA logueado
  const loggedInAnteriormente = useRef(!!currentUser); 

  // El "Disparador" (useEffect)
  useEffect(() => {
    

    
    // 1. SI ACABAS DE INICIAR SESIÓN
    // (Si ahora SÍ hay usuario, PERO antes NO había)
    if (currentUser && !loggedInAnteriormente.current) {
      clearCart(); // Limpia el carrito del "invitado"
    }
    
    // 2. SI ACABAS DE CERRAR SESIÓN
    // (Si ahora NO hay usuario, PERO antes SÍ había)
    if (!currentUser && loggedInAnteriormente.current) {
      clearCart(); // Limpia el carrito del "usuario"
    }
    
    // 3. Actualizamos la "memoria" para el próximo cambio
    loggedInAnteriormente.current = !!currentUser;
    
  }, [currentUser, clearCart]); // <-- Seguimos observando


  return (
    <>
      <Navbar />
      
      <main className="flex-grow-1">
        <Outlet />
      </main>
      
      <LoginModal />
      <CartOffcanvas />

      <Footer />
    </>
  )
}

export default App;