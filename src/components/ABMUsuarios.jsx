import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService.js';

const ABMUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [editingUser, setEditingUser] = useState(null);

    // Form nuevo usuario
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        dni: '',
        telefono: '',
        rol: 'admin',
        // campos medico
        especializacion_id: '',
        matricula: '',
        horario_inicio: '09:00',
        horario_fin: '17:00',
        dias_atencion: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
    });

    const [editEmail, setEditEmail] = useState('');
    const [especializaciones, setEspecializaciones] = useState([]);

    useEffect(() => {
        loadUsuarios();
        loadEspecializaciones();
    }, []);

    const loadUsuarios = async () => {
        try {
            setLoading(true);
            const data = await apiService.getAllUsers();
            setUsuarios(data);
            setError('');
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError('Error al cargar la lista de usuarios');
        } finally {
            setLoading(false);
        }
    };

    const loadEspecializaciones = async () => {
        try {
            const data = await apiService.getEspecializaciones();
            console.log('Especializaciones cargadas:', data);
            setEspecializaciones(data);
        } catch (err) {
            console.error('Error al cargar especializaciones:', err);
        }
    };

    const handleOpenEdit = (user) => {
        setModalMode('edit');
        setEditingUser(user);
        setEditEmail(user.email);
        setShowModal(true);
    };

    const handleOpenCreate = () => {
        setModalMode('create');
        setEditingUser(null);
        setFormData({
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            dni: '',
            telefono: '',
            rol: 'admin',
            especializacion_id: '',
            matricula: '',
            horario_inicio: '09:00',
            horario_fin: '17:00',
            dias_atencion: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setEditEmail('');
    };

    const handleSaveEmail = async () => {
        if (!editEmail.trim()) {
            setError('El email no puede estar vacío');
            return;
        }
        try {
            await apiService.updateUser(editingUser.id, { email: editEmail });
            setSuccess('Email actualizado correctamente');
            handleCloseModal();
            loadUsuarios();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error al actualizar email:', err);
            setError(err.response?.data?.error || 'Error al actualizar el email');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');

        // validaciones
        if (!formData.nombre || !formData.apellido || !formData.email || !formData.password || !formData.dni) {
            setError('Todos los campos obligatorios deben completarse');
            return;
        }

        if (formData.rol === 'medico') {
            const especId = formData.especializacion_id;
            const matriculaVal = formData.matricula?.trim();

            console.log('Validando médico - especId:', especId, 'matricula:', matriculaVal);

            if (!especId || especId === '') {
                setError('Debe seleccionar una especialización para el médico');
                return;
            }
            if (!matriculaVal) {
                setError('Debe ingresar la matrícula del médico');
                return;
            }
        }

        try {
            const dataToSend = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                password: formData.password,
                dni: formData.dni,
                telefono: formData.telefono,
                rol: formData.rol
            };

            if (formData.rol === 'medico') {
                dataToSend.especializacion_id = parseInt(formData.especializacion_id);
                dataToSend.matricula = formData.matricula;
                dataToSend.horario_inicio = formData.horario_inicio;
                dataToSend.horario_fin = formData.horario_fin;
                dataToSend.dias_atencion = JSON.stringify(formData.dias_atencion);
            }

            await apiService.createAdminUser(dataToSend);
            setSuccess(`Usuario ${formData.rol === 'admin' ? 'administrador' : 'médico'} creado exitosamente`);
            handleCloseModal();
            loadUsuarios();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error al crear usuario:', err);
            setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Error al crear el usuario');
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getRolBadge = (rol) => {
        switch (rol) {
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            case 'medico':
                return 'bg-blue-100 text-blue-800';
            case 'paciente':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="px-6 py-4 text-sm font-medium text-slate-600 bg-white/80 backdrop-blur rounded-2xl shadow-md">
                    Cargando usuarios...
                </div>
            </div>
        );
    }

    return (
        <main className="flex flex-col items-center min-h-[70vh] w-full bg-gradient-to-br from-slate-100 via-white to-slate-50 py-10">
            <section className="w-full max-w-6xl px-4 sm:px-6">
                <div className="w-4/5 max-w-7xl mx-auto">
                    <h2 className="text-4xl font-extrabold mb-10 text-center text-[#DC143C] drop-shadow">
                        Gestión de usuarios
                    </h2>
                </div>
                <div className="mb-6 text-center">
                    <button
                        onClick={handleOpenCreate}
                        className="bg-green-600 text-white font-semibold px-8 py-3 p-3 rounded-full shadow-lg hover:bg-green-700 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    >
                        Agregar Usuario
                    </button>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
                        {success}
                    </div>
                )}

                {/* Mobile */}
                <div className="md:hidden space-y-4">
                    {usuarios.map((user) => (
                        <article key={user.id} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-md">
                            <div className="flex items-center justify-between mb-3">
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getRolBadge(user.rol)}`}>
                                    {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
                                </span>
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${user.estado === 'activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                    {user.estado}
                                </span>
                            </div>
                            <p className="font-semibold text-slate-800">{user.nombre} {user.apellido}</p>
                            <p className="text-sm text-slate-500 mt-1">{user.email}</p>
                            <p className="text-xs text-slate-400 mt-1">DNI: {user.dni}</p>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleOpenEdit(user)}
                                    className="flex-1 rounded-full bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-600"
                                >
                                    Editar
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Desk */}
                <div className="hidden md:block rounded-3xl border border-slate-100 bg-white/95 shadow-xl shadow-slate-300/30 backdrop-blur overflow-hidden">
                    <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                        <h3 className="text-lg font-semibold text-slate-800">Lista de Usuarios</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Nombre</th>
                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Email</th>
                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">DNI</th>
                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Rol</th>
                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Estado</th>
                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {usuarios.map((user) => (
                                    <tr key={user.id} className="transition-colors hover:bg-slate-50/60">
                                        <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                                            {user.nombre} {user.apellido}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{user.dni}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getRolBadge(user.rol)}`}>
                                                {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${user.estado === 'activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.estado}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => handleOpenEdit(user)}
                                                className="rounded-full bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-600"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
                            <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                                {modalMode === 'edit' ? 'Editar' : 'Crear Usuario'}
                            </h3>

                            {modalMode === 'edit' ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-2">
                                            Usuario: {editingUser?.nombre} {editingUser?.apellido}
                                        </label>
                                        <input
                                            type="email"
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                            placeholder="nuevo@email.com"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Estado del usuario</p>
                                            <p className="text-xs text-slate-500">
                                                Actualmente: <span className={`font-semibold ${editingUser?.estado === 'activo' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {editingUser?.estado}
                                                </span>
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                const nuevoEstado = editingUser?.estado === 'activo' ? 'inactivo' : 'activo';
                                                try {
                                                    await apiService.updateUser(editingUser.id, { estado: nuevoEstado });
                                                    setSuccess(`Usuario ${nuevoEstado === 'activo' ? 'habilitado' : 'deshabilitado'} correctamente`);
                                                    setEditingUser({ ...editingUser, estado: nuevoEstado });
                                                    loadUsuarios();
                                                    setTimeout(() => setSuccess(''), 3000);
                                                } catch (err) {
                                                    setError('Error al cambiar el estado');
                                                    setTimeout(() => setError(''), 3000);
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-full text-xs font-semibold text-white transition ${editingUser?.estado === 'activo'
                                                ? 'bg-red-500 hover:bg-red-600'
                                                : 'bg-emerald-500 hover:bg-emerald-600'
                                                }`}
                                        >
                                            {editingUser?.estado === 'activo' ? 'Deshabilitar' : 'Habilitar'}
                                        </button>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={handleCloseModal}
                                            className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSaveEmail}
                                            className="flex-1 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleCreateUser} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-600 mb-1">Nombre *</label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleFormChange}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-600 mb-1">Apellido *</label>
                                            <input
                                                type="text"
                                                name="apellido"
                                                value={formData.apellido}
                                                onChange={handleFormChange}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-600 mb-1">Contraseña *</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleFormChange}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-600 mb-1">DNI *</label>
                                            <input
                                                type="text"
                                                name="dni"
                                                value={formData.dni}
                                                onChange={handleFormChange}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-600 mb-1">Teléfono</label>
                                            <input
                                                type="text"
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleFormChange}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-600 mb-1">Rol *</label>
                                            <select
                                                name="rol"
                                                value={formData.rol}
                                                onChange={handleFormChange}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                            >
                                                <option value="admin">Administrador</option>
                                                <option value="medico">Médico</option>
                                            </select>
                                        </div>
                                    </div>

                                    {formData.rol === 'medico' && (
                                        <div className="space-y-4 pt-4 border-t border-slate-200">
                                            <h4 className="text-sm font-semibold text-slate-700">Datos del Médico</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-600 mb-1">Especialización *</label>
                                                    <select
                                                        name="especializacion_id"
                                                        value={formData.especializacion_id}
                                                        onChange={handleFormChange}
                                                        required
                                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        {especializaciones.map((esp) => (
                                                            <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-600 mb-1">Matrícula *</label>
                                                    <input
                                                        type="text"
                                                        name="matricula"
                                                        value={formData.matricula}
                                                        onChange={handleFormChange}
                                                        required
                                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-600 mb-1">Horario Inicio</label>
                                                    <input
                                                        type="time"
                                                        name="horario_inicio"
                                                        value={formData.horario_inicio}
                                                        onChange={handleFormChange}
                                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-600 mb-1">Horario Fin</label>
                                                    <input
                                                        type="time"
                                                        name="horario_fin"
                                                        value={formData.horario_fin}
                                                        onChange={handleFormChange}
                                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                                        >
                                            Crear Usuario
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
};

export default ABMUsuarios;

