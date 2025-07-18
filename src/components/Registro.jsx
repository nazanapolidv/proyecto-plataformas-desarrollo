import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuariosService } from '../services/apiService';
import Logo from '../assets/logo-removebg-preview.png';

const Registro = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        tipoDoc: '',
        documento: '',
        genero: '',
        fechaNacimiento: '',
        telefono: '',
        email: '',
        password: '',
        rol: 'paciente'
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validar que todos los campos estén completos
        const requiredFields = ['nombre', 'apellido', 'tipoDoc', 'documento', 'genero', 'fechaNacimiento', 'telefono', 'email', 'password'];
        const missingFields = requiredFields.filter(field => !formData[field].trim());

        if (missingFields.length > 0) {
            setError('Por favor, completa todos los campos obligatorios');
            return;
        }

        setLoading(true);

        try {
            // Verificar si el email ya existe
            const usuarios = await usuariosService.obtenerTodos();
            const emailExists = usuarios.some(u => u.email === formData.email);

            if (emailExists) {
                setError('Este email ya está registrado');
                return;
            }

            // Crear el usuario
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

            await usuariosService.crear(nuevoUsuario);
            
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
                password: '',
                rol: 'paciente'
            });

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Error al registrar usuario:', error);
            setError('Error al registrar el usuario. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <img src={Logo} alt="Hospital Polaco" className="w-24 h-24 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800">Registro</h1>
                </div>

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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DC143C] focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                                Apellido *
                            </label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DC143C] focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tipoDoc" className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Documento *
                            </label>
                            <select
                                id="tipoDoc"
                                name="tipoDoc"
                                value={formData.tipoDoc}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DC143C] focus:border-transparent"
                                required
                            >
                                <option value="">Selecciona un tipo</option>
                                <option value="DNI">DNI</option>
                                <option value="Pasaporte">Pasaporte</option>
                                <option value="Cedula">Cédula</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="documento" className="block text-sm font-medium text-gray-700 mb-2">
                                Número de Documento *
                            </label>
                            <input
                                type="text"
                                id="documento"
                                name="documento"
                                value={formData.documento}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DC143C] focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-2">
                                Género *
                            </label>
                            <select
                                id="genero"
                                name="genero"
                                value={formData.genero}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DC143C] focus:border-transparent"
                                required
                            >
                                <option value="">Selecciona un género</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha de Nacimiento *
                            </label>
                            <input
                                type="date"
                                id="fechaNacimiento"
                                name="fechaNacimiento"
                                value={formData.fechaNacimiento}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DC143C] focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                            Teléfono *
                        </label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DC143C] focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DC143C] focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña *
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DC143C] focus:border-transparent"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#DC143C] text-white py-3 px-4 rounded-md hover:bg-[#B8001F] focus:outline-none focus:ring-2 focus:ring-[#DC143C] focus:ring-offset-2 transition-colors font-medium disabled:opacity-50"
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        ¿Ya tienes una cuenta?{' '}
                        <a href="/login" className="text-[#DC143C] hover:underline font-medium">
                            Inicia sesión aquí
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registro;