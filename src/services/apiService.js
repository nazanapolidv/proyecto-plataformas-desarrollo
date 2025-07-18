const API_BASE_URL = 'http://localhost:3001/api';

// Función auxiliar para hacer peticiones HTTP
const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error en la petición');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en la petición:', error);
    throw error;
  }
};

// Servicios para usuarios
export const usuariosService = {
  obtenerTodos: () => request('/usuarios'),
  
  login: (email, password) => request('/usuarios/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  crear: (userData) => request('/usuarios', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  actualizar: (email, userData) => request(`/usuarios/${email}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  eliminar: (email) => request(`/usuarios/${email}`, {
    method: 'DELETE',
  }),
};

// Servicios para especializaciones
export const especializacionesService = {
  obtenerTodos: () => request('/especializaciones'),
  
  crear: (especializacion) => request('/especializaciones', {
    method: 'POST',
    body: JSON.stringify(especializacion),
  }),
  
  actualizar: (id, especializacion) => request(`/especializaciones/${id}`, {
    method: 'PUT',
    body: JSON.stringify(especializacion),
  }),
  
  eliminar: (id) => request(`/especializaciones/${id}`, {
    method: 'DELETE',
  }),
};

// Servicios para citas
export const citasService = {
  obtenerTodos: () => request('/citas'),
  
  crear: (cita) => request('/citas', {
    method: 'POST',
    body: JSON.stringify(cita),
  }),
  
  actualizar: (id, cita) => request(`/citas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cita),
  }),
  
  eliminar: (id) => request(`/citas/${id}`, {
    method: 'DELETE',
  }),
  
  cancelar: (id) => request(`/citas/${id}/cancelar`, {
    method: 'PUT',
  }),
};

// Servicios para historial
export const historialService = {
  obtenerTodos: () => request('/historial'),
  
  crear: (historial) => request('/historial', {
    method: 'POST',
    body: JSON.stringify(historial),
  }),
  
  actualizar: (id, historial) => request(`/historial/${id}`, {
    method: 'PUT',
    body: JSON.stringify(historial),
  }),
  
  eliminar: (id) => request(`/historial/${id}`, {
    method: 'DELETE',
  }),
};
