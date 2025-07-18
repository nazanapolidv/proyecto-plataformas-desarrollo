import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logo.png";
import "../css/Login.css";
import "../css/index.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  // Si el usuario ya está autenticado, redirigir al home
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar error previo
    
    try {
      const loginSuccess = await login(formData.email, formData.password);

      if (loginSuccess) {
        // Usar setTimeout para permitir que React actualice el estado
        setTimeout(() => {
          navigate("/home");
        }, 100);
      }
    } catch (error) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <>
      <div className="h-[70vh] flex items-center justify-center">
        <div className="container_inicio_sesion">
          <div className="main_image">
            <a href="/">
              <img src={Logo} alt="Hospital Polaco" />
            </a>
          </div>
          <div>
            <h2 className="title">Iniciar sesion</h2>
          </div>
          <form className="login_form" onSubmit={handleSubmit}>
            <label htmlFor="name">Usuario</label>
            <input
              className="border-2 border-black"
              type="text"
              name="email"
              placeholder="jperez0001"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Contraseña</label>
            <input
              className="border-2 border-black"
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button className="primary_button" type="submit">Iniciar sesión</button>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <p>- o -</p>
            <a href="/registro" className="secondary_button">Registrarse</a>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
