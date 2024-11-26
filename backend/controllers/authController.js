// backend/controllers/authController.js
const sql = require('mssql');
const jwt = require('jsonwebtoken');
const sqlConfig = require('../config/dbConfig');

// Login
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        await sql.connect(sqlConfig);

        const result = await sql.query`SELECT * FROM dbo.ltusu WHERE login_usu = ${username} AND passw_usu = ${password}`;

        if (result.recordset.length > 0) {
            const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error al conectar o consultar la base de datos:', error.message);
        res.status(500).json({ message: 'Error en el servidor al conectar con la base de datos' });
    }
};

// Logout
const logout = (req, res) => {
    res.json({ message: 'Sesión cerrada exitosamente' });
};

module.exports = { login, logout };
