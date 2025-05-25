import React, { useState } from "react";
import Usuarios from "../data/usuarios.json";

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
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="container_login">
      <h2 className="subtitle">Iniciar Sesión</h2>
      <form className="login_form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Correo"
          value={user.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={user.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Iniciar sesión</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
