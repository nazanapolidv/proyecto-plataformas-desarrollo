import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import SinAuth from "./SinAuth";
import userImg from "../assets/profile.png";

const MiPerfil = () => {
    const [profile, setProfile] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        fecha_nacimiento: '',
        dni: '',
        obra_social: '',
        numero_afiliado: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editing, setEditing] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await apiService.getProfile();
            setProfile({
                ...data,
                fecha_nacimiento: data.fecha_nacimiento ? data.fecha_nacimiento.split('T')[0] : ''
            });
        } catch (error) {
            setError('Error al cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            await apiService.updateProfile(profile);
            setSuccess('Perfil actualizado exitosamente');
            setEditing(false);
        } catch (error) {
            setError(error.response?.data?.error || 'Error al actualizar el perfil');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Cargando perfil...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <SinAuth />
        );
    }

    return (
        <main className="flex flex-col items-center min-h-[70vh] py-8 bg-gray-100">
            <section className="w-3/5 mx-auto">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="h-24 px-8 py-6 bg-gray-100 flex items-center justify-center">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center space-x-4">
                                <img 
                                    src={userImg} 
                                    className="w-20 h-20 object-cover"
                                    alt="Foto de perfil" 
                                />
                                <div>
                                    <h2 className="text-3xl font-bold text-black">Mi Perfil</h2>
                                    <p className="text-lg text-black">{profile.nombre} {profile.apellido}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mx-8 mt-6 p-4 rounded-lg bg-red-50 border border-red-200">
                            <p className="font-medium text-red-600">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mx-8 mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
                            <p className="font-medium text-green-600">{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium mb-2 text-gray-700">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={profile.nombre}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    required
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                                        editing ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                />
                            </div>

                            <div>
                                <label htmlFor="apellido" className="block text-sm font-medium mb-2 text-gray-700">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    id="apellido"
                                    name="apellido"
                                    value={profile.apellido}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    required
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                                        editing ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Email y DNI */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    required
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                                        editing ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                />
                            </div>

                            <div>
                                <label htmlFor="dni" className="block text-sm font-medium mb-2 text-gray-700">
                                    DNI
                                </label>
                                <input
                                    type="text"
                                    id="dni"
                                    name="dni"
                                    value={profile.dni}
                                    disabled={true}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-not-allowed bg-gray-100 text-gray-500"
                                />
                                <p className="text-xs mt-1 text-red-500">El DNI no puede ser modificado</p>
                            </div>
                        </div>

                        {/* Teléfono y Fecha de Nacimiento */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="telefono" className="block text-sm font-medium mb-2 text-gray-700">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    value={profile.telefono || ''}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                                        editing ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                />
                            </div>

                            <div>
                                <label htmlFor="fecha_nacimiento" className="block text-sm font-medium mb-2 text-gray-700">
                                    Fecha de Nacimiento
                                </label>
                                <input
                                    type="date"
                                    id="fecha_nacimiento"
                                    name="fecha_nacimiento"
                                    value={profile.fecha_nacimiento || ''}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                                        editing ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Dirección */}
                        <div>
                            <label htmlFor="direccion" className="block text-sm font-medium mb-2 text-gray-700">
                                Dirección
                            </label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                value={profile.direccion || ''}
                                onChange={handleChange}
                                disabled={!editing}
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                                    editing ? 'bg-white' : 'bg-gray-50'
                                }`}
                            />
                        </div>

                        {/* Obra Social */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="obra_social" className="block text-sm font-medium mb-2 text-gray-700">
                                    Obra Social
                                </label>
                                <input
                                    type="text"
                                    id="obra_social"
                                    name="obra_social"
                                    value={profile.obra_social || ''}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                                        editing ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                />
                            </div>

                            <div>
                                <label htmlFor="numero_afiliado" className="block text-sm font-medium mb-2 text-gray-700">
                                    Número de Afiliado
                                </label>
                                <input
                                    type="text"
                                    id="numero_afiliado"
                                    name="numero_afiliado"
                                    value={profile.numero_afiliado || ''}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                                        editing ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Botones de Guardar y Cancelar */}
                        {editing && (
                            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                                <button 
                                    type="button"
                                    className="px-6 py-2 font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setEditing(false)}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2 font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={saving}
                                >
                                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        )}
                    </form>
                    
                    {!editing && (
                        <div className="px-8 pb-8">
                            <button 
                                className="w-full px-6 py-3 font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                                onClick={() => setEditing(true)}
                            >
                                Editar Perfil
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default MiPerfil;