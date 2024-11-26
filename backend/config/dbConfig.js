const sqlConfig = {
    user: 'usuario147',          // Usuario de la base de datos
    password: 'usuario2017',      // Contraseña de la base de datos
    database: 'farmacia',         // Nombre exacto de la base de datos
    server: '192.168.88.25',      // IP o hostname del servidor SQL, asegurado como string
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    
};

module.exports = sqlConfig;
