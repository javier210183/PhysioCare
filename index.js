require('dotenv').config(); // Cargar variables de entorno desde .env
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const physioRoutes = require('./routes/physios');
const recordRoutes = require('./routes/records');

const app = express();

// Middleware para parsear el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Cargar variables de entorno
const PORT = process.env.PORT || 3000; // Usar el puerto especificado en .env o 3000 por defecto
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/physiocare'; // URL de base de datos

// Conectar a MongoDB
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conexión exitosa a MongoDB'))
.catch((error) => console.error('Error al conectar a MongoDB:', error));

// Definir rutas principales
app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);
app.use('/physios', physioRoutes);
app.use('/records', recordRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido a PhysioCare API');
});

// Iniciar servidor si este archivo no se importa como módulo
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
}

// Exportar la aplicación para pruebas
module.exports = { app };
