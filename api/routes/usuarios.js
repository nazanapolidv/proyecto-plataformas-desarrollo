const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usuariosPath = path.join(__dirname, '../data/usuarios.json');

// Leer usuarios desde el archivo
const leerUsuarios = () => {
  try {
    const data = fs.readFileSync(usuariosPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo usuarios:', error);
    return [];
  }
};

// Escribir usuarios al archivo
const escribirUsuarios = (usuarios) => {
  try {
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
    return true;
  } catch (error) {
    console.error('Error escribiendo usuarios:', error);
    return false;
  }
};

// GET - Obtener todos los usuarios
router.get('/', (req, res) => {
  try {
    const usuarios = leerUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// POST - Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const usuarios = leerUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const { password: _, ...usuarioSinPassword } = usuario;
    res.json(usuarioSinPassword);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// POST - Crear usuario
router.post('/', (req, res) => {
  try {
    const usuarios = leerUsuarios();
    
    // Verificar si el email ya existe
    const emailExiste = usuarios.find(u => u.email === req.body.email);
    if (emailExiste) {
      return res.status(400).json({ error: 'Este email ya existe' });
    }

    const nuevoUsuario = {
      ...req.body,
      rol: req.body.rol || 'paciente'
    };

    usuarios.push(nuevoUsuario);
    
    if (escribirUsuarios(usuarios)) {
      const { password: _, ...usuarioSinPassword } = nuevoUsuario;
      res.status(201).json(usuarioSinPassword);
    } else {
      res.status(500).json({ error: 'Error al guardar el usuario' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// PUT - Actualizar usuario
router.put('/:email', (req, res) => {
  try {
    const { email } = req.params;
    const usuarios = leerUsuarios();
    
    const index = usuarios.findIndex(u => u.email === email);
    if (index === -1) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si se está cambiando el email, verificar que el nuevo no exista
    if (req.body.email && req.body.email !== email) {
      const emailExiste = usuarios.find(u => u.email === req.body.email);
      if (emailExiste) {
        return res.status(400).json({ error: 'Este email ya existe' });
      }
    }

    usuarios[index] = { ...usuarios[index], ...req.body };
    
    if (escribirUsuarios(usuarios)) {
      const { password: _, ...usuarioSinPassword } = usuarios[index];
      res.json(usuarioSinPassword);
    } else {
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// DELETE - Eliminar usuario
router.delete('/:email', (req, res) => {
  try {
    const { email } = req.params;
    const usuarios = leerUsuarios();
    
    const index = usuarios.findIndex(u => u.email === email);
    if (index === -1) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    usuarios.splice(index, 1);
    
    if (escribirUsuarios(usuarios)) {
      res.json({ message: 'Usuario eliminado correctamente' });
    } else {
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
