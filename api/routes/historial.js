const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const historialPath = path.join(__dirname, '../data/historial.json');

// Función para leer historial
const leerHistorial = () => {
  try {
    const data = fs.readFileSync(historialPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer historial:', error);
    return [];
  }
};

// Función para guardar historial
const guardarHistorial = (historial) => {
  try {
    fs.writeFileSync(historialPath, JSON.stringify(historial, null, 2));
    return true;
  } catch (error) {
    console.error('Error al guardar historial:', error);
    return false;
  }
};

// GET - Obtener todo el historial
router.get('/', (req, res) => {
  const historial = leerHistorial();
  res.json(historial);
});

// GET - Obtener historial por paciente
router.get('/paciente/:paciente', (req, res) => {
  const historial = leerHistorial();
  const historialPaciente = historial.filter(h => h.paciente === req.params.paciente);
  res.json(historialPaciente);
});

// GET - Obtener entrada del historial por ID
router.get('/:id', (req, res) => {
  const historial = leerHistorial();
  const entrada = historial.find(h => h.id === parseInt(req.params.id));
  
  if (!entrada) {
    return res.status(404).json({ error: 'Entrada del historial no encontrada' });
  }
  
  res.json(entrada);
});

// POST - Crear nueva entrada en el historial
router.post('/', (req, res) => {
  const historial = leerHistorial();
  const nuevaEntrada = {
    id: historial.length > 0 ? Math.max(...historial.map(h => h.id)) + 1 : 1,
    ...req.body
  };
  
  historial.push(nuevaEntrada);
  
  if (guardarHistorial(historial)) {
    res.status(201).json(nuevaEntrada);
  } else {
    res.status(500).json({ error: 'Error al crear entrada del historial' });
  }
});

// PUT - Actualizar entrada del historial
router.put('/:id', (req, res) => {
  const historial = leerHistorial();
  const index = historial.findIndex(h => h.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Entrada del historial no encontrada' });
  }
  
  historial[index] = { ...historial[index], ...req.body, id: parseInt(req.params.id) };
  
  if (guardarHistorial(historial)) {
    res.json(historial[index]);
  } else {
    res.status(500).json({ error: 'Error al actualizar entrada del historial' });
  }
});

// DELETE - Eliminar entrada del historial
router.delete('/:id', (req, res) => {
  const historial = leerHistorial();
  const index = historial.findIndex(h => h.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Entrada del historial no encontrada' });
  }
  
  historial.splice(index, 1);
  
  if (guardarHistorial(historial)) {
    res.json({ message: 'Entrada del historial eliminada correctamente' });
  } else {
    res.status(500).json({ error: 'Error al eliminar entrada del historial' });
  }
});

module.exports = router;
