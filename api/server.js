const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const usuariosRoutes = require('./routes/usuarios');
const especializacionesRoutes = require('./routes/especializaciones');
const citasRoutes = require('./routes/citas');
const historialRoutes = require('./routes/historial');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/especializaciones', especializacionesRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/historial', historialRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API del Sistema Médico funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      usuarios: '/api/usuarios',
      especializaciones: '/api/especializaciones',
      citas: '/api/citas',
      historial: '/api/historial'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación disponible en http://localhost:${PORT}/api`);
});

module.exports = app;
