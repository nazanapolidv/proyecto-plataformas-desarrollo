import { useState } from 'react';
import Logo from '../assets/logo-removebg-preview.png';
import '../css/Index.css';
import '../css/Registro.css';
import usuariosData from '../data/usuarios.json';

const Registro = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        tipoDoc: '',
        documento: '',
        genero: '',
        fechaNacimiento: '',
        telefono: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const requiredFields = ['nombre', 'apellido', 'tipoDoc', 'documento', 'genero', 'fechaNacimiento', 'telefono', 'email', 'password'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            setError('Por favor completa todos los campos');
            return;
        }

        const savedUsers = localStorage.getItem('usuarios');
        let usuarios = savedUsers ? JSON.parse(savedUsers) : usuariosData;

        const emailExists = usuarios.some(user => user.email === formData.email);
        if (emailExists) {
            setError('Ya existe un usuario con este email');
            return;
        }

        const nuevoUsuario = {
            email: formData.email,
            password: formData.password,
            rol: 'paciente',
            nombre: formData.nombre,
            apellido: formData.apellido,
            tipoDocumento: formData.tipoDoc,
            documento: formData.documento,
            genero: formData.genero,
            fechaNacimiento: formData.fechaNacimiento,
            telefono: formData.telefono
        };

        usuarios.push(nuevoUsuario);

        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        setSuccess('Usuario registrado exitosamente');
        
        setFormData({
            nombre: '',
            apellido: '',
            tipoDoc: '',
            documento: '',
            genero: '',
            fechaNacimiento: '',
            telefono: '',
            email: '',
            password: ''
        });
    };
    return (
        <main>
      <div className="container_registro">
        <div className="main_image">
          <a href="/home">
            <img
              src={Logo}
              alt="Hospital Polaco"
            />
          </a>
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
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}
            
            <div className="form_group">
              <label htmlFor="name">Nombre</label>
              <input
                placeholder="Juan"
                type="text"
                id="name"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form_group">
              <label htmlFor="tipo-doc">Tipo de documento</label>
              <select 
                name="tipoDoc" 
                id="tipo-doc" 
                value={formData.tipoDoc}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                <option value="dni">DNI</option>
                <option value="pasaporte">Pasaporte</option>
                <option value="cedula">Cédula de identidad</option>
              </select>
            </div>

            <div className="form_group">
              <label htmlFor="documento">Numero de documento</label>
              <input
                placeholder="12345678"
                type="number"
                id="documento"
                name="documento"
                value={formData.documento}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form_group">
              <label htmlFor="genero">Genero</label>
              <select 
                name="genero" 
                id="genero" 
                value={formData.genero}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="no-binario">No binario</option>
              </select>
            </div>

            <div className="form_group">
              <label htmlFor="date">Fecha de nacimiento</label>
              <input 
                type="date" 
                id="date" 
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="form_group">
              <label htmlFor="tel">Celular</label>
              <input
                placeholder="011 2230 4880"
                type="tel"
                id="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form_group">
              <label htmlFor="password">Contraseña</label>
              <input
                placeholder="Ingresa tu contraseña"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="primary_button">Registrarse</button>
          </form>
        </div>
      </div>
    </main>
    );
}
export default Registro;