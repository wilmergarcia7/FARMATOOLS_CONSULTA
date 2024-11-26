// backend/server.js
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const authRoutes = require('./routes/authRoutes');
const consultaRoutes = require('./routes/consultaRoutes');
require('dotenv').config();
const sqlConfig = require('./config/dbConfig');

const app = express();

// Configuración de CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.88.25'], // Permitir solicitudes desde estos orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Cabeceras permitidas
}));

app.use(express.json());

// Verificar conexión a la base de datos
sql.connect(sqlConfig)
    .then(() => {
        console.log('Conexión a la base de datos exitosa');
    })
    .catch((err) => {
        console.error('Error al conectar a la base de datos:', err.message);
        process.exit(1); // Detener el servidor si falla la conexión
    });

// Rutas
app.use('/api', authRoutes);       // Maneja /api/login y /api/logout
app.use('/api', consultaRoutes);   // Maneja /api/consulta

// Ruta base para verificar el servidor
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

// Middleware para manejar errores no capturados
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Ocurrió un error en el servidor', error: err.message });
});

// Leer puerto y host desde el archivo .env
const PORT = process.env.PORT || 9100;
const HOST = process.env.HOST || 'localhost'; // Por defecto localhost si no está configurado

// Iniciar el servidor
app.listen(PORT, HOST, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});
