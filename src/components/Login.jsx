import React, { useState } from "react";
import Usuarios from "../data/usuarios.json";
import Logo from "../assets/logo.png";
import "../css/Login.css";
import "../css/index.css";

const Login = ({ onLogin }) => {
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

    const usuarioEncontrado = Usuarios.find(
      u => u.email === user.email && u.password === user.password
    );

    if (usuarioEncontrado) {
      localStorage.setItem("user", JSON.stringify(usuarioEncontrado));
      onLogin(usuarioEncontrado);
      window.location.href = "/home";
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
            <a href="/sesion" className="secondary_button">Registrarse</a>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
