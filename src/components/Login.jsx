import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(user.email, user.password);
    console.log(result)
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.error || "Usuario o contraseña incorrectos");
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
            <button
              type="submit"
              className="bg-red-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-red-700 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              Iniciar sesión
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <p>- o -</p>
            <a href="/registro"
              className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >Registrarse</a>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
