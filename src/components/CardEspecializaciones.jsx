import React, { useState, useEffect } from "react";
import '../css/index.css';
import '../css/cardEspecializaciones.css';
import { apiService } from '../services/apiService.js';

// Imágenes para especialidades (mantenemos el sistema actual)
const images = import.meta.glob('../assets/*.png', { eager: true, import: 'default' });

// Mapa de imágenes por defecto para cada especialidad
const especialidadImageMap = {
  'Cardiología': 'cardio.png',
  'Dermatología': 'dermatologia.png',
  'Pediatría': 'pediatria.png',
  'Neurología': 'neurologia.png',
  'Ginecología': 'ginecologia.png',
  'Traumatología': 'traumatologia.png',
  // Imagen por defecto para cualquier otra especialidad
  'default': 'medicina-general.png'
};

const CardEspecializaciones = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const cargarEspecialidades = async () => {
      try {
        const response = await apiService.get('/especializaciones');
        setEspecialidades(response.data);
      } catch (error) {
        console.error('Error al cargar especialidades:', error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarEspecialidades();
  }, []);

  // Función para obtener la imagen adecuada
  const getImageForEspecialidad = (nombre) => {
    const imgName = especialidadImageMap[nombre] || especialidadImageMap.default;
    return images[`../assets/${imgName}`] || null;
  };

  if (loading) {
    return <div className="text-center my-4">Cargando especialidades...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {especialidades.length > 0 ? (
        especialidades.map(esp => (
          <div key={esp.id} className="cardEspecializaciones">
            <img 
              src={getImageForEspecialidad(esp.nombre)} 
              alt={`Imagen de ${esp.nombre}`} 
              onError={(e) => {
                e.target.src = images['../assets/medicina-general.png'];
                e.target.onerror = null;
              }}
            />
            <div className="card-especializacion-content">
              <h3>{esp.nombre}</h3>
              <p>{esp.descripcion || 'Sin descripción disponible'}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-3 text-center">
          No hay especialidades disponibles en este momento.
        </div>
      )}
    </div>
  );
};

export default CardEspecializaciones;