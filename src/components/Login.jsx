import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logo.png";
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
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.error || "Usuario o contraseña incorrectos");
    }
  };

  return (
    <section className="min-h-[70vh] w-full bg-gradient-to-br from-[#ECEFF1] via-white to-slate-100 flex items-center justify-center px-4 py-14">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur shadow-xl shadow-slate-300/40">
        <div className="flex flex-col items-center gap-6 px-8 py-10 sm:px-10">
          <Link to="/" className="flex items-center gap-3">
            <img src={Logo} alt="Hospital Polaco" className="h-14 w-auto" />
            <span className="text-lg font-semibold text-slate-600">Hospital Polaco</span>
          </Link>

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-800">Iniciar sesión</h2>
            <p className="mt-2 text-sm text-slate-500">Ingresá tus credenciales para continuar.</p>
          </div>

          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-600">
                Usuario
              </label>
              <input
                id="email"
                className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition"
                type="text"
                name="email"
                placeholder="jperez0001"
                value={user.email}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-600">
                Contraseña
              </label>
              <input
                id="password"
                className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition"
                type="password"
                name="password"
                placeholder="********"
                value={user.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-[#DC143C] cursor-pointer px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#DC143C]/60 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#B22222]"
            >
              Iniciar sesión
            </button>

            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.4em] text-slate-300">
              <span className="flex-1 h-px bg-slate-200" />
              <span>o</span>
              <span className="flex-1 h-px bg-slate-200" />
            </div>

            <Link
              to="/registro"
              className="w-full block rounded-full border border-[#DC143C] bg-white px-6 py-3 text-center text-sm font-semibold text-[#DC143C] shadow-sm transition hover:border-[#B22222]"
            >
              Crear cuenta
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
