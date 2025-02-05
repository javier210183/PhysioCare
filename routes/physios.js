import express from 'express';
import { ensureAuthenticated, ensureRole } from '../middlewares/auth.js';
import Physio from '../models/physio.js';

const router = express.Router();

// Registrar nuevo fisioterapeuta - Formulario (Solo admin)
router.get('/new', ensureAuthenticated, ensureRole('admin'), (req, res) => {
    res.render('physio_add', { errors: null }); // Renderiza el formulario de alta
});

// Registrar nuevo fisioterapeuta - Guardar en la base de datos (Solo admin)
router.post('/', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    const { name, surname, specialty, licenseNumber, login, password } = req.body;
    try {
        // Crear nuevo fisioterapeuta
        const physio = new Physio({
            name,
            surname,
            specialty,
            licenseNumber,
        });

        // Simulación de usuario asociado
        // const user = new User({ login, password, role: 'physio' });
        // await user.save();

        await physio.save(); // Guarda el fisioterapeuta en la base de datos
        res.redirect('/physios'); // Redirige al listado de fisioterapeutas
    } catch (error) {
        const errorMessages = Object.values(error.errors || {}).map(err => err.message);
        res.render('physio_add', { errors: errorMessages }); // Renderiza el formulario con errores
    }
});
// Buscar fisioterapeutas por especialidad (Acceso libre)
router.get('/find', ensureAuthenticated, async (req, res) => {
    const { specialty } = req.query;

    try {
        if (!specialty) {
            // Si no se especifica una especialidad, redirige al listado completo
            return res.redirect('/physios');
        }

        // Filtrar por especialidad
        const physios = await Physio.find({ specialty: specialty });

        if (physios.length === 0) {
            // Si no hay resultados, renderiza la vista de error
            return res.render('error', {
                error: 'No se encontraron fisioterapeutas con la especialidad indicada.',
            });
        }

        // Renderizar el listado filtrado
        res.render('physios_list', { physios });
    } catch (error) {
        console.error('Error al buscar fisioterapeutas:', error);
        res.status(500).render('error', {
            error: 'Hubo un problema al procesar la búsqueda. Inténtelo más tarde.',
        });
    }
});


// Listar fisioterapeutas (Acceso solo para admin y physios)
router.get('/', ensureAuthenticated, ensureRole('admin', 'physio'), async (req, res) =>  {
    const physios = await Physio.find();
    res.render('physios_list', { physios });
});

// Detalle de fisioterapeuta
router.get('/:id',ensureAuthenticated, ensureRole('admin', 'physio'), async (req, res) => {
    const physio = await Physio.findById(req.params.id);
    if (!physio) {
        return res.status(404).render('error', { error: 'Fisioterapeuta no encontrado' });
    }
    res.render('physio_detail', { physio });
});

// Editar fisioterapeuta - Formulario (Solo admin)
router.get('/:id/edit', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    const physio = await Physio.findById(req.params.id);
    if (!physio) {
        return res.status(404).render('error', { error: 'Fisioterapeuta no encontrado' });
    }
    res.render('physio_edit', { physio });
});

// Editar fisioterapeuta - Guardar cambios (Solo admin)
router.put('/:id', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    const { name, surname, specialty } = req.body;
    try {
        const updatedPhysio = await Physio.findByIdAndUpdate(
            req.params.id,
            { name, surname, specialty },
            { new: true, runValidators: true }
        );
        if (!updatedPhysio) {
            return res.status(404).render('error', { error: 'Fisioterapeuta no encontrado' });
        }
        res.redirect(`/physios/${req.params.id}`);
    } catch (error) {
        const errorMessages = Object.values(error.errors || {}).map(err => err.message);
        res.status(400).render('physio_edit', { physio: req.body, errors: errorMessages });
    }
});


// Eliminar fisioterapeuta (Solo admin)
router.delete('/:id', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    await Physio.findByIdAndDelete(req.params.id);
    res.redirect('/physios');
});

export default router;
