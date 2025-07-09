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

    useEffect(() => {
        setCitas(citasData);
    }, []);

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
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
};

export default MisCitas;