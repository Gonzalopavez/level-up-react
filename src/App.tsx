import { useEffect, useRef } from 'react'; 
import { Outlet } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";
import "./main.css";

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

  const loggedInAnteriormente = useRef(!!currentUser); 

  useEffect(() => {

    if (currentUser && !loggedInAnteriormente.current) {
      clearCart();
    }
    
    if (!currentUser && loggedInAnteriormente.current) {
      clearCart();
    }
    
    loggedInAnteriormente.current = !!currentUser;

  }, [currentUser, clearCart]);

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
