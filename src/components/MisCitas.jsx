import { useEffect, useState } from "react";
import citasData from "../data/citas.json";
import SinAuth from "./SinAuth";

const MisCitas = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return (
            <SinAuth />
        );
    }
    const [citas, setCitas] = useState([]);
    const [isAgendando, setIsAgendando] = useState(false);
    const [nuevaCita, setNuevaCita] = useState({
        fecha: '',
        especialidad: '',
        medico: ''
    });

    useEffect(() => {
        const savedCitas = localStorage.getItem('citas');
        if (savedCitas) {
            setCitas(JSON.parse(savedCitas));
        } else {
            setCitas(citasData);
            localStorage.setItem('citas', JSON.stringify(citasData));
        }
    }, []);

    const saveCitasToLocalStorage = (citasData) => {
        localStorage.setItem('citas', JSON.stringify(citasData));
    };

    const handleCancelarTurno = (index) => {
        if (window.confirm('¿Estás seguro de cancelar este turno?')) {
            const citasActualizadas = citas.filter((_, idx) => idx !== index);
            setCitas(citasActualizadas);
            saveCitasToLocalStorage(citasActualizadas);
        }
    };

    const handleAgendarTurno = () => {
        setIsAgendando(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevaCita(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveAgenda = () => {
        if (nuevaCita.fecha && nuevaCita.especialidad && nuevaCita.medico) {
            const fechaSeleccionada = new Date(nuevaCita.fecha);
            const diaSemana = fechaSeleccionada.getDay();
            const hora = fechaSeleccionada.getHours();

            if (diaSemana === 0 || diaSemana === 6) {
                alert('Solo se pueden agendar turnos de lunes a viernes');
                return;
            }

            if (hora < 9 || hora >= 18) {
                alert('Solo se pueden agendar turnos de 9:00 a 18:00 horas');
                return;
            }

            const citasActualizadas = [...citas, nuevaCita];
            setCitas(citasActualizadas);
            saveCitasToLocalStorage(citasActualizadas);
            setIsAgendando(false);
            setNuevaCita({ fecha: '', especialidad: '', medico: '' });
        } else {
            alert('Por favor completa todos los campos');
        }
    };

    const handleCancelAgenda = () => {
        setIsAgendando(false);
        setNuevaCita({ fecha: '', especialidad: '', medico: '' });
    };

    return (
        <main className="w-full p-6 min-h-screen">
            <div className=" flex flex-col items-center justify-center" style={{ marginLeft: "100px", marginRight: "100px" }}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Próximos Turnos</h2>
                <div className="w-full grid gap-6">
                    {citas.length === 0 ? (
                        <p className="text-gray-500 text-center">No tenés turnos próximos.</p>
                    ) : (
                        citas.map((cita, idx) => (
                            <div
                                key={idx}
                                className="bg-white shadow rounded-lg p-5 flex flex-col gap-2 border border-gray-100"
                            >
                                <h3 className="text-lg font-semibold text-[#DC143C]">{cita.fecha}</h3>
                                <p className="text-gray-700">{cita.especialidad}</p>
                                <p className="text-gray-500">{cita.medico}</p>
                                <button 
                                    onClick={() => handleCancelarTurno(idx)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium cursor-pointer w-[150px]"
                                >
                                    Cancelar turno
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {isAgendando && (
                    <div className="w-full bg-white shadow-lg rounded-lg p-6 border border-gray-100 mt-6">
                        <h3 className="text-xl font-bold text-[#DC143C] mb-4 text-center">Agendar Nuevo Turno</h3>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Fecha y Hora</label>
                                <input
                                    type="datetime-local"
                                    name="fecha"
                                    value={nuevaCita.fecha}
                                    onChange={handleInputChange}
                                    className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:border-[#DC143C] focus:outline-none"
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    * Solo lunes a viernes de 9:00 a 18:00 hs
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Especialidad</label>
                                <input
                                    type="text"
                                    name="especialidad"
                                    value={nuevaCita.especialidad}
                                    onChange={handleInputChange}
                                    className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:border-[#DC143C] focus:outline-none"
                                    placeholder="Ej: Cardiología, Neurología"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Médico</label>
                                <input
                                    type="text"
                                    name="medico"
                                    value={nuevaCita.medico}
                                    onChange={handleInputChange}
                                    className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:border-[#DC143C] focus:outline-none"
                                    placeholder="Ej: Dr. Juan Pérez"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 justify-center mt-6">
                            <button
                                onClick={handleSaveAgenda}
                                className="bg-green-500 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full hover:shadow-lg transition-shadow cursor-pointer w-[120px]"
                            >
                                Confirmar Turno
                            </button>
                            <button
                                onClick={handleCancelAgenda}
                                className="bg-gray-500 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full hover:shadow-lg transition-shadow cursor-pointer w-[120px]"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={handleAgendarTurno}
                        className="bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full hover:shadow-lg transition-shadow cursor-pointer w-[150px]"
                    >
                        Agendar turno
                    </button>
                </div>
            </div>
        </main>
    );
};

export default MisCitas;