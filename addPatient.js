import mongoose from 'mongoose';

// Conectar a MongoDB
await mongoose.connect('mongodb://localhost:27017/physiocare');

// Definir modelos
const User = mongoose.model('users', new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    login: String,
    password: String,
    rol: String
}));

const Patient = mongoose.model('patients', new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    surname: String,
    birthDate: Date,
    address: String,
    insuranceNumber: String
}));

const Record = mongoose.model('records', new mongoose.Schema({
    patient: mongoose.Schema.Types.ObjectId,
    medicalRecord: String,
    appointments: [{
        date: Date,
        physio: mongoose.Schema.Types.ObjectId,
        diagnosis: String,
        treatment: String,
        observations: String
    }]
}));

// Crear un ObjectId único para el usuario y el paciente
const patientId = new mongoose.Types.ObjectId();
const physioId = new mongoose.Types.ObjectId(); // ID ficticio de un fisioterapeuta

// Crear usuario
const user = new User({
    _id: patientId,  // Mismo ID que el paciente
    login: "patientCarlos",
    password: "patientPass123",
    rol: "patient"
});

// Crear paciente
const patient = new Patient({
    _id: patientId,  // Mismo ID que el usuario
    name: "Carlos",
    surname: "Ramírez",
    birthDate: new Date("1985-06-15"),
    address: "Calle Mayor, 123, Madrid",
    insuranceNumber: "CR1234567"
});

// Crear expediente médico con una cita
const record = new Record({
    patient: patientId,
    medicalRecord: "Expediente médico de Carlos Ramírez",
    appointments: [{
        date: new Date(),
        physio: physioId, // ID ficticio de un fisioterapeuta
        diagnosis: "Dolor lumbar",
        treatment: "Fisioterapia manual",
        observations: "Mejora progresiva"
    }]
});

// Guardar en la base de datos
await user.save();
await patient.save();
await record.save();

console.log("✅ Usuario, paciente y expediente creados correctamente");

// Cerrar conexión
await mongoose.connection.close();
