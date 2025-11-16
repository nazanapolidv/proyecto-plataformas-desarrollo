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
                console.error('Error al cargar medicos:', error);
                setError('Error al cargar los medicos');
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
        <main className="flex flex-col items-center min-h-[70vh] w-full bg-gradient-to-br from-slate-100 via-white to-slate-50 py-10">
            <section className="w-11/12 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                    <h2 className="text-3xl font-semibold text-slate-900">
                        Mis Citas Médicas
                    </h2>
                    {showForm ? null : (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white font-semibold px-3 py-1 rounded-full shadow-lg hover:bg-blue-700 cursor-pointer"
                    >
                        Nueva cita
                    </button>
                    )}
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
                    <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl shadow-slate-300/30 border border-slate-100 p-8 mb-10">
                        <h3 className="text-2xl font-semibold text-slate-900 mb-8">Agendar Nueva Cita</h3>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="especializacion" className="text-sm font-semibold text-slate-600">
                                        Especialización
                                    </label>
                                    <select
                                        id="especializacion"
                                        value={selectedEspecializacion}
                                        onChange={handleEspecializacionChange}
                                        required
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
                                    >
                                        <option value="">Seleccioná una especializacion</option>
                                        {especializaciones.map((esp) => (
                                            <option key={esp.id} value={esp.id}>
                                                {esp.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="medico" className="text-sm font-semibold text-slate-600">
                                        Médico
                                    </label>
                                    <select
                                        id="medico"
                                        value={selectedMedico}
                                        onChange={handleMedicoChange}
                                        required
                                        disabled={!selectedEspecializacion}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400 transition"
                                    >
                                        <option value="">Seleccioná un medico</option>
                                        {medicosDisponibles.map((medico) => (
                                            <option key={medico.id} value={medico.id}>
                                                {medico.nombre} {medico.apellido}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedMedico && (
                                        <div className="mt-2 text-xs font-medium text-slate-500 bg-slate-100/60 rounded-xl px-3 py-2 inline-flex flex-col gap-1">
                                            <p><strong>Horario:</strong> {getSelectedMedicoData()?.horario_inicio?.substring(0, 5)} - {getSelectedMedicoData()?.horario_fin?.substring(0, 5)}</p>
                                            <p><strong>Días:</strong> {JSON.parse(getSelectedMedicoData()?.dias_atencion || '[]').join(', ')}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="fecha" className="text-sm font-semibold text-slate-600">
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
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400 transition"
                                    >
                                        <option value="">Seleccioná una fecha</option>
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
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="hora" className="text-sm font-semibold text-slate-600">
                                        Hora
                                    </label>
                                    <select
                                        id="hora"
                                        value={hora}
                                        onChange={(e) => setHora(e.target.value)}
                                        required
                                        disabled={!selectedMedico || !fecha}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400 transition"
                                    >
                                        <option value="" className="p-3" >Seleccioná una hora</option>
                                        {getAvailableTimeSlots().map((timeSlot) => (
                                            <option key={timeSlot} value={timeSlot}>
                                                {timeSlot}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="motivo" className="text-sm font-semibold text-slate-600">
                                    Motivo de la consulta
                                </label>
                                <textarea
                                    id="motivo"
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    rows="3"
                                    required
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
                                    placeholder="Describe brevemente el motivo de tu consulta..."
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-sm font-semibold text-white shadow-md shadow-rose-200/60 cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-semibold text-white shadow-md shadow-emerald-200/70 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {formLoading ? 'Guardando...' : 'Agendar cita'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {citas.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl shadow-slate-300/30 border border-slate-100 p-10 text-center">
                        <p className="text-slate-600 text-lg font-medium">No tienes citas programadas.</p>
                        <p className="text-slate-400 mt-2">¡Agenda tu primera cita médica!</p>
                    </div>
                ) : (
                    <div className="bg-white/95 backdrop-blur rounded-3xl shadow-xl shadow-slate-300/30 border border-slate-100 overflow-hidden">
                        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-800">Citas Programadas</h3>
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
                                                        className="bg-red-600 text-white font-semibold px-3 py-1 rounded-full shadow-lg hover:bg-red-700 cursor-pointer"
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