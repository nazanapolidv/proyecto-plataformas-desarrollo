import React, { useState, useEffect } from "react";
import '../css/index.css';
import { apiService } from '../services/apiService.js';

const images = import.meta.glob('../assets/*.png', { eager: true, import: 'default' });

const especialidadImageMap = {
  'Cardiología': 'cardiologia.png',
  'Dermatología': 'dermatologia.png',
  'Pediatría': 'estetoscopio.png',
  'Neurología': 'neurologia.png',
  'Ginecología': 'ginecologia.png',
  'Traumatología': 'traumatologia.png',
  'default': 'logo.png'
};

const CardEspecializaciones = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEspecialidades = async () => {
      try {
        const especialidadesArray = await apiService.getEspecializaciones();
        setEspecialidades(especialidadesArray);
      } catch (error) {
        console.error('Error al cargar especialidades:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarEspecialidades();
  }, []);

  const getImageForEspecialidad = (nombre) => {
    const imgName = especialidadImageMap[nombre] || especialidadImageMap.default;
    console.log(imgName)
    return images[`../assets/${imgName}`] || null;
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="px-6 py-4 mt-6 text-sm font-medium text-slate-600 bg-white/80 backdrop-blur rounded-2xl shadow-md">
          Cargando especialidades...
        </div>
      </div>
    );
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {especialidades.length > 0 ? (
          especialidades.map((esp) => (
            <article
              key={esp.id}
              className="flex flex-col items-center gap-4 rounded-3xl bg-white/90 backdrop-blur shadow-lg shadow-slate-300/30 border border-slate-100 p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-red-50 flex items-center justify-center shadow-inner">
                <img
                  className="w-16 h-16 object-contain"
                  src={getImageForEspecialidad(esp.nombre)}
                  alt={`Imagen de ${esp.nombre}`}
                />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">{esp.nombre}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {esp.descripcion || 'Sin descripción disponible'}
                </p>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full flex justify-center">
            <div className="px-6 py-5 text-center text-slate-500 bg-white/80 backdrop-blur rounded-3xl shadow-md border border-slate-100 w-full sm:w-3/4">
              No hay especialidades disponibles en este momento.
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CardEspecializaciones;