import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Link } from 'react-router-dom';
import SinAuth from './SinAuth';
import calendarImg from '../assets/calendar.png';
import historialImg from '../assets/historial.png';
import profileImg from '../assets/profile.png';
import '../css/index.css';

const MiSalud = () => {
    const { user } = useAuth();
    const [especializaciones, setEspecializaciones] = useState([]);
    const [medicosDisponibles, setMedicosDisponibles] = useState([]);
    const [selectedEspecializacion, setSelectedEspecializacion] = useState('');
    const [selectedMedico, setSelectedMedico] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [motivo, setMotivo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadEspecializaciones();
    }, []);

    const loadEspecializaciones = async () => {
        try {
            const data = await apiService.getEspecializaciones();
            setEspecializaciones(data);
        } catch (error) {
            console.error('Error al cargar especializaciones:', error);
            setError('Error al cargar las especializaciones');
        }
    };

    const handleEspecializacionChange = async (e) => {
        const especializacionId = e.target.value;
        setSelectedEspecializacion(especializacionId);
        setSelectedMedico('');
        setMedicosDisponibles([]);

        if (especializacionId) {
            try {
                const medicos = await apiService.getMedicosByEspecializacion(especializacionId);
                setMedicosDisponibles(medicos);
            } catch (error) {
                console.error('Error al cargar médicos:', error);
                setError('Error al cargar los médicos');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const citaData = {
                medico_id: selectedMedico,
                especializacion_id: selectedEspecializacion,
                fecha,
                hora,
                motivo
            };

            await apiService.createCita(citaData);
            setSuccess('Cita creada exitosamente');

            setSelectedEspecializacion('');
            setSelectedMedico('');
            setFecha('');
            setHora('');
            setMotivo('');
            setMedicosDisponibles([]);
        } catch (error) {
            console.error('Error al crear cita:', error);
            setError(error.response?.data?.error || 'Error al crear la cita');
        } finally {
            setLoading(false);
        }
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <main className='flex flex-col items-center justify-center min-h-[70vh] w-full bg-slate-50 py-10'>
            {user?.rol === "paciente" ? (
                <>
                    <div className="text-center mb-10">
                        <h2 className="title text-3xl font-bold text-slate-900">Mi Salud</h2>
                        <h3 className="subtitle text-lg text-slate-600 mt-2">¡Hola, <b>{user ? user.nombre : ''}</b>!</h3>
                    </div>
                    <div className="w-full max-w-5xl px-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-slate-100 transition-transform duration-200 hover:-translate-y-1">
                                <Link className="flex flex-col items-center gap-4 p-6 text-center group" to="/mis-citas">
                                    <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center shadow-inner group-hover:bg-red-100 transition-colors">
                                        <img className="w-14 h-14 object-contain" src={calendarImg} alt="Citas" />
                                    </div>
                                    <div className="">
                                        <h3 className="text-xl font-semibold text-slate-900 group-hover:text-red-600 transition-colors">Mis citas</h3>
                                        <p className="mt-2 text-sm text-slate-600">Desde acá podes gestionar tus citas médicas</p>
                                    </div>
                                </Link>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-slate-100 transition-transform duration-200 hover:-translate-y-1">
                                <Link className="redireccion flex flex-col items-center gap-4 p-6 text-center group" to="/mi-historial">
                                    <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center shadow-inner group-hover:bg-red-100 transition-colors">
                                        <img className="w-14 h-14 object-contain" src={historialImg} alt="Historial" />
                                    </div>
                                    <div className="">
                                        <h3 className="text-xl font-semibold text-slate-900 group-hover:text-red-600 transition-colors">Mi historial</h3>
                                        <p className="mt-2 text-sm text-slate-600">
                                            Consultá tu historial de atención en nuestros centros médicos
                                        </p>
                                    </div>
                                </Link>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-slate-100 transition-transform duration-200 hover:-translate-y-1">
                                <Link className="redireccion flex flex-col items-center gap-4 p-6 text-center group" to="/mi-perfil">
                                    <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center shadow-inner group-hover:bg-red-100 transition-colors">
                                        <img className="w-14 h-14 object-contain" src={profileImg} alt="Perfil" />
                                    </div>
                                    <div className="">
                                        <h3 className="text-xl font-semibold text-slate-900 group-hover:text-red-600 transition-colors">Mi perfil</h3>
                                        <p className="mt-2 text-sm text-slate-600">Actualizá tu perfil</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <SinAuth />
            )}

        </main>
    );
};

export default MiSalud;