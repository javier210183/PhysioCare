import express from 'express';
import Patient from '../models/patient.js';
import { ensureAuthenticated, ensureRole } from '../middlewares/auth.js';
import diacritics from 'diacritics';
import Record from '../models/record.js';


const router = express.Router();

// Buscar pacientes por apellido (admin y physio)
// Se usa diacritis para evitar sensibilidad a mayusculas y acentos

router.get('/find', ensureAuthenticated, async (req, res) => {
    const { surname } = req.query;

    try {
        let patients;

        if (surname) {
            // Normalizar el apellido ingresado (eliminar acentos y convertir a minúsculas)
            const normalizedSurname = diacritics.remove(surname.toLowerCase());

            // Buscar pacientes coincidiendo con el apellido normalizado
            patients = await Patient.find().exec();

            // Filtrar pacientes en memoria
            patients = patients.filter(patient =>
                diacritics.remove(patient.surname.toLowerCase()).includes(normalizedSurname)
            );
        } else {
            // Si no se especifica apellido, devolver todos los pacientes
            patients = await Patient.find();
        }

        if (patients.length === 0) {
            return res.status(404).render('patients_list', {
                patients: [],
                error: 'No se encontraron pacientes.',
            });
        }

        res.render('patients_list', { patients }); // Renderizar pacientes encontrados
    } catch (error) {
        console.error('Error al buscar pacientes:', error);
        res.status(500).render('error', {
            error: 'Error al buscar pacientes. Inténtelo más tarde.',
        });
    }
});



// Registrar nuevo paciente - Formulario (Solo admin)
router.get('/new', ensureAuthenticated, ensureRole('admin'), (req, res) => {
    res.render('patient_add', { errors: null }); // Renderiza el formulario de alta
});

// Registrar nuevo paciente - Guardar en la base de datos (Solo admin)
router.post('/', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    const { name, surname, birthDate, address, insuranceNumber } = req.body;
    try {
        const patient = new Patient({
            name,
            surname,
            birthDate,
            address,
            insuranceNumber,
        });
        await patient.save(); // Guarda el nuevo paciente en la base de datos
        res.redirect('/patients'); // Redirige al listado de pacientes
    } catch (error) {
        const errorMessages = Object.values(error.errors || {}).map(err => err.message);
        res.render('patient_add', { errors: errorMessages }); // Muestra errores si los hay
    }
});

// Listar pacientes (admin y physio)
router.get('/', ensureAuthenticated, ensureRole('admin', 'physio'), async (req, res) => {
    const patients = await Patient.find(); // Consulta todos los datos a la base de datos
    res.render('patients_list', { patients }); // Renderiza la vista pasando el array de pacientes
});

// Detalle de paciente (admin, physio, y el propio paciente)
router.get('/:id', ensureAuthenticated, async (req, res) => {
    try {
        console.log("🔍 Buscando paciente con ID:", req.params.id);
        const patient = await Patient.findById(req.params.id);
        
        if (!patient) {
            console.error("❌ Paciente no encontrado en la base de datos:", req.params.id);
            return res.status(404).render('error', { error: 'Paciente no encontrado' });
        }

        console.log("✅ Paciente encontrado:", patient);

        // Buscar el expediente del paciente
        const record = await Record.findOne({ patient: req.params.id });

        if (record) {
            console.log("✅ Expediente encontrado:", record);
        } else {
            console.warn("⚠️ No se encontró un expediente para este paciente.");
        }

        res.render('patient_detail', { patient, record }); 
    } catch (error) {
        console.error("❌ Error al obtener datos del paciente:", error);
        res.status(500).render('error', { error: 'Error al obtener la información del paciente.', details: error.message });
    }
});



// Editar paciente - Formulario (Solo admin)
router.get('/:id/edit', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
        return res.status(404).render('error', { error: 'Paciente no encontrado' });
    }
    res.render('patient_edit', { patient });
});

// Editar paciente - Enviar cambios (Solo admin)
router.post('/:id/edit', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    const { name, surname, birthDate, address, insuranceNumber } = req.body;
    try {
        await Patient.findByIdAndUpdate(req.params.id, {
            name,
            surname,
            birthDate,
            address,
            insuranceNumber,
        });
        res.redirect('/patients');
    } catch (error) {
        res.status(400).render('error', { error: 'Error al actualizar paciente' });
    }
});

// Eliminar paciente (Solo admin)
router.delete('/:id', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    await Patient.findByIdAndDelete(req.params.id);
    res.redirect('/patients');
});



export default router;
