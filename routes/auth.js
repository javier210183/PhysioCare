const express = require('express');
const User = require('../models/user'); // Modelo de usuario
const { generarToken } = require('../models/auth/auth');


const router = express.Router();

// Ruta para login
router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    // Buscar usuario en la base de datos
    const usuario = await User.findOne({ login, password });

    if (!usuario) {
        return res.status(401).json({ ok: false, error: 'Login incorrecto' });
    }

    // Generar y devolver un token
    const token = generarToken(usuario);
    res.json({ ok: true, result: token });
});

// Ruta para registrar un nuevo usuario
router.post('/signup', async (req, res) => {
    const { login, password, rol } = req.body;

    // Validación simple
    if (!login || !password || !rol) {
        return res.status(400).json({ ok: false, error: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el usuario ya existe
        const existeUsuario = await User.findOne({ login });
        if (existeUsuario) {
            return res.status(409).json({ ok: false, error: 'El usuario ya existe' });
        }

        // Crear un nuevo usuario
        const nuevoUsuario = new User({ login, password, rol });
        await nuevoUsuario.save();
        res.status(201).json({ ok: true, result: 'Usuario creado correctamente' });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al registrar el usuario' });
    }
    //prueba para asegurarse que funciona
    router.get('/test', (req, res) => {
        res.json({ message: "Ruta de prueba funcionando correctamente." });
    });
    
    // Ruta para obtener todos los usuarios (solo para admin)
router.get('/users', async (req, res) => {
    try {
        const usuarios = await User.find(); // Buscar todos los usuarios en la base de datos
        res.json({ ok: true, result: usuarios });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error al obtener usuarios' });
    }
});

});

module.exports = router;
