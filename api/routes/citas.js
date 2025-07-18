const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const citasPath = path.join(__dirname, '../data/citas.json');

// Función para leer citas
const leerCitas = () => {
  try {
    const data = fs.readFileSync(citasPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer citas:', error);
    return [];
  }
};

// Función para guardar citas
const guardarCitas = (citas) => {
  try {
    fs.writeFileSync(citasPath, JSON.stringify(citas, null, 2));
    return true;
  } catch (error) {
    console.error('Error al guardar citas:', error);
    return false;
  }
};

// GET - Obtener todas las citas
router.get('/', (req, res) => {
  const citas = leerCitas();
  res.json(citas);
});

// GET - Obtener citas por paciente
router.get('/paciente/:paciente', (req, res) => {
  const citas = leerCitas();
  const citasPaciente = citas.filter(c => c.paciente === req.params.paciente);
  res.json(citasPaciente);
});

// GET - Obtener cita por ID
router.get('/:id', (req, res) => {
  const citas = leerCitas();
  const cita = citas.find(c => c.id === parseInt(req.params.id));
  
  if (!cita) {
    return res.status(404).json({ error: 'Cita no encontrada' });
  }
  
  res.json(cita);
});

// POST - Crear nueva cita
router.post('/', (req, res) => {
  const citas = leerCitas();
  const nuevaCita = {
    id: citas.length > 0 ? Math.max(...citas.map(c => c.id)) + 1 : 1,
    ...req.body,
    estado: req.body.estado || 'Pendiente'
  };
  
  // Verificar que no haya conflicto de horarios
  const conflicto = citas.some(c => 
    c.fecha === nuevaCita.fecha && 
    c.hora === nuevaCita.hora && 
    c.medico === nuevaCita.medico &&
    c.estado !== 'Cancelada'
  );
  
  if (conflicto) {
    return res.status(400).json({ error: 'Ya existe una cita en ese horario con el mismo médico' });
  }
  
  citas.push(nuevaCita);
  
  if (guardarCitas(citas)) {
    res.status(201).json(nuevaCita);
  } else {
    res.status(500).json({ error: 'Error al crear cita' });
  }
});

// PUT - Actualizar cita
router.put('/:id', (req, res) => {
  const citas = leerCitas();
  const index = citas.findIndex(c => c.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Cita no encontrada' });
  }
  
  // Verificar conflicto de horarios si se cambia fecha/hora/médico
  if (req.body.fecha || req.body.hora || req.body.medico) {
    const citaActualizada = { ...citas[index], ...req.body };
    const conflicto = citas.some(c => 
      c.fecha === citaActualizada.fecha && 
      c.hora === citaActualizada.hora && 
      c.medico === citaActualizada.medico &&
      c.id !== parseInt(req.params.id) &&
      c.estado !== 'Cancelada'
    );
    
    if (conflicto) {
      return res.status(400).json({ error: 'Ya existe una cita en ese horario con el mismo médico' });
    }
  }
  
  citas[index] = { ...citas[index], ...req.body, id: parseInt(req.params.id) };
  
  if (guardarCitas(citas)) {
    res.json(citas[index]);
  } else {
    res.status(500).json({ error: 'Error al actualizar cita' });
  }
});

// DELETE - Eliminar cita
router.delete('/:id', (req, res) => {
  const citas = leerCitas();
  const index = citas.findIndex(c => c.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Cita no encontrada' });
  }
  
  citas.splice(index, 1);
  
  if (guardarCitas(citas)) {
    res.json({ message: 'Cita eliminada correctamente' });
  } else {
    res.status(500).json({ error: 'Error al eliminar cita' });
  }
});

// PATCH - Cancelar cita
router.patch('/:id/cancelar', (req, res) => {
  const citas = leerCitas();
  const index = citas.findIndex(c => c.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Cita no encontrada' });
  }
  
  citas[index].estado = 'Cancelada';
  
  if (guardarCitas(citas)) {
    res.json(citas[index]);
  } else {
    res.status(500).json({ error: 'Error al cancelar cita' });
  }
});

module.exports = router;
