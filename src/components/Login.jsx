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
      window.location.href = "../index.html";
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <>
      <div class="container_inicio_sesion">
        <div class="main_image">
          <a href="../index.html">
            <img src={Logo} alt="Hospital Polaco" />
          </a>
        </div>
        <div>
          <h2 class="title">Iniciar sesion</h2>
        </div>
        <form className="login_form" onSubmit={handleSubmit}>
          <label for="name">Usuario</label>
          <input
            type="text"
            name="email"
            placeholder="jperez0001"
            value={user.email}
            onChange={handleChange}
            required
          />

          <label for="password">Contraseña</label>
          <input
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
          <a href="registro.html" class="secondary_button">Registrarse</a>
          <p class="recuperar_contrasena">¿Olvidaste tu contraseña?</p>
        </form>
      </div>
    </>
  );
};

export default Login;
