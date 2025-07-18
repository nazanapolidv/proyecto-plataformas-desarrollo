import React from "react";
import { useAuth } from '../context/AuthContext';
import CardEspecializaciones from "./CardEspecializaciones.jsx";
import Banner from "./Banner.jsx";
import "../css/Index.css";

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  const renderByRole = () => {
    if (!isAuthenticated()) return null;

    console.log('🏠 Home - User:', user);
    console.log('🏠 Home - User role:', user.rol);

    switch (user.rol) {
      case "paciente":
        return (
          <div>
            <h2 className="text-center home-title text-3xl font-bold text-black-700 mb-2">
              Bienvenido, {user.nombre}
            </h2>
            <p className="text-center home-desc text-lg text-gray-700 mb-6">
              Desde acá vas a poder ver y reservar citas médicas.
            </p>
          </div>
        );
      case "admin":
        return (
          <div>
            <h2 className="text-center home-title text-3xl font-bold text-black-700 mb-2">Bienvenido, administrador {user.nombre}</h2>
            <p className="text-center home-desc text-lg text-gray-700 mb-6">Desde aca vas a poder gestionar usuarios, médicos y estadísticas.</p>
          </div>
        );
      default:
        console.log('❌ Home - Rol no reconocido:', user.rol);
        return <p className="text-center">Rol desconocido: {user.rol}</p>;
    }
  };

  return (
    <div className="home-container">
      <Banner />
      {renderByRole()}
      <CardEspecializaciones />
    </div>
  );
};

export default Home;