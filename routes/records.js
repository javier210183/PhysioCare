// routes/records.js
const express = require('express');
const router = express.Router();
const Record = require('../models/record');

// Obtener todos los expedientes médicos
router.get('/', async (req, res) => {
    try {
        const records = await Record.find().populate('patient').populate('appointments.physio');
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener un expediente médico por ID
router.get('/:id', async (req, res) => {
    try {
        const record = await Record.findById(req.params.id).populate('patient').populate('appointments.physio');
        if (record) {
            res.json(record);
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo expediente médico
router.post('/', async (req, res) => {
    const record = new Record({
        patient: req.body.patient,
        medicalRecord: req.body.medicalRecord,
        appointments: req.body.appointments // Asegúrate de que esto sigue el formato correcto.
    });
    try {
        const newRecord = await record.save();
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Actualizar un expediente médico
router.put('/:id', async (req, res) => {
    try {
        const updatedRecord = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('appointments.physio');
        res.json(updatedRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Eliminar un expediente médico
router.delete('/:id', async (req, res) => {
    try {
        const record = await Record.findByIdAndDelete(req.params.id);
        if (record) {
            res.json({ message: 'Record deleted successfully' });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
