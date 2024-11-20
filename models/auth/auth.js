const jwt = require('jsonwebtoken');

// Generar un token JWT
const generarToken = (usuario) => {
    return jwt.sign(
        { login: usuario.login, rol: usuario.rol }, // Datos que se guardan en el token
        process.env.JWT_SECRET, // Palabra secreta
        { expiresIn: '2h' } // El token expira en 2 horas
    );
};

// Verificar un token JWT
const verificarToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET); // Devuelve los datos decodificados
    } catch (error) {
        return null; // Si el token no es válido o está expirado
    }
};

// Middleware para proteger rutas
const protegerRuta = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ ok: false, error: 'Acceso no autorizado' });
    }

    const token = authHeader.split(' ')[1];
    const datos = verificarToken(token);

    if (!datos) {
        return res.status(403).json({ ok: false, error: 'Token inválido o expirado' });
    }

    req.user = datos; // Añade los datos del usuario al objeto req
    next(); // Continúa con la siguiente función en la cadena
};

module.exports = { generarToken, verificarToken, protegerRuta };
