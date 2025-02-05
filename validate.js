import express from 'express';
import User from './models/user.js';
import Patient from './models/patient.js';
import Physio from './models/physio.js';

const validateRouter = express.Router();

// Endpoint para verificar usuarios
validateRouter.get('/validate/users', async (req, res) => {
    console.log('Entrando al endpoint /validate/users');
    try {
        const users = await User.find();
        console.log('Usuarios encontrados:', users);
        if (users.length > 0) {
            res.status(200).json({ error: null, result: users });
        } else {
            res.status(404).json({ error: 'No se encontraron usuarios', result: null });
        }
    } catch (error) {
        console.error('Error al consultar usuarios:', error);
        res.status(500).json({ error: error.message, result: null });
    }
});


// Endpoint para verificar pacientes
validateRouter.get('/validate/patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        if (patients.length > 0) {
            res.status(200).json({ error: null, result: patients });
        } else {
            res.status(404).json({ error: 'No se encontraron pacientes', result: null });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, result: null });
    }
});

// Endpoint para verificar fisioterapeutas
validateRouter.get('/validate/physios', async (req, res) => {
    try {
        const physios = await Physio.find();
        if (physios.length > 0) {
            res.status(200).json({ error: null, result: physios });
        } else {
            res.status(404).json({ error: 'No se encontraron fisioterapeutas', result: null });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, result: null });
    }
});

export default validateRouter;
