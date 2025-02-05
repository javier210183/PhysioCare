import mongoose from 'mongoose';
const physioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede tener más de 50 caracteres'],
    },
    surname: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        minlength: [2, 'El apellido debe tener al menos 2 caracteres'],
        maxlength: [50, 'El apellido no puede tener más de 50 caracteres'],
    },
    specialty: {
        type: String,
        required: [true, 'La especialidad es obligatoria'],
        enum: {
            values: ['Sports', 'Neurological', 'Pediatric', 'Geriatric', 'Oncological'],
            message: 'La especialidad debe ser una de las siguientes: Sports, Neurological, Pediatric, Geriatric, Oncological',
        },
    },
    licenseNumber: {
        type: String,
        required: [true, 'El número de licencia es obligatorio'],
        match: [/^[a-zA-Z0-9]{8}$/, 'El número de licencia debe tener exactamente 8 caracteres alfanuméricos'],
        unique: true,
    },
    image: {
        type: String,
        required: false, // No obligatorio
    },
});

// Exportar el modelo
export default mongoose.model('Physio', physioSchema);