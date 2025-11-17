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
            setError('');
        } catch (error) {
            console.error('Error al cargar historial:', error);
            setError('No tenes historial medico para ver');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center">
                <div className="mt-10 px-6 py-4 text-sm font-medium text-slate-600 bg-white/80 backdrop-blur rounded-2xl shadow-md">
                    Cargando historial medico...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center">
                <div className="mt-10 px-6 py-4 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-2xl shadow-sm">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <main className="flex flex-col items-center min-h-[70vh] w-full bg-gradient-to-br from-slate-100 via-white to-slate-50 py-10">
            <section className="w-full max-w-4xl px-4 sm:px-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold text-slate-900">Mi Historial</h2>
                    <p className="mt-3 text-base text-slate-600">
                        Aca podes consultar tu historial de atencion medica. Si necesitas mas informacion, contactanos.
                    </p>
                </div>

                {historial.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur rounded-3xl shadow-lg shadow-slate-300/40 border border-slate-100 p-10 text-center">
                        <p className="text-slate-600 text-lg font-medium">No tenes historial medico registrado.</p>
                    </div>
                ) : (
                    <div className="bg-white/95 backdrop-blur rounded-3xl shadow-xl shadow-slate-300/30 border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-800 text-left">Detalle de atenciones</h3>
                        </div>
                        <div className="md:hidden px-6 py-5 space-y-4">
                            {historial.map((item) => (
                                <article
                                    key={item.id}
                                    className="rounded-2xl border border-slate-200 bg-white/70 shadow-md shadow-slate-200/40 p-4"
                                >
                                    <dl className="grid grid-cols-1 gap-y-3 text-sm">
                                        <div>
                                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fecha</dt>
                                            <dd className="mt-1 text-base font-medium text-slate-800">
                                                {new Date(item.fecha).toLocaleDateString('es-ES')}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Especialidad</dt>
                                            <dd className="mt-1 text-base text-slate-800">{item.especialidad}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Medico</dt>
                                            <dd className="mt-1 text-base text-slate-800">{item.medico}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Diagnostico</dt>
                                            <dd className="mt-1 text-base text-slate-600">
                                                {item.diagnostico || 'Sin diagnostico registrado'}
                                            </dd>
                                        </div>
                                    </dl>
                                </article>
                            ))}
                        </div>
                        <div className="hidden md:block">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Fecha</th>
                                            <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Especialidad</th>
                                            <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Medico</th>
                                            <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Diagnostico</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {historial.map((item) => (
                                            <tr key={item.id}>
                                                <td className="py-4 px-6 text-sm text-slate-800">
                                                    {new Date(item.fecha).toLocaleDateString('es-ES')}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-slate-800">
                                                    {item.especialidad}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-slate-800">
                                                    {item.medico}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-slate-600">
                                                    {item.diagnostico || 'Sin diagnostico registrado'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
};

export default MiHistorial;