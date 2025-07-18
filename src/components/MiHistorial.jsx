import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';

const MiHistorial = () => {
    const { user } = useAuth();
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadHistorial();
    }, []);

    const loadHistorial = async () => {
        try {
            setLoading(true);
            const data = await apiService.getHistorial();
            setHistorial(data);
        } catch (error) {
            console.error('Error al cargar historial:', error);
            setError('No tenes historial medico para ver');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Cargando historial médico...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500 text-lg">{error}</div>
            </div>
        );
    }

    return (
        <main className="flex flex-col items-center min-h-[70vh] bg-gray-50 py-8">
            <section className="w-4/5 max-w-4xl">
                <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
                    Mi Historial Médico
                </h2>
                
                <p className="text-lg text-gray-600 mb-6 text-center">
                    Aquí podrás consultar tu historial de atención médica. Si necesitas más información, contáctanos.
                </p>

                {historial.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <p className="text-gray-500 text-lg">No tienes historial médico registrado.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Fecha</th>
                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Especialidad</th>
                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Médico</th>
                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Diagnóstico</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {historial.map((item) => (
                                    <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                                        <td className="py-4 px-6 text-sm text-gray-900">
                                            {new Date(item.fecha).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-900">
                                            {item.especialidad}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-900">
                                            {item.medico}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-900">
                                            {item.diagnostico || 'Sin diagnóstico registrado'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
};

export default MiHistorial;