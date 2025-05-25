import React, { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./components/Login.jsx";
import CardEspecializaciones from "./components/CardEspecializaciones.jsx";

const App = () => {
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
            <h2>Bienvenido paciente {user.email}</h2>
            <p>Puedes ver y reservar citas médicas.</p>
          </div>
        );
      case "medico":
        return (
          <div>
            <h2>Bienvenido doctor {user.email}</h2>
            <p>Puedes ver tu agenda y los pacientes asignados.</p>
          </div>
        );
      case "administrador":
        return (
          <div>
            <h2>Bienvenido administrador</h2>
            <p>Puedes gestionar usuarios, médicos y estadísticas.</p>
          </div>
        );
      default:
        return <p>Rol desconocido</p>;
    }
  };

  return (
    <>
      <Header />
      {user ? (
        <div style={{ padding: "20px" }}>
          <p>
            Sesión iniciada como <strong>{user.rol}</strong> —{" "}
            <button onClick={handleLogout}>Cerrar sesión</button>
          </p>
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
      <Footer />
    </>
  );
};

export default App;
