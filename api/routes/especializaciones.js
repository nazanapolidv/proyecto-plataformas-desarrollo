const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const especializacionesPath = path.join(__dirname, '../data/especializaciones.json');

// Función para leer especializaciones
const leerEspecializaciones = () => {
  try {
    const data = fs.readFileSync(especializacionesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer especializaciones:', error);
    return [];
  }
};

// Función para guardar especializaciones
const guardarEspecializaciones = (especializaciones) => {
  try {
    fs.writeFileSync(especializacionesPath, JSON.stringify(especializaciones, null, 2));
    return true;
  } catch (error) {
    console.error('Error al guardar especializaciones:', error);
    return false;
  }
};

// GET - Obtener todas las especializaciones
router.get('/', (req, res) => {
  const especializaciones = leerEspecializaciones();
  res.json(especializaciones);
});

// GET - Obtener especialización por ID
router.get('/:id', (req, res) => {
  const especializaciones = leerEspecializaciones();
  const especializacion = especializaciones.find(e => e.id === parseInt(req.params.id));
  
  if (!especializacion) {
    return res.status(404).json({ error: 'Especialización no encontrada' });
  }
  
  res.json(especializacion);
});

// POST - Crear nueva especialización
router.post('/', (req, res) => {
  const especializaciones = leerEspecializaciones();
  const nuevaEspecializacion = {
    id: especializaciones.length > 0 ? Math.max(...especializaciones.map(e => e.id)) + 1 : 1,
    ...req.body
  };
  
  // Verificar si el nombre ya existe
  const nombreExiste = especializaciones.some(e => e.nombre.toLowerCase() === nuevaEspecializacion.nombre.toLowerCase());
  if (nombreExiste) {
    return res.status(400).json({ error: 'La especialización ya existe' });
  }
  
  especializaciones.push(nuevaEspecializacion);
  
  if (guardarEspecializaciones(especializaciones)) {
    res.status(201).json(nuevaEspecializacion);
  } else {
    res.status(500).json({ error: 'Error al crear especialización' });
  }
});

// PUT - Actualizar especialización
router.put('/:id', (req, res) => {
  const especializaciones = leerEspecializaciones();
  const index = especializaciones.findIndex(e => e.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Especialización no encontrada' });
  }
  
  // Verificar si el nombre ya existe en otra especialización
  const nombreExiste = especializaciones.some(e => 
    e.nombre.toLowerCase() === req.body.nombre.toLowerCase() && 
    e.id !== parseInt(req.params.id)
  );
  if (nombreExiste) {
    return res.status(400).json({ error: 'El nombre de la especialización ya existe' });
  }
  
  especializaciones[index] = { ...especializaciones[index], ...req.body, id: parseInt(req.params.id) };
  
  if (guardarEspecializaciones(especializaciones)) {
    res.json(especializaciones[index]);
  } else {
    res.status(500).json({ error: 'Error al actualizar especialización' });
  }
});

// DELETE - Eliminar especialización
router.delete('/:id', (req, res) => {
  const especializaciones = leerEspecializaciones();
  const index = especializaciones.findIndex(e => e.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Especialización no encontrada' });
  }
  
  especializaciones.splice(index, 1);
  
  if (guardarEspecializaciones(especializaciones)) {
    res.json({ message: 'Especialización eliminada correctamente' });
  } else {
    res.status(500).json({ error: 'Error al eliminar especialización' });
  }
});

module.exports = router;
