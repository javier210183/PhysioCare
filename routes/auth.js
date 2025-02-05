import express from 'express';
import User from '../models/user.js'; // Modelo de usuario (ajusta el nombre si es diferente)

const router = express.Router();

// Renderizar el formulario de login
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});


// Procesar el formulario de login
router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const user = await User.findOne({ login });

        if (!user || user.password !== password) {
            return res.render('login', { error: 'Credenciales incorrectas' });
        }

        // Guardar datos del usuario en la sesión
        req.session.user = {
            id: user._id,
            login: user.login,
            rol: user.rol,
        };

        // Redirigir según el rol del usuario
        switch (user.rol) {
            case 'admin':
                return res.redirect('/records');
            case 'physio':
                return res.redirect('/records');
            case 'patient':
                return res.redirect(`/patients/${user._id}`);
            default:
                req.session.destroy(); // Limpiar la sesión si el rol es desconocido
                return res.status(403).render('error', { error: 'Rol desconocido' });
        }
    } catch (error) {
        console.error('Error durante el login:', error);
        res.status(500).render('login', { error: 'Error interno del servidor' });
    }
});


// Ruta para logout
router.get('/logout', (req, res) => {
    // Destruir la sesión
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar la sesión:', err);
            return res.status(500).render('error', { error: 'No se pudo cerrar la sesión. Intente nuevamente.' });
        }

        // Redirigir al usuario a la página inicial
        res.redirect('/');
    });
});

export default router;
