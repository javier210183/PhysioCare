// Middleware para verificar si el usuario está autenticado
export const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next(); // Usuario autenticado
    }
    return res.redirect('/auth/login'); // Redirige al login si no está autenticado
};

// Middleware para verificar roles específicos
export const ensureRole = (...roles) => {
    roles = roles.flat();
    return (req, res, next) => {
        const userRole = String(req.session.user?.rol || '').trim();
        console.log('🚀 Middleware ensureRole ejecutado');
        console.log('Rol en sesión:', userRole);
        console.log('Roles permitidos:', roles);

        if (req.session.user && roles.includes(userRole)) {
            console.log(`✅ Acceso concedido a ${userRole}`);
            return next();
        }

        console.log(`❌ Acceso denegado a ${userRole}`);
        return res.status(403).render('error', { error: 'No tienes permiso para acceder a esta página.' });
    };
};




