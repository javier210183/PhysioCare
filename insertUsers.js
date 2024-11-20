require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

// Conectar a MongoDB
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch((error) => console.error('Error al conectar a MongoDB:', error));

// Crear y guardar un nuevo usuario
const nuevoUsuario = new User({
    login: "nuevoUsuario",
    password: "password123",
    rol: "admin" // Cambiar por el rol deseado
});

nuevoUsuario.save()
.then(() => {
    console.log('Usuario insertado correctamente');
    mongoose.connection.close();
})
.catch((error) => {
    console.error('Error al insertar usuario:', error);
    mongoose.connection.close();
});
