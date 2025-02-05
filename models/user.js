import mongoose from 'mongoose';

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
        enum: ['admin', 'physio', 'patient'], // Solo estos roles son válidos
        validate: {
            validator: function(v) {
                console.log('Rol recibido para validación:', v);
                return ['admin', 'physio', 'patient'].includes(v);
            },
            message: props => `${props.value} no es un rol válido`
        }
    }
});

// Exportar el modelo
export default mongoose.model('user', UserSchema);
