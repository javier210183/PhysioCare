import mongoose from 'mongoose';
import Patient from './models/patient.js';
import Physio from './models/physio.js';
import Record from './models/record.js';
import User from './models/user.js';

mongoose.connect('mongodb://localhost:27017/physiocare', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ Conexión exitosa a MongoDB.'))
    .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

const seedDatabase = async () => {
    try {
        // Añadir nuevos pacientes
        const patients = await Patient.insertMany([
            {
                name: 'Rodrigo',
                surname: 'Díaz de Vivar',
                birthDate: new Date('1043-01-01'),
                address: 'Burgos, Castilla',
                insuranceNumber: 'RD1234567',
            },
            {
                name: 'Isabel',
                surname: 'La Católica',
                birthDate: new Date('1451-04-22'),
                address: 'Madrigal de las Altas Torres',
                insuranceNumber: 'IC1234567',
            },
            {
                name: 'Gonzalo',
                surname: 'Fernández de Córdoba',
                birthDate: new Date('1453-09-01'),
                address: 'Montilla, Andalucía',
                insuranceNumber: 'GF1234567',
            },
        ]);

        // Añadir nuevos fisioterapeutas
        const physios = await Physio.insertMany([
            {
                name: 'Alonso',
                surname: 'Quijano',
                specialty: 'Sports',
                licenseNumber: 'AQ123456',
            },
            {
                name: 'Juana',
                surname: 'La Loca',
                specialty: 'Neurological',
                licenseNumber: 'JL123456',
            },
            {
                name: 'Hernán',
                surname: 'Cortés',
                specialty: 'Geriatric',
                licenseNumber: 'HC123456',
            },
        ]);

        // Añadir nuevos expedientes médicos
        await Record.insertMany([
            {
                patient: patients[0]._id,
                medicalRecord: 'Expediente médico de Rodrigo',
                appointments: [
                    {
                        date: new Date('2023-01-15'),
                        physio: physios[0]._id,
                        diagnosis: 'Dolor en el brazo derecho',
                        treatment: 'Terapia con ejercicios',
                        observations: 'Progreso moderado.',
                    },
                ],
            },
            {
                patient: patients[1]._id,
                medicalRecord: 'Expediente médico de Isabel',
                appointments: [
                    {
                        date: new Date('2023-02-20'),
                        physio: physios[1]._id,
                        diagnosis: 'Migrañas frecuentes',
                        treatment: 'Terapias de relajación',
                        observations: 'Reducir el estrés.',
                    },
                ],
            },
            {
                patient: patients[2]._id,
                medicalRecord: 'Expediente médico de Gonzalo',
                appointments: [
                    {
                        date: new Date('2023-03-10'),
                        physio: physios[2]._id,
                        diagnosis: 'Dolor lumbar crónico',
                        treatment: 'Masajes y fortalecimiento',
                        observations: 'Mejora significativa.',
                    },
                ],
            },
        ]);

        // Añadir nuevos usuarios
        await User.insertMany([
            {
                login: 'adminRodrigo',
                password: 'adminPass123',
                rol: 'admin',
            },
            {
                login: 'physioJuana',
                password: 'physioPass123',
                rol: 'physio',
            },
            {
                login: 'patientGonzalo',
                password: 'patientPass123',
                rol: 'patient',
            },
        ]);

        console.log('✅ Nuevos datos con nombres antiguos españoles insertados correctamente.');
        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error al insertar datos:', error);
    }
};

seedDatabase();
