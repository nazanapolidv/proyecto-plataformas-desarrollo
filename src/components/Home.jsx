import React, { useEffect, useState } from "react";
import Login from "./Login.jsx";
import CardEspecializaciones from "./CardEspecializaciones.jsx";
import Banner from "./Banner.jsx";
import "../css/Index.css";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const renderByRole = () => {
    if (!user) return null;

    switch (user.rol) {
      case "paciente":
        return (
          <div>
            <h2 className="text-center home-title text-3xl font-bold text-black-700 mb-2">Bienvenido, {user.nombre}</h2>
            <p className="text-center home-desc text-lg text-gray-700 mb-6">Desde aca vas a poder ver y reservar citas médicas.</p>
          </div>
        );
            case "administrador":
        return (
          <div>
            <h2 className="text-center home-title text-3xl font-bold text-black-700 mb-2">Bienvenido, administrador</h2>
            <p className="text-center home-desc text-lg text-gray-700 mb-6">Desde aca vas a poder gestionar usuarios, médicos y estadísticas.</p>
          </div>
        );
      default:
        return <p className="text-center">Rol desconocido</p>;
    }
  };

  return (
    <>
      {user ? (
        <div>
          <Banner />
          {renderByRole()}
          <hr />
          <div className="container_especializaciones">
            <h2 className="subtitle">Especializaciones</h2>
            <div className="card_container">
              <CardEspecializaciones nombreImg="estetoscopio.png" altImg="Medicina General" titulo="Medicina General" desc="Consulta médica general, diagnóstico y tratamiento de enfermedades comunes." />
              <CardEspecializaciones nombreImg="neurologia.png" altImg="Neurología" titulo="Neurología" desc="Atención integral de adultos, diagnóstico y tratamiento de enfermedades complejas." />
              <CardEspecializaciones nombreImg="cardiologia.png" altImg="Cardiología" titulo="Cardiología" desc="Diagnóstico y tratamiento de enfermedades del corazón y sistema circulatorio." />
            </div>
          </div>
        </div>
      ) : (
        <Login onLogin={setUser} />
      )}
    </>
  );
};

export default Home