import { ensureAuthenticated, ensureRole } from '../middlewares/auth.js';

import express from 'express';
import Record from '../models/record.js';
import Patient from '../models/patient.js';
import Physio from '../models/physio.js';

import mongoose from 'mongoose';

const router = express.Router();

// Listar expedientes médicos
router.get('/', ensureAuthenticated, ensureRole('admin', 'physio'), async (req, res) => {
    const records = await Record.find().populate('patient');
    res.render('records_list', { records });
});
// Renderizar formulario de nuevo expediente
router.get('/new', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    try {
        const patients = await Patient.find(); // Obtener todos los pacientes
        res.render('record_add', { patients, errors: null });
    } catch (error) {
        console.error('Error al cargar el formulario:', error);
        res.status(500).render('error', { error: 'No se pudo cargar el formulario.' });
    }
});



// Procesar datos y registrar nuevo expediente
router.post('/', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    const { patient, medicalRecord } = req.body;

    try {
        // Validar que el paciente existe
        const existingPatient = await Patient.findById(patient);
        if (!existingPatient) {
            return res.status(400).render('record_add', {
                errors: ['El paciente seleccionado no existe.'],
                patients: await Patient.find() // Volver a cargar la lista de pacientes
            });
        }

        // Crear y guardar el expediente médico
        const record = new Record({ patient, medicalRecord });
        await record.save();

        // Redirigir al listado de expedientes
        res.redirect('/records');
    } catch (error) {
        console.error('Error al guardar el expediente:', error);
        res.status(500).render('record_add', {
            errors: ['Ocurrió un error al guardar el expediente.'],
            patients: await Patient.find() // Recargar lista de pacientes
        });
    }
});
//añadir cita a un expediente
router.get('/:id/appointments/new', ensureAuthenticated, ensureRole('admin','physio'), async (req, res) => {
    try {
        const record = await Record.findById(req.params.id).populate('patient');
        if (!record) {
            return res.status(404).render('error', { error: 'Expediente no encontrado' });
        }

        const physios = await Physio.find();
        res.render('add_appointment', { record, physios });
    } catch (error) {
        console.error('Error al cargar el formulario de cita:', error);
        res.status(500).render('error', { error: 'Error interno al cargar el formulario de cita.' });
    }
});
// Buscar expedientes médicos por apellido del paciente
router.get('/find', ensureAuthenticated, ensureRole('admin', 'physio'), async (req, res) => {
    try {
        let { surname } = req.query;
        console.log('🔎 Buscando expedientes con apellido:', surname);

        if (!surname || surname.trim() === "") {
            return res.status(400).json({ error: 'Debe ingresar un apellido válido.' });
        }

        surname = surname.trim().replace(/\s+/g, ' ');

        console.log('📡 Buscando paciente en la base de datos con apellido:', surname);
        const patient = await Patient.findOne({ surname: new RegExp(`^${surname}$`, 'i') });

        if (!patient) {
            console.log('❌ No se encontró un paciente con ese apellido.');
            return res.status(404).json({ error: 'No se encontró un paciente con ese apellido.' });
        }

        console.log('✅ Paciente encontrado:', patient);

        // Asegurarse de que patient._id es un ObjectId válido
        if (!mongoose.isValidObjectId(patient._id)) {
            console.error('❌ El ID del paciente no es válido:', patient._id);
            return res.status(500).json({ error: 'Error interno: ID de paciente no válido.' });
        }

        console.log('📡 Buscando expedientes médicos en records con patient._id:', patient._id);
        const records = await Record.find({ patient: patient._id }).populate('patient').exec();

        console.log('🔎 Expedientes encontrados:', records);

        if (!records || records.length === 0) {
            return res.status(404).json({ error: 'No se encontraron expedientes médicos para este paciente.' });
        }

        console.log('🔎 Expedientes encontrados antes de renderizar:', records);
        res.render('records_list', { records });


    } catch (error) {
        console.error('❌ ERROR DETECTADO:', error);
        res.status(500).json({ error: 'Error interno al procesar la búsqueda.', details: error.message });
    }
});


//Procesa los datos del formulario y registra la cita en la base de datos
router.post('/:id/appointments', ensureAuthenticated, ensureRole('admin','physio'), async (req, res) => {
    try {
        const { date, physio, diagnosis, treatment, observations } = req.body;

        const record = await Record.findById(req.params.id);
        if (!record) {
            return res.status(404).render('error', { error: 'Expediente no encontrado' });
        }

        const existingPhysio = await Physio.findById(physio);
        if (!existingPhysio) {
            return res.status(400).render('add_appointment', { 
                record, 
                physios: await Physio.find(), 
                error: 'El fisioterapeuta seleccionado no existe.' 
            });
        }

        // Añadir la cita al expediente
        record.appointments.push({ date, physio, diagnosis, treatment, observations });
        await record.save();

        res.redirect(`/records/${req.params.id}`);
    } catch (error) {
        console.error('Error al registrar la cita:', error);
        res.status(500).render('add_appointment', { 
            record: await Record.findById(req.params.id).populate('patient'),
            physios: await Physio.find(),
            error: 'Error interno al registrar la cita.' 
        });
    }
});
// Añadir nota a un expediente (solo admin)
router.post('/:id/add-note', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    try {
        const { content } = req.body;
        const record = await Record.findById(req.params.id);

        if (!record) {
            return res.status(404).render('error', { error: 'Expediente no encontrado.' });
        }

        // Agregar la nueva nota
        record.notes.push({
            author: req.session.user.login, // Guarda el nombre del usuario que añadió la nota
            content: content
        });

        await record.save();
        console.log(`✅ Nota añadida por ${req.session.user.login}: ${content}`);

        res.redirect(`/records/${req.params.id}`); // Redirige de vuelta al expediente
    } catch (error) {
        console.error('❌ Error al añadir la nota:', error);
        res.status(500).render('error', { error: 'Error interno al añadir la nota.' });
    }
});


// Detalle de expediente
router.get('/:id', ensureAuthenticated, ensureRole('admin', 'physio'), async (req, res) => {
    try {
        const record = await Record.findById(req.params.id)
            .populate('patient') // Poblamos datos del paciente
            .populate('appointments.physio'); // Poblamos datos de los fisioterapeutas en las citas

        if (!record) {
            return res.status(404).render('error', { error: 'Expediente no encontrado' });
        }

        res.render('record_detail', { record });
    } catch (error) {
        res.status(500).render('error', { error: 'Error interno del servidor' });
    }
});





// Eliminar expediente
router.delete('/:id', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    await Record.findByIdAndDelete(req.params.id);
    res.redirect('/records');
});

// Mostrar formulario para añadir cita (Solo accessible por physios)
router.get('/:id/add-appointment', ensureAuthenticated, ensureRole('physio'), async (req, res) => {
    try {
        console.log('Record ID recibido:', req.params.id);

        const record = await Record.findById(req.params.id).populate('patient');
        if (!record) {
            console.error('Expediente no encontrado');
            return res.status(404).render('error', { error: 'Expediente no encontrado.' });
        }

        console.log('Record recuperado:', record);

        const physios = await Physio.find();
        console.log('Fisioterapeutas recuperados:', physios);

        res.render('add_appointment', { record, physios });
    } catch (error) {
        console.error('Error al cargar el formulario de cita:', error);
        res.status(500).render('error', { error: 'Error al cargar el formulario de cita.' });
    }
});


// Procesar la cita añadida (Solo accessible por physios)
router.post('/:id/add-appointment', ensureAuthenticated, ensureRole('physio'), async (req, res) => {
    try {
        console.log('Record ID recibido en POST:', req.params.id);
        console.log('Datos del formulario recibidos:', req.body);

        const { date, physio, diagnosis, treatment, observations } = req.body;

        const record = await Record.findById(req.params.id);
        if (!record) {
            console.error('Expediente no encontrado');
            return res.status(404).render('error', { error: 'Expediente no encontrado.' });
        }

        console.log('Expediente encontrado:', record);
        const existingPhysio = await Physio.findById(physio);
        if (!existingPhysio) {
            console.error('Fisioterapeuta no encontrado:', physio);
            return res.status(400).render('error', { error: 'El fisioterapeuta seleccionado no existe.' });
        }

        record.appointments.push({ date, physio, diagnosis, treatment, observations });
        await record.save();

        console.log('Cita añadida correctamente:', { date, physio, diagnosis, treatment, observations });

        res.redirect(`/records/${req.params.id}`);
    } catch (error) {
        console.error('Error al añadir cita:', error);
        res.status(500).render('error', { error: 'Error al añadir cita. Inténtelo más tarde.' });
    }
});


export default router;
