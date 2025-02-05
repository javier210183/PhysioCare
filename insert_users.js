import mongoose from 'mongoose';
import User from './models/user.js'; // Asegúrate de que la ruta al modelo de usuario sea correcta
import bcrypt from 'bcrypt';
const hashedPassword = await bcrypt.hash('1234567', 10);


// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/physiocare', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch(error => {
    console.error('Error al conectar a MongoDB:', error);
});

// Insertar usuarios
const insertUsers = async () => {
    try {
        await User.insertMany([
            {
                login: 'usuario1',
                password: '1234567', // Cambia esto por un hash bcrypt si lo estás utilizando
                rol: 'admin',
            },
            {
                login: 'usuario2',
                password: '1234567',
                rol: 'physio',
            },
            {
                login: 'usuario3',
                password: '1234567',
                rol: 'patient',
            },
        ]);
        console.log('Usuarios insertados correctamente');
    } catch (error) {
        console.error('Error al insertar usuarios:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Ejecutar función
insertUsers();
