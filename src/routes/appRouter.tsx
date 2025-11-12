import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";

// Páginas públicas
import { HomePage } from "../pages/homePage";
import { ProductosPage } from "../pages/productosPage";
import { ContactoPage } from "../pages/contactoPage";
import { NosotrosPage } from "../pages/nosotrosPage";
import { BlogPage } from "../pages/blogPage";
import { BlogPostRtx4090Page } from "../pages/blogPostRtx4090Page";
import { BlogPostSonido71Page } from "../pages/blogPostSonido71Page";
import { RegistroPage } from "../pages/registroPage";
import { CheckoutPage } from "../pages/checkoutPage";

// Páginas Vendedor
import { VendedorPage } from "../pages/vendedorPage";
import { GestionStockVendedor } from "../components/vendedor/gestionStockVendedor";
import { VerVentas } from "../components/vendedor/verVentas";

// Rutas protegidas
import { ProtectedRoute } from "./protectedRouter";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Rutas públicas
      { path: "/", element: <HomePage /> },
      { path: "/productos", element: <ProductosPage /> },
      { path: "/nosotros", element: <NosotrosPage /> },
      { path: "/blogs", element: <BlogPage /> },
      { path: "/contacto", element: <ContactoPage /> },

      // Blog posts
      { path: "/blogs/rtx-4090", element: <BlogPostRtx4090Page /> },
      { path: "/blogs/sonido-7-1", element: <BlogPostSonido71Page /> },

      // Registro
      { path: "/registro", element: <RegistroPage /> },

      //  Checkout del carrito
      { path: "/carrito", element: <CheckoutPage /> },

      //RUTAS PROTEGIDAS PARA VENDEDORES
      {
        element: <ProtectedRoute allowedRoles={["Vendedor"]} />,
        children: [
          { path: "/vendedor", element: <VendedorPage /> },
          { path: "/vendedor/stock", element: <GestionStockVendedor /> },
          { path: "/vendedor/ventas", element: <VerVentas /> },
        ],
      },

      //RUTAS PROTEGIDAS PARA ADMIN
      {
        element: <ProtectedRoute allowedRoles={["Administrador"]} />,
        children: [
          {
            path: "/admin",
            element: <AdminDashboardPage />,
          },
        ],
      },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
