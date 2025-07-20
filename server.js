const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Base de datos en memoria
let users = [];
let nextId = 1;

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// POST /api/users - Crear usuario
app.post('/api/users', (req, res) => {
    const { name, email, age } = req.body;

    // Validar campos requeridos
    if (!name || !email) {
        return res.status(400).json({
            error: 'Campos requeridos: name, email'
        });
    }

    // Validar formato de email
    if (!isValidEmail(email)) {
        return res.status(400).json({
            error: 'Formato de email inválido'
        });
    }

    // Validar edad si se proporciona
    if (age !== undefined && (typeof age !== 'number' || age < 0 || age > 120)) {
        return res.status(400).json({
            error: 'La edad debe ser un número entre 0 y 120'
        });
    }

    // Verificar email único
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(409).json({
            error: 'El email ya está registrado'
        });
    }

    // Crear usuario
    const newUser = {
        id: nextId++,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        age: age || null,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);

    res.status(201).json({
        message: 'Usuario creado exitosamente',
        user: newUser
    });
});

// GET /api/users/:id - Obtener usuario por ID
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    // Validar que ID sea numérico
    const userId = parseInt(id);
    if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({
            error: 'ID debe ser un número positivo'
        });
    }

    // Buscar usuario
    const user = users.find(user => user.id === userId);

    if (!user) {
        return res.status(404).json({
            error: 'Usuario no encontrado'
        });
    }

    res.status(200).json({
        user: user
    });
});

// GET /api/users - Obtener todos los usuarios (bonus para testing)
app.get('/api/users', (req, res) => {
    res.status(200).json({
        users: users,
        total: users.length
    });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log('📋 Endpoints disponibles:');
    console.log('  POST /api/users - Crear usuario');
    console.log('  GET /api/users/:id - Obtener usuario');
    console.log('  GET /api/users - Obtener todos los usuarios');
});

module.exports = app;