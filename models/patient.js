import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
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
     birthDate: {
         type: Date,
         required: [true, 'La fecha de nacimiento es obligatoria'],
     },
     address: {
         type: String,
         maxlength: [100, 'La dirección no puede tener más de 100 caracteres'],
     },
     insuranceNumber: {
         type: String,
         required: [true, 'El número de seguro es obligatorio'],
         match: [/^[a-zA-Z0-9]{9}$/, 'El número de seguro debe tener exactamente 9 caracteres alfanuméricos'],
         unique: true,
     },
     image: {
         type: String,
         required: false, // No obligatorio
     },
 });
 
export default mongoose.model('Patient', patientSchema);
