import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Usuarios from "../data/usuarios.json";
import Logo from "../assets/logo.png";
import "../css/Login.css";
import "../css/index.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedUsers = localStorage.getItem('usuarios');
    const usuarios = savedUsers ? JSON.parse(savedUsers) : Usuarios;

    const usuarioEncontrado = usuarios.find(
      u => u.email === user.email && u.password === user.password
    );

    if (usuarioEncontrado) {
      login(usuarioEncontrado);
      navigate("/home");
    } else {
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
              value={user.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Contraseña</label>
            <input
              className="border-2 border-black"
              type="password"
              name="password"
              placeholder="********"
              value={user.password}
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
