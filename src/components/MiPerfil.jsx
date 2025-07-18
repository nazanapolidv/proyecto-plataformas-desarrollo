import { useState } from "react";
import "../css/Index.css";
import "../css/MiPerfil.css";
import userImg from "../assets/profile.png";
import { useAuth } from "../context/AuthContext";

const MiPerfil = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [newEmail, setNewEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEdit = () => {
        setIsEditing(true);
        setNewEmail(user.email);
        setError('');
    };

    const handleSave = async () => {
        if (!newEmail.trim()) {
            setError('El email no puede estar vacío');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await updateUser({ ...user, email: newEmail });
            setIsEditing(false);
            setError('');
        } catch (error) {
            setError('Error al actualizar el email. Puede que ya esté en uso.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewEmail(user.email);
        setError('');
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg">Cargando perfil...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex flex-col items-center mb-8">
                        <img 
                            src={userImg} 
                            alt="Perfil" 
                            className="w-32 h-32 rounded-full mb-4 border-4 border-[#DC143C]"
                        />
                        <h1 className="text-3xl font-bold text-gray-800">
                            {user.nombre} {user.apellido}
                        </h1>
                        <p className="text-gray-600 capitalize">{user.rol}</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {isEditing ? (
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                            <h3 className="text-lg font-semibold mb-4 text-blue-800">
                                Editar Correo Electrónico
                            </h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nuevo Email:
                                </label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button 
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Nombre:</h3>
                                <p className="text-gray-900">{user.nombre}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Apellido:</h3>
                                <p className="text-gray-900">{user.apellido}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">
                                    Correo Electrónico:
                                    <button 
                                        onClick={handleEdit}
                                        className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        ✏️
                                    </button>
                                </h3>
                                <p className="text-gray-900">{user.email}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Teléfono:</h3>
                                <p className="text-gray-900">{user.telefono || 'No especificado'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Tipo de Documento:</h3>
                                <p className="text-gray-900">{user.tipoDocumento || 'No especificado'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Número de Documento:</h3>
                                <p className="text-gray-900">{user.documento || 'No especificado'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Género:</h3>
                                <p className="text-gray-900">{user.genero || 'No especificado'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Fecha de Nacimiento:</h3>
                                <p className="text-gray-900">{user.fechaNacimiento || 'No especificado'}</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <button className="bg-[#DC143C] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer">
                            Editar Datos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiPerfil;