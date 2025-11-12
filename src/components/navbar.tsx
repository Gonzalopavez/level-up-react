
import React, { useEffect } from 'react'; 
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useSearch } from '../hooks/useSearch';


export const Navbar: React.FC = () => {
  
  // Pedimos 'logout' 
  const { currentUser, logout } = useAuth(); 
  const { cartItems } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const location = useLocation(); 

  const showSearchBar = location.pathname === '/productos';

  useEffect(() => {
    if (location.pathname !== '/productos') {
      setSearchTerm('');
    }
  }, [location.pathname, setSearchTerm]);

  // Pedimos 'totalItemsEnCarrito'
  const totalItemsEnCarrito = cartItems.reduce((total, item) => total + item.cantidad, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <img src="/img/logo.png" alt="Logo LevelUp Gamer" className="logogamer" />
          <span className="neon-text ms-2">LEVEL-UP GAMER</span>
        </NavLink>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarPrincipal" 
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarPrincipal">
          
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item mx-2"><NavLink className="nav-link" aria-current="page" to="/" end><i className="bi bi-house-door-fill fs-5"></i></NavLink></li>
            <li className="nav-item mx-2"><NavLink className="nav-link" to="/productos">Productos</NavLink></li>
            <li className="nav-item mx-2"><NavLink className="nav-link" to="/nosotros">Nosotros</NavLink></li>
            <li className="nav-item mx-2"><NavLink className="nav-link" to="/blogs">Blogs</NavLink></li>
            <li className="nav-item mx-2"><NavLink className="nav-link" to="/contacto">Contacto</NavLink></li>
          </ul>
          
          {showSearchBar && (
            <form className="d-flex ms-auto" role="search" onSubmit={handleSearchSubmit}>
              
              <input 
                className="form-control me-2" 
                type="search" 
                placeholder="Buscar en la tienda..." 
                aria-label="Search"
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              
              <button className="btn btn-gamer" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </form>
          )}
          
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            
            {currentUser ? (
              
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-person-circle fs-4 me-2"></i>
                  Hola, {currentUser.nombre.split(' ')[0]}
                </a>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                  <li><NavLink className="dropdown-item" to="/perfil">Mi Perfil</NavLink></li>
                  
                  {currentUser.tipo === "Administrador" && (
                    <li><NavLink className="dropdown-item" to="/admin">Panel Admin</NavLink></li>
                  )}
                  {currentUser.tipo === "Vendedor" && (
                     <li><NavLink className="dropdown-item" to="/vendedor">Panel Vendedor</NavLink></li>
                  )}

                  <li><hr className="dropdown-divider" /></li>
                  
                  <li>
                    {/* --- AQUÍ SE USA 'logout' --- */}
                    <button className="dropdown-item" onClick={logout}>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>

            ) : (

              <li className="nav-item">
                <a 
                  className="btn btn-login"
                  href="#" 
                  data-bs-toggle="offcanvas"
                  data-bs-target="#loginOffcanvas"
                >
                  <i className="bi bi-person-circle"></i> Iniciar Sesión
                </a>
              </li>

            )}
            
            <li className="nav-item">
              <a 
                className="nav-link" 
                href="#" 
                data-bs-toggle="offcanvas" 
                data-bs-target="#offcanvasCarrito" 
              >
                <i className="bi bi-cart fs-4 text-neon"></i>
                {/* --- AQUÍ SE USA 'totalItemsEnCarrito' --- */}
                <span className="badge bg-danger ms-1">{totalItemsEnCarrito}</span>
              </a>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};