import { useEffect, useState } from "react";
import historialData from "../data/historial.json";
import { useAuth } from "../context/AuthContext";

const MiHistorial = () => {
    const { user } = useAuth();

    return (
        <main className="flex flex-col items-center h-[70vh] bg-gray-50">
            <section className="w-4/5 max-w-3xl">
                <h2 className="text-2xl font-semibold text-center mb-8 text-black-700">Historial</h2>
                <p className="text-lg text-gray-700 mb-6 text-center">
                    Aquí podrás consultar tu historial de atención médica. Si necesitas más información, contactanos.
                </p>
                <table className="w-full bg-white rounded-xl shadow-sm border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-3 px-4 text-gray-700 font-medium text-center">Fecha</th>
                            <th className="py-3 px-4 text-gray-700 font-medium text-center">Especialidad</th>
                            <th className="py-3 px-4 text-gray-700 font-medium text-center">Médico</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historialData.map((item, idx) => (
                            <tr key={idx} className="border-t border-gray-100 hover:bg-blue-50 transition-colors">
                                <td className="py-2 px-4 text-center">{item.fecha}</td>
                                <td className="py-2 px-4 text-center">{item.especialidad}</td>
                                <td className="py-2 px-4 text-center">{item.medico}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );
}

export default MiHistorial;