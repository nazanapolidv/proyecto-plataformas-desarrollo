import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/logo-removebg-preview.png';
import '../css/Index.css';
import '../css/Registro.css';

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
        <main>
      <div className="container_registro">
        <div className="main_image">
          <Link to="/home">
            <img
              src={Logo}
              alt="Hospital Polaco"
            />
          </Link>
        </div>
        <div className="form_group">
          <h1 className="title">Registrarse</h1>
        </div>
        <div className="container_form">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="form_group">
              <label htmlFor="nombre">Nombre</label>
              <input
                placeholder="Juan"
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form_group">
              <label htmlFor="apellido">Apellido</label>
              <input
                placeholder="Perez"
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form_group">
              <label htmlFor="email">Mail</label>
              <input
                placeholder="ejemplo@gmail.com"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form_group">
              <label htmlFor="dni">DNI</label>
              <input
                placeholder="12345678"
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form_row">
              <div className="form_group">
                <label htmlFor="password">Contraseña</label>
                <input
                  placeholder="Ingresa tu contraseña"
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form_group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  placeholder="Confirma tu contraseña"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form_group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                placeholder="011 2230 4880"
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="form_group">
              <label htmlFor="direccion">Dirección</label>
              <input
                placeholder="Calle 123, Ciudad"
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>

            <div className="form_group">
              <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
              <input
                type="date"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
              />
            </div>

            <div className="form_row">
              <div className="form_group">
                <label htmlFor="obra_social">Obra Social</label>
                <input
                  placeholder="Obra social"
                  type="text"
                  id="obra_social"
                  name="obra_social"
                  value={formData.obra_social}
                  onChange={handleChange}
                />
              </div>

              <div className="form_group">
                <label htmlFor="numero_afiliado">Número de Afiliado</label>
                <input
                  placeholder="Número de afiliado"
                  type="text"
                  id="numero_afiliado"
                  name="numero_afiliado"
                  value={formData.numero_afiliado}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="primary_button"
            >
                {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <div className="registro-links">
            <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
          </div>
        </div>
      </div>
    </main>
    );
}

export default Registro;