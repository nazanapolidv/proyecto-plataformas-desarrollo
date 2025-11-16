import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Link } from 'react-router-dom';
import SinAuth from './SinAuth';
import calendarImg from '../assets/calendar.png';
import historialImg from '../assets/historial.png';
import profileImg from '../assets/profile.png';
import '../css/index.css';
import '../css/MiSalud.css';

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
        <main className='flex flex-col items-center justify-center h-[70vh] m-auto'>
            {user?.rol === "paciente" ? (
                <>
                    <div>
                        <h2 className="title">Mi Salud</h2>
                        <h3 className="subtitle">¡Hola, <b>{user ? user.nombre : ''}</b>!</h3>
                    </div>
                    <div className="container_mi_salud">
                        <div className="card_container ">
                            <div className="card">
                                <Link className="redireccion" to="/mis-citas">
                                    <div className="card_image_container">
                                        <img src={calendarImg} alt="Citas" />
                                    </div>
                                    <div className="card-content">
                                        <h3>Mis citas</h3>
                                        <p>Desde acá podes gestionar tus citas médicas</p>
                                    </div>
                                </Link>
                            </div>
                            <div className="card">
                                <Link className="redireccion" to="/mi-historial">
                                    <div className="card_image_container">
                                        <img src={historialImg} alt="Historial" />
                                    </div>
                                    <div className="card-content">
                                        <h3>Mi historial</h3>
                                        <p>
                                            Consultá tu historial de atención en nuestros centros médicos
                                        </p>
                                    </div>
                                </Link>
                            </div>
                            <div className="card">
                                <Link className="redireccion" to="/mi-perfil">
                                    <div className="card_image_container">
                                        <img src={profileImg} alt="Perfil" />
                                    </div>
                                    <div className="card-content">
                                        <h3>Mi perfil</h3>
                                        <p>Actualizá tu perfil</p>
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