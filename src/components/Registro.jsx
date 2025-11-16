import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/logo-removebg-preview.png';
import '../css/Index.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
    dni: '',
    obra_social: '',
    numero_afiliado: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);

      if (result.success) {
        navigate('/mi-salud');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[80vh] w-full bg-gradient-to-br from-[#ECEFF1] via-white to-slate-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200/60 bg-white/85 backdrop-blur shadow-2xl shadow-slate-300/40">
        <div className="flex flex-col gap-8 px-8 py-10 sm:px-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <Link to="/" className="flex items-center gap-3">
              <img src={Logo} alt="Hospital Polaco" className="h-14 w-auto" />
              <span className="text-xl font-semibold text-slate-600">Hospital Polaco</span>
            </Link>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Registrarse</h1>
              <p className="mt-2 text-sm text-slate-500">Completá tus datos para crear tu cuenta</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="nombre" className="text-sm font-medium text-slate-600">Nombre</label>
                <input
                  placeholder="Juan"
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-[#DC143C] focus:outline-none focus:ring-2 focus:ring-[#DC143C]/20 transition"
                  autoComplete="given-name"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="apellido" className="text-sm font-medium text-slate-600">Apellido</label>
                <input
                  placeholder="Perez"
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-[#DC143C] focus:outline-none focus:ring-2 focus:ring-[#DC143C]/20 transition"
                  autoComplete="family-name"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-600">Mail</label>
                <input
                  placeholder="ejemplo@gmail.com"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-[#DC143C] focus:outline-none focus:ring-2 focus:ring-[#DC143C]/20 transition"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="dni" className="text-sm font-medium text-slate-600">DNI</label>
                <input
                  placeholder="12345678"
                  type="text"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-[#DC143C] focus:outline-none focus:ring-2 focus:ring-[#DC143C]/20 transition"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-600">Contraseña</label>
                <input
                  placeholder="Ingresa tu contraseña"
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-[#DC143C] focus:outline-none focus:ring-2 focus:ring-[#DC143C]/20 transition"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-600">Confirmar Contraseña</label>
                <input
                  placeholder="Confirma tu contraseña"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-[#DC143C] focus:outline-none focus:ring-2 focus:ring-[#DC143C]/20 transition"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="telefono" className="text-sm font-medium text-slate-600">Teléfono</label>
                <input
                  placeholder="011 2230 4880"
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-[#DC143C] focus:outline-none focus:ring-2 focus:ring-[#DC143C]/20 transition"
                  autoComplete="tel"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="direccion" className="text-sm font-medium text-slate-600">Dirección</label>
                <input
                  placeholder="Calle 123, Ciudad"
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-[#DC143C] focus:outline-none focus:ring-2 focus:ring-[#DC143C]/20 transition"
                  autoComplete="street-address"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="fecha_nacimiento" className="text-sm font-medium text-slate-600">Fecha de Nacimiento</label>
                <input
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-[#DC143C] focus:outline-none focus:ring-2 focus:ring-[#DC143C]/20 transition"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="obra_social" className="text-sm font-medium text-slate-600">Obra Social</label>
                <input
                  placeholder="Obra social"
                  type="text"
                  id="obra_social"
                  name="obra_social"
                  value={formData.obra_social}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-[#DC143C] focus:outline-none focus:ring-2 focus:ring-[#DC143C]/20 transition"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="numero_afiliado" className="text-sm font-medium text-slate-600">Número de Afiliado</label>
                <input
                  placeholder="Número de afiliado"
                  type="text"
                  id="numero_afiliado"
                  name="numero_afiliado"
                  value={formData.numero_afiliado}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-[#DC143C] focus:outline-none focus:ring-2 focus:ring-[#DC143C]/20 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#DC143C] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#DC143C]/60 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#B22222] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <div className="rounded-2xl bg-slate-50 px-6 py-4 text-center text-sm text-slate-600">
            <p>
              ¿Ya tenés una cuenta?
              <Link to="/login" className="ml-2 font-semibold text-[#DC143C]">Iniciá sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Registro;