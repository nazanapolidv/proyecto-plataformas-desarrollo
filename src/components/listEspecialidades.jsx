import React, { useState, useEffect } from 'react';
import especialidades from '../data/especializaciones.json';

const listEspecialidades = ({ onAdd }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', descripcion: '' });
  const [especialidadesList, setEspecialidadesList] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({ nombre: '', descripcion: '' });

  useEffect(() => {
    const savedData = localStorage.getItem('especialidades');
    if (savedData) {
      setEspecialidadesList(JSON.parse(savedData));
    } else {
      setEspecialidadesList(especialidades);
      localStorage.setItem('especialidades', JSON.stringify(especialidades));
    }
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem('especialidades', JSON.stringify(data));
  };

  const handleEdit = (especialidad) => {
    setEditingId(especialidad.id);
    setEditForm({ nombre: especialidad.nombre, descripcion: especialidad.descripcion });
  };

  const handleSave = (id) => {
    const updatedList = especialidadesList.map(esp => 
      esp.id === id ? { ...esp, ...editForm } : esp
    );
    setEspecialidadesList(updatedList);
    saveToLocalStorage(updatedList); 
    setEditingId(null);
    setEditForm({ nombre: '', descripcion: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta especialidad?')) {
      const updatedList = especialidadesList.filter(esp => esp.id !== id);
      setEspecialidadesList(updatedList);
      saveToLocalStorage(updatedList); 
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ nombre: '', descripcion: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleSaveAdd = () => {
    if (addForm.nombre && addForm.descripcion) {
      const newId = Math.max(...especialidadesList.map(esp => esp.id)) + 1;
      const newEspecialidad = {
        id: newId,
        nombre: addForm.nombre,
        descripcion: addForm.descripcion
      };
      const updatedList = [...especialidadesList, newEspecialidad];
      setEspecialidadesList(updatedList);
      saveToLocalStorage(updatedList);
      setIsAdding(false);
      setAddForm({ nombre: '', descripcion: '' });
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setAddForm({ nombre: '', descripcion: '' });
  };
  return (
    <div className="p-8 min-h-screen mt-10">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-[#DC143C] drop-shadow">
        Especialidades Médicas
      </h2>

      {/* Botón agregar */}
      <div className="mb-6 text-center">
        <button 
          onClick={handleAdd}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-900 transition cursor-pointer"
        >
          Agregar Especialidad
        </button>
      </div>

      {/* Formulario para agregar nueva especialidad */}
      {isAdding && (
        <div className="mb-8 bg-white shadow-lg rounded-2xl p-6 border border-indigo-100 max-w-md mx-auto">
          <h3 className="text-xl font-bold text-[#DC143C] mb-4">Nueva Especialidad</h3>
          <input
            type="text"
            name="nombre"
            value={addForm.nombre}
            onChange={handleAddInputChange}
            className="w-full text-lg font-bold text-[#DC143C] mb-3 border-2 border-gray-300 rounded px-3 py-2"
            placeholder="Nombre de la especialidad"
          />
          <textarea
            name="descripcion"
            value={addForm.descripcion}
            onChange={handleAddInputChange}
            className="w-full text-gray-600 text-base mb-4 border-2 border-gray-300 rounded px-3 py-2 resize-none"
            placeholder="Descripción"
            rows="4"
          />
          <div className="flex gap-3 justify-center">
            <button 
              onClick={handleSaveAdd}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium cursor-pointer"
            >
              Guardar
            </button>
            <button 
              onClick={handleCancelAdd}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {especialidadesList.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-2xl p-6 border border-indigo-100 hover:shadow-2xl transition-shadow flex flex-col"
          >
            {editingId === item.id ? (
              <>
                <input
                  type="text"
                  name="nombre"
                  value={editForm.nombre}
                  onChange={handleInputChange}
                  className="text-2xl font-bold text-[#DC143C] mb-3 border-2 border-gray-300 rounded px-2 py-1"
                  placeholder="Nombre de la especialidad"
                />
                <textarea
                  name="descripcion"
                  value={editForm.descripcion}
                  onChange={handleInputChange}
                  className="text-gray-600 text-base flex-1 mb-4 border-2 border-gray-300 rounded px-2 py-1 resize-none"
                  placeholder="Descripción"
                  rows="3"
                />
                <div className="flex gap-3 mt-auto">
                  <button 
                    onClick={() => handleSave(item.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium cursor-pointer"
                  >
                    Guardar
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-[#DC143C] mb-3">{item.nombre}</h3>
                <p className="text-gray-600 text-base flex-1 mb-4">{item.descripcion}</p>
                <div className="flex gap-3 mt-auto">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium cursor-pointer"
                  >
                    Eliminar
                  </button>
                  <button 
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 bg-[#005F73] text-white rounded-lg transition-colors font-medium cursor-pointer"
                  >
                    Editar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default listEspecialidades;
