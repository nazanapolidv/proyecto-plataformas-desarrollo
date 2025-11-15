import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService.js';

const listEspecialidades = () => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', descripcion: '' });
  const [especialidadesList, setEspecialidadesList] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({ nombre: '', descripcion: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  const cargarEspecialidades = async () => {
    try {
      setLoading(true);
      const data = await apiService.obtenerTodos();
      setEspecialidadesList(data);
      setError('');
    } catch (error) {
      setError('Error al cargar las especializaciones');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (especialidad) => {
    setEditingId(especialidad.id);
    setEditForm({ nombre: especialidad.nombre, descripcion: especialidad.descripcion });
  };

  const handleSave = async (id) => {
    try {
      if (editForm.nombre && editForm.descripcion) {
        await apiService.actualizar(id, editForm);
        await cargarEspecialidades();
        setEditingId(null);
        setEditForm({ nombre: '', descripcion: '' });
        setError('');
      } else {
        setError('Todos los campos son obligatorios');
      }
    } catch (error) {
      setError('Error al actualizar la especialización');
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ nombre: '', descripcion: '' });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta especialización?')) {
      try {
        await apiService.eliminar(id);
        await cargarEspecialidades();
        setError('');
      } catch (error) {
        setError('Error al eliminar la especialización');
        console.error('Error:', error);
      }
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setAddForm({ nombre: '', descripcion: '' });
    setError('');
  };

  const handleSaveAdd = async () => {
    try {
      if (addForm.nombre && addForm.descripcion) {
        await apiService.crear(addForm);
        await cargarEspecialidades();
        setAddForm({ nombre: '', descripcion: '' });
        setIsAdding(false);
        setError('');
      } else {
        setError('Todos los campos son obligatorios');
      }
    } catch (error) {
      setError('Error al crear la especialización');
      console.error('Error:', error);
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setAddForm({ nombre: '', descripcion: '' });
    setError('');
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando especialidades...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 w-full">
      <div className="w-4/5 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-[#DC143C] drop-shadow">
          Especialidades Médicas
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            {error}
          </div>
        )}

        <div className="mb-6 text-center">
          <button 
            onClick={handleAdd}
            className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-900 transition cursor-pointer"
          >
            Agregar Especialidad
          </button>
        </div>

        {isAdding && (
          <div className="max-w-2xl mx-auto mb-8 bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-green-800">Agregar Nueva Especialidad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={addForm.nombre}
                  onChange={handleAddInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: Cardiología"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
                <textarea
                  name="descripcion"
                  value={addForm.descripcion}
                  onChange={handleAddInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  placeholder="Descripción de la especialidad"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button 
                onClick={handleSaveAdd}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
              >
                Guardar
              </button>
              <button 
                onClick={handleCancelAdd}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {especialidadesList.map((especialidad) => (
            <div key={especialidad.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              {editingId === especialidad.id ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
                    <input
                      type="text"
                      name="nombre"
                      value={editForm.nombre}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
                    <textarea
                      name="descripcion"
                      value={editForm.descripcion}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSave(especialidad.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{especialidad.nombre}</h3>
                  <p className="text-gray-600 mb-4">{especialidad.descripcion}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(especialidad)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(especialidad.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default listEspecialidades;
