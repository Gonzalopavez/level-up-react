// src/App.tsx
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/navbar"; 
import { Footer } from "./components/footer";
import { LoginModal } from "./components/loginModal";
import { CartOffcanvas } from "./components/cartOffcanvas";



function App() {
  return (
    <>
      <Navbar />

      {/* ✅ Los Offcanvas SIEMPRE deben ir aquí, fuera del <main> */}
      <LoginModal />
      <CartOffcanvas />

      <main className="container-fluid px-0">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}


export default App;