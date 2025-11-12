import React from 'react';
import { BlogPostCard } from '../components/blogsPostCard';




export const BlogPage: React.FC = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center text-neon mb-5">Desde Nuestro Blog</h1>

      <div className="row justify-content-center">
        <div className="col-lg-10"> {/* Hacemos la columna un poco más ancha */}
          
          {/* USAMOS EL COMPONENTE */}
          <BlogPostCard 
            title="¿Es la RTX 4090 la reina indiscutible? Analizamos su poder"
            snippet="La última bestia de NVIDIA llegó para romper todos los benchmarks. Pero, ¿vale la pena la inversión? Desglosamos su rendimiento..."
            imageSrc="/img/rtx4090.jpg" // (Asegúrate de tener esta imagen)
            linkTo="/blogs/rtx-4090" // <-- El link que creamos en el router
          />

          <BlogPostCard 
            title="El Sonido 7.1: ¿Marketing o Ventaja Real en Shooters?"
            snippet="Todos los audífonos gamer prometen sonido envolvente, pero ¿realmente te ayuda a escuchar los pasos de tus enemigos? Probamos los últimos modelos..."
            imageSrc="/img/mujer.jpg" 
            linkTo="/blogs/sonido-7-1" 
          />

          

        </div>
      </div>
    </div>
  );
};