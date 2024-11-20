const mongoose = require('mongoose');

// Esquema de usuario
const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minlength: 4
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    rol: {
        type: String,
        required: true,
        enum: ['admin', 'physio', 'patient'] // Solo estos roles son válidos
    }
});

// Exportar el modelo
module.exports = mongoose.model('User', UserSchema);
