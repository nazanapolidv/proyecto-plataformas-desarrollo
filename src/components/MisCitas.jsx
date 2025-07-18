import { useEffect, useState } from "react";
import { citasService } from "../services/apiService";
import { useAuth } from "../context/AuthContext";

const MisCitas = () => {
    const { user } = useAuth();
    const [citas, setCitas] = useState([]);
    const [isAgendando, setIsAgendando] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [nuevaCita, setNuevaCita] = useState({
        fecha: '',
        especialidad: '',
        medico: '',
        hora: ''
    });

    useEffect(() => {
        if (user) {
            cargarCitas();
        }
    }, [user]);

    const cargarCitas = async () => {
        try {
            setLoading(true);
            const data = await citasService.obtenerTodos();
            // Filtrar citas del usuario actual
            const citasUsuario = data.filter(cita => 
                cita.paciente === `${user.nombre} ${user.apellido}` || 
                cita.paciente === user.email
            );
            setCitas(citasUsuario);
            setError('');
        } catch (error) {
            setError('Error al cargar las citas');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarTurno = async (citaId) => {
        if (window.confirm('¿Estás seguro de cancelar este turno?')) {
            try {
                await citasService.cancelar(citaId);
                await cargarCitas(); // Recargar citas
                setError('');
            } catch (error) {
                setError('Error al cancelar la cita');
                console.error('Error:', error);
            }
        }
    };

    const handleAgendarTurno = () => {
        setIsAgendando(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevaCita(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveAgenda = async () => {
        try {
            if (nuevaCita.fecha && nuevaCita.especialidad && nuevaCita.medico && nuevaCita.hora) {
                const fechaSeleccionada = new Date(nuevaCita.fecha);
                const diaSemana = fechaSeleccionada.getDay();
                const [hora, minutos] = nuevaCita.hora.split(':');
                const horaNum = parseInt(hora);

                if (diaSemana === 0 || diaSemana === 6) {
                    alert('Solo se pueden agendar turnos de lunes a viernes');
                    return;
                }

                if (horaNum < 9 || horaNum >= 18) {
                    alert('Solo se pueden agendar turnos de 9:00 a 18:00 horas');
                    return;
                }

                const citaData = {
                    fecha: nuevaCita.fecha,
                    hora: nuevaCita.hora,
                    paciente: `${user.nombre} ${user.apellido}`,
                    medico: nuevaCita.medico,
                    especialidad: nuevaCita.especialidad,
                    estado: 'Pendiente'
                };

                await citasService.crear(citaData);
                await cargarCitas(); // Recargar citas
                setNuevaCita({ fecha: '', especialidad: '', medico: '', hora: '' });
                setIsAgendando(false);
                setError('');
            } else {
                alert('Por favor completa todos los campos');
            }
        } catch (error) {
            setError('Error al crear la cita');
            console.error('Error:', error);
        }
    };

    const handleCancelAgenda = () => {
        setNuevaCita({ fecha: '', especialidad: '', medico: '', hora: '' });
        setIsAgendando(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Cargando citas...</div>
            </div>
        );
    }

    return (
        <main className="flex flex-col items-center h-[70vh] bg-gray-50">
            <section className="w-4/5 max-w-4xl">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Mis Citas</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                        {error}
                    </div>
                )}

                <div className="mb-6 text-center">
                    <button 
                        onClick={handleAgendarTurno}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                    >
                        Agendar Nuevo Turno
                    </button>
                </div>

                {isAgendando && (
                    <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-blue-800">Agendar Nuevo Turno</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha:</label>
                                <input
                                    type="date"
                                    name="fecha"
                                    value={nuevaCita.fecha}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hora:</label>
                                <input
                                    type="time"
                                    name="hora"
                                    value={nuevaCita.hora}
                                    onChange={handleInputChange}
                                    min="09:00"
                                    max="18:00"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad:</label>
                                <select
                                    name="especialidad"
                                    value={nuevaCita.especialidad}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Selecciona una especialidad</option>
                                    <option value="Cardiología">Cardiología</option>
                                    <option value="Dermatología">Dermatología</option>
                                    <option value="Pediatría">Pediatría</option>
                                    <option value="Ginecología">Ginecología</option>
                                    <option value="Neurología">Neurología</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Médico:</label>
                                <input
                                    type="text"
                                    name="medico"
                                    value={nuevaCita.medico}
                                    onChange={handleInputChange}
                                    placeholder="Nombre del médico"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-2">
                            <button 
                                onClick={handleSaveAgenda}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
                            >
                                Guardar Cita
                            </button>
                            <button 
                                onClick={handleCancelAgenda}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {citas.length > 0 ? (
                        citas.map((cita) => (
                            <div key={cita.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{cita.especialidad}</h3>
                                    <p className="text-gray-600"><strong>Fecha:</strong> {cita.fecha}</p>
                                    <p className="text-gray-600"><strong>Hora:</strong> {cita.hora}</p>
                                    <p className="text-gray-600"><strong>Médico:</strong> {cita.medico}</p>
                                    <p className="text-gray-600">
                                        <strong>Estado:</strong> 
                                        <span className={`ml-2 px-2 py-1 rounded text-sm ${
                                            cita.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                            cita.estado === 'Completada' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {cita.estado}
                                        </span>
                                    </p>
                                </div>
                                {cita.estado === 'Pendiente' && (
                                    <button 
                                        onClick={() => handleCancelarTurno(cita.id)}
                                        className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
                                    >
                                        Cancelar Turno
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg">No tienes citas programadas</p>
                            <p className="text-gray-400 mt-2">Haz clic en "Agendar Nuevo Turno" para programar una cita</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default MisCitas;