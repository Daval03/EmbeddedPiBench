const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // URL de React
  credentials: true
}));
app.use(express.json());

// Datos de ejemplo (en un proyecto real usarías una base de datos)
let usuarios = [
  { id: 1, nombre: 'Ana García', email: 'ana@example.com' },
  { id: 2, nombre: 'Carlos López', email: 'carlos@example.com' }
];

// Rutas de la API
app.get('/api', (req, res) => {
  res.json({ 
    mensaje: 'Bienvenido a la API del backend',
    version: '1.0.0',
    fecha: new Date().toISOString()
  });
});

// GET - Obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
  res.json({
    success: true,
    data: usuarios,
    total: usuarios.length
  });
});

// GET - Obtener usuario por ID
app.get('/api/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);
  
  if (!usuario) {
    return res.status(404).json({
      success: false,
      error: 'Usuario no encontrado'
    });
  }
  
  res.json({
    success: true,
    data: usuario
  });
});

// POST - Crear nuevo usuario
app.post('/api/usuarios', (req, res) => {
  const { nombre, email } = req.body;
  
  if (!nombre || !email) {
    return res.status(400).json({
      success: false,
      error: 'Nombre y email son requeridos'
    });
  }
  
  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre,
    email,
    fechaCreacion: new Date().toISOString()
  };
  
  usuarios.push(nuevoUsuario);
  
  res.status(201).json({
    success: true,
    data: nuevoUsuario,
    mensaje: 'Usuario creado exitosamente'
  });
});

// PUT - Actualizar usuario
app.put('/api/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, email } = req.body;
  const usuarioIndex = usuarios.findIndex(u => u.id === id);
  
  if (usuarioIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Usuario no encontrado'
    });
  }
  
  usuarios[usuarioIndex] = {
    ...usuarios[usuarioIndex],
    nombre: nombre || usuarios[usuarioIndex].nombre,
    email: email || usuarios[usuarioIndex].email,
    fechaActualizacion: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: usuarios[usuarioIndex],
    mensaje: 'Usuario actualizado exitosamente'
  });
});

// DELETE - Eliminar usuario
app.delete('/api/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const usuarioIndex = usuarios.findIndex(u => u.id === id);
  
  if (usuarioIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Usuario no encontrado'
    });
  }
  
  const usuarioEliminado = usuarios.splice(usuarioIndex, 1)[0];
  
  res.json({
    success: true,
    data: usuarioEliminado,
    mensaje: 'Usuario eliminado exitosamente'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Ruta ${req.originalUrl} no encontrada`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
});