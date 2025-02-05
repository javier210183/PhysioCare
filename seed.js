import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from './models/patient.js';
import Physio from './models/physio.js';
import Record from './models/record.js';

dotenv.config(); // Cargar variables de entorno

// Conexión a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/physiocare', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Conexión a MongoDB establecida.');
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

// Insertar datos
const seedData = async () => {
    try {
        console.log('🌟 Comenzando a insertar datos...');

        // Eliminar datos existentes (si quieres evitar duplicados, puedes comentar esto)
        await Patient.deleteMany({});
        await Physio.deleteMany({});
        await Record.deleteMany({});
        console.log('✅ Datos anteriores eliminados.');

        // Insertar pacientes
        const patients = await Patient.insertMany([
            {
                name: 'Pedro',
                surname: 'Fernández',
                birthDate: new Date('1985-02-15'),
                address: 'Calle Luna 123',
                insuranceNumber: 'INS000001',
            },
            {
                name: 'Lucía',
                surname: 'Rodríguez',
                birthDate: new Date('1990-07-20'),
                address: 'Avenida Estrella 456',
                insuranceNumber: 'INS000002',
            },
            {
                name: 'Sergio',
                surname: 'Martínez',
                birthDate: new Date('1978-11-30'),
                address: 'Calle Sol 789',
                insuranceNumber: 'INS000003',
            },
            {
                name: 'Isabel',
                surname: 'García',
                birthDate: new Date('2000-05-10'),
                address: 'Paseo Arcoiris 101',
                insuranceNumber: 'INS000004',
            },
            {
                name: 'Andrés',
                surname: 'López',
                birthDate: new Date('1995-09-25'),
                address: 'Calle Río 202',
                insuranceNumber: 'INS000005',
            },
        ]);
        console.log('✅ Pacientes insertados.');

        // Insertar fisioterapeutas
        const physios = await Physio.insertMany([
            {
                name: 'Marta',
                surname: 'Pérez',
                specialty: 'Sports',
                licenseNumber: 'LIC00001',
            },
            {
                name: 'Carlos',
                surname: 'Moreno',
                specialty: 'Neurological',
                licenseNumber: 'LIC00002',
            },
            {
                name: 'Ana',
                surname: 'Ramírez',
                specialty: 'Pediatric',
                licenseNumber: 'LIC00003',
            },
            {
                name: 'Javier',
                surname: 'Torres',
                specialty: 'Geriatric',
                licenseNumber: 'LIC00004',
            },
            {
                name: 'Sofía',
                surname: 'Hernández',
                specialty: 'Oncological',
                licenseNumber: 'LIC00005',
            },
        ]);
        console.log('✅ Fisioterapeutas insertados.');

        // Insertar expedientes médicos
        const records = await Record.insertMany([
            {
                patient: patients[0]._id,
                medicalRecord: 'Expediente médico de Pedro',
                appointments: [
                    {
                        date: new Date('2023-01-10'),
                        physio: physios[0]._id,
                        diagnosis: 'Lesión muscular en pierna',
                        treatment: 'Terapia física intensiva',
                        observations: 'Progreso satisfactorio.',
                    },
                ],
            },
            {
                patient: patients[1]._id,
                medicalRecord: 'Expediente médico de Lucía',
                appointments: [
                    {
                        date: new Date('2023-02-15'),
                        physio: physios[1]._id,
                        diagnosis: 'Dolor cervical crónico',
                        treatment: 'Estiramientos y terapia manual',
                        observations: 'Requiere seguimiento mensual.',
                    },
                ],
            },
            {
                patient: patients[2]._id,
                medicalRecord: 'Expediente médico de Sergio',
                appointments: [
                    {
                        date: new Date('2023-03-20'),
                        physio: physios[2]._id,
                        diagnosis: 'Problemas motores infantiles',
                        treatment: 'Estimulación y ejercicios específicos',
                        observations: 'Avances importantes observados.',
                    },
                ],
            },
            {
                patient: patients[3]._id,
                medicalRecord: 'Expediente médico de Isabel',
                appointments: [
                    {
                        date: new Date('2023-04-25'),
                        physio: physios[3]._id,
                        diagnosis: 'Artrosis en rodilla',
                        treatment: 'Fortalecimiento muscular',
                        observations: 'Mejoría notable tras sesiones.',
                    },
                ],
            },
            {
                patient: patients[4]._id,
                medicalRecord: 'Expediente médico de Andrés',
                appointments: [
                    {
                        date: new Date('2023-05-30'),
                        physio: physios[4]._id,
                        diagnosis: 'Dolor en hombro derecho',
                        treatment: 'Rehabilitación progresiva',
                        observations: 'Condición estable.',
                    },
                ],
            },
        ]);
        console.log('✅ Expedientes médicos insertados.');

        // Finalizar el script
        console.log('🌟 Todos los datos fueron insertados correctamente.');
    } catch (error) {
        console.error('❌ Error durante la inserción de datos:', error);
    } finally {
        mongoose.connection.close();
        console.log('✅ Conexión a MongoDB cerrada.');
    }
};

// Ejecutar el script
connectDB().then(seedData);
