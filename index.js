import express from 'express';
import session from 'express-session';
import nunjucks from 'nunjucks';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import { ensureAuthenticated, ensureRole } from './middlewares/auth.js';


import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import physioRoutes from './routes/physios.js';
import recordRoutes from './routes/records.js';
import { format } from 'date-fns';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

// Inicializar aplicación Express
const app = express();

// Configurar Nunjucks y obtener el entorno
const env = nunjucks.configure('views', { 
    autoescape: true, 
    express: app, 
    watch: true 
});

// Definir el filtro 'date'
env.addFilter('date', (value, formatString = 'dd/MM/yyyy') => {
    if (!value || isNaN(new Date(value))) return 'Fecha no válida';
    return format(new Date(value), formatString);
});



app.set('view engine', 'njk');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    session({
      secret: process.env.SESSION_SECRET || 'miSuperSecreto', // Clave para firmar las cookies de sesión
      resave: false, // No guardar sesión si no hubo cambios
      saveUninitialized: false, // No guardar sesiones vacías
      cookie: {
        maxAge: 1000 * 60 * 60 * 2, // 2 horas de duración para la sesión
        httpOnly: true, // Evita acceso desde JavaScript
        secure: process.env.NODE_ENV === 'production', // Solo en HTTPS si está en producción
      },
    })
  );

  app.use((req, res, next) => {
    console.log('Sesión actual:', req.session);
    next();
  });
  
  app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});


  
app.use(methodOverride('_method')); // Middleware para métodos HTTP extendidos
app.use('/public', express.static('public')); // Archivos estáticos
app.use('/bootstrap', express.static('node_modules/bootstrap/dist')); // Archivos Bootstrap
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));// Imagenes accsibles desde /uploads
app.use('/auth', authRoutes);
app.use((req, res, next) => {
    if (req.method === 'POST') {
        console.log('Datos recibidos en POST:', req.body);
    }
    next();
});


// Rutas protegidas
app.use('/patients', ensureAuthenticated, patientRoutes);
app.use('/physios', ensureAuthenticated, ensureRole('admin'), physioRoutes);
app.use('/records', ensureAuthenticated, ensureRole(['admin', 'physio']), recordRoutes);

app.get('/', (req, res) => {
    res.render('index', { mensaje: '¡Bienvenido a PhysioCare!' });
});

// Ruta para la página principal
app.get('/home', ensureAuthenticated, (req, res) => {
    // Renderiza la vista principal (asegúrate de tener una vista llamada 'home.njk')
    res.render('home', { mensaje: '¡Bienvenido a PhysioCare!' });
});
app.use((req, res, next) => {
    console.log('Sesión actual:', req.session);
    next();
});


// Conexión a MongoDB y arranque del servidor
const PORT = process.env.PORT || 8080;
mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/physiocare', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
            console.log('✅ Conexión exitosa a MongoDB');
        });
    })
    .catch(error => {
        console.error('❌ Error al conectar a MongoDB:', error);
    });
