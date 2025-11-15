import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';

const MisCitas = () => {
    const { user } = useAuth();
    const [citas, setCitas] = useState([]);
    const [especializaciones, setEspecializaciones] = useState([]);
    const [medicosDisponibles, setMedicosDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const [selectedEspecializacion, setSelectedEspecializacion] = useState('');
    const [selectedMedico, setSelectedMedico] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [motivo, setMotivo] = useState('');

    useEffect(() => {
        loadCitas();
        loadEspecializaciones();
    }, []);

    const loadCitas = async () => {
        try {
            setLoading(true);
            const data = await apiService.getCitas();
            setCitas(data);
        } catch (error) {
            console.error('Error al cargar citas:', error);
            setError('No tenes citas programadas');
        } finally {
            setLoading(false);
        }
    };

    const loadEspecializaciones = async () => {
        try {
            const data = await apiService.getEspecializaciones();
            setEspecializaciones(data);
        } catch (error) {
            console.error('Error al cargar especializaciones:', error);
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

        if (!isDayValid(fecha)) {
            setError('El médico no atiende en el día seleccionado');
            return;
        }

        if (!isTimeValid(hora)) {
            setError('La hora seleccionada está fuera del horario de atención del médico');
            return;
        }

        setFormLoading(true);

        try {
            const citaData = {
                paciente_id: user.id,
                medico_id: parseInt(selectedMedico, 10),
                especializacion_id: parseInt(selectedEspecializacion, 10),
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
            setShowForm(false);

            await loadCitas();
        } catch (error) {
            console.error('Error al crear cita:', error);
            setError(error.response?.data?.error || 'Error al crear la cita');
        } finally {
            setFormLoading(false);
        }
    };

    const handleCancelCita = async (citaId) => {
        if (window.confirm('¿Estás seguro de cancelar esta cita?')) {
            try {
                await apiService.cancelCita(citaId);
                setSuccess('Cita cancelada exitosamente');
                await loadCitas();
            } catch (error) {
                console.error('Error al cancelar cita:', error);
                setError('Error al cancelar la cita');
            }
        }
    };

    const handleMedicoChange = (e) => {
        const medicoId = e.target.value;
        setSelectedMedico(medicoId);

        setFecha('');
        setHora('');
    };

    const getSelectedMedicoData = () => {
        return medicosDisponibles.find(medico => medico.id === parseInt(selectedMedico));
    };

    const getValidDates = () => {
        const medicoData = getSelectedMedicoData();
        if (!medicoData) return [];

        const diasAtencion = JSON.parse(medicoData.dias_atencion);
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const validDayIndices = diasAtencion.map(day => dayNames.indexOf(day));

        const validDates = [];
        const today = new Date();
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);

        for (let date = new Date(today); date <= maxDate; date.setDate(date.getDate() + 1)) {
            if (validDayIndices.includes(date.getDay())) {
                validDates.push(date.toISOString().split('T')[0]);
            }
        }

        return validDates;
    };

    const isDayValid = (date) => {
        const medicoData = getSelectedMedicoData();
        if (!medicoData) return false;

        const diasAtencion = JSON.parse(medicoData.dias_atencion);
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const selectedDay = dayNames[new Date(date + 'T00:00:00').getDay()];

        return diasAtencion.includes(selectedDay);
    };

    const isTimeValid = (time) => {
        const medicoData = getSelectedMedicoData();
        if (!medicoData) return false;

        const horarioInicio = medicoData.horario_inicio.substring(0, 5);
        const horarioFin = medicoData.horario_fin.substring(0, 5);

        return time >= horarioInicio && time <= horarioFin;
    };

    const getAvailableTimeSlots = () => {
        const medicoData = getSelectedMedicoData();
        if (!medicoData) return [];

        const horarioInicio = medicoData.horario_inicio.substring(0, 5);
        const horarioFin = medicoData.horario_fin.substring(0, 5);

        const slots = [];
        const start = new Date(`2000-01-01T${horarioInicio}:00`);
        const end = new Date(`2000-01-01T${horarioFin}:00`);

        for (let time = start; time <= end; time.setMinutes(time.getMinutes() + 30)) {
            const timeString = time.toTimeString().substring(0, 5);
            if (timeString !== horarioFin) {
                slots.push(timeString);
            }
        }

        return slots;
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        return maxDate.toISOString().split('T')[0];
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmada':
                return 'bg-green-100 text-green-800';
            case 'cancelada':
                return 'bg-red-100 text-red-800';
            case 'completada':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Cargando citas...</div>
            </div>
        );
    }

    return (
        <main className="flex flex-col items-center min-h-[70vh] bg-gray-50 py-8">
            <section className="w-4/5 max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-semibold text-gray-800">
                        Mis Citas Médicas
                    </h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        {showForm ? 'Cancelar' : 'Nueva Cita'}
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-600 font-medium">{success}</p>
                    </div>
                )}

                {showForm && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Agendar Nueva Cita</h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="especializacion" className="block text-sm font-medium text-gray-700 mb-2">
                                        Especialización
                                    </label>
                                    <select
                                        id="especializacion"
                                        value={selectedEspecializacion}
                                        onChange={handleEspecializacionChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="">Selecciona una especialización</option>
                                        {especializaciones.map((esp) => (
                                            <option key={esp.id} value={esp.id}>
                                                {esp.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="medico" className="block text-sm font-medium text-gray-700 mb-2">
                                        Médico
                                    </label>
                                    <select
                                        id="medico"
                                        value={selectedMedico}
                                        onChange={handleMedicoChange}
                                        required
                                        disabled={!selectedEspecializacion}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                                    >
                                        <option value="">Selecciona un médico</option>
                                        {medicosDisponibles.map((medico) => (
                                            <option key={medico.id} value={medico.id}>
                                                {medico.nombre} {medico.apellido}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedMedico && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            <p><strong>Horario:</strong> {getSelectedMedicoData()?.horario_inicio?.substring(0, 5)} - {getSelectedMedicoData()?.horario_fin?.substring(0, 5)}</p>
                                            <p><strong>Días:</strong> {JSON.parse(getSelectedMedicoData()?.dias_atencion || '[]').join(', ')}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha
                                    </label>
                                    <select
                                        id="fecha"
                                        value={fecha}
                                        onChange={(e) => {
                                            setFecha(e.target.value);
                                            setHora('');
                                        }}
                                        required
                                        disabled={!selectedMedico}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                                    >
                                        <option value="">Selecciona una fecha</option>
                                        {getValidDates().map((date) => {
                                            const dateObj = new Date(date + 'T00:00:00');
                                            const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                                            const dayName = dayNames[dateObj.getDay()];

                                            const day = dateObj.getDate();
                                            const month = dateObj.toLocaleDateString('es-ES', { month: 'long' });
                                            const year = dateObj.getFullYear();
                                            const formattedDate = `${dayName}, ${day} de ${month} de ${year}`;

                                            return (
                                                <option key={date} value={date}>
                                                    {formattedDate}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {selectedMedico && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            Solo se muestran fechas en las que el médico atiende
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="hora" className="block text-sm font-medium text-gray-700 mb-2">
                                        Hora
                                    </label>
                                    <select
                                        id="hora"
                                        value={hora}
                                        onChange={(e) => setHora(e.target.value)}
                                        required
                                        disabled={!selectedMedico || !fecha}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                                    >
                                        <option value="">Selecciona una hora</option>
                                        {getAvailableTimeSlots().map((timeSlot) => (
                                            <option key={timeSlot} value={timeSlot}>
                                                {timeSlot}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedMedico && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            Horarios disponibles cada 30 minutos
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-2">
                                    Motivo de la consulta
                                </label>
                                <textarea
                                    id="motivo"
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    rows="3"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Describe brevemente el motivo de tu consulta..."
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {formLoading ? 'Guardando...' : 'Agendar Cita'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {citas.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <p className="text-gray-500 text-lg">No tienes citas programadas.</p>
                        <p className="text-gray-400 mt-2">¡Agenda tu primera cita médica!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Citas Programadas</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Fecha</th>
                                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Hora</th>
                                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Especialidad</th>
                                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Médico</th>
                                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Motivo</th>
                                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Estado</th>
                                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {citas.map((cita) => (
                                        <tr key={cita.id} className="hover:bg-blue-50 transition-colors">
                                            <td className="py-4 px-6 text-sm text-gray-900">
                                                {new Date(cita.fecha).toLocaleDateString('es-ES')}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-900">
                                                {cita.hora}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-900">
                                                {cita.especializacion_nombre}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-900">
                                                {cita.medico_nombre} {cita.medico_apellido}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-900 max-w-xs truncate">
                                                {cita.motivo}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(cita.estado)}`}>
                                                    {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm">
                                                {cita.estado === 'pendiente' && (
                                                    <button
                                                        onClick={() => handleCancelCita(cita.id)}
                                                        className="text-red-600 hover:text-red-900 font-medium transition-colors"
                                                    >
                                                        Cancelar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
};

export default MisCitas;