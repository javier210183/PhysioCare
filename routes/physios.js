// routes/physios.js
const express = require('express');
const router = express.Router();
const Physio = require('../models/physio');

// Obtener todos los fisioterapeutas
router.get('/', async (req, res) => {
    try {
        const physios = await Physio.find();
        res.json(physios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener un fisioterapeuta por ID
router.get('/:id', async (req, res) => {
    try {
        const physio = await Physio.findById(req.params.id);
        if (physio) {
            res.json(physio);
        } else {
            res.status(404).json({ message: 'Physio not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo fisioterapeuta
router.post('/', async (req, res) => {
    const physio = new Physio({
        name: req.body.name,
        surname: req.body.surname,
        specialty: req.body.specialty,
        licenseNumber: req.body.licenseNumber
    });
    try {
        const newPhysio = await physio.save();
        res.status(201).json(newPhysio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Actualizar un fisioterapeuta
router.put('/:id', async (req, res) => {
    try {
        const updatedPhysio = await Physio.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPhysio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Eliminar un fisioterapeuta
router.delete('/:id', async (req, res) => {
    try {
        const physio = await Physio.findByIdAndDelete(req.params.id);
        if (physio) {
            res.json({ message: 'Deleted Physio' });
        } else {
            res.status(404).json({ message: 'Physio not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
