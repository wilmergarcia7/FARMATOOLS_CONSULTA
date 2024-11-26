// backend/controllers/consultaController.js
const sql = require('mssql');
const sqlConfig = require('../config/dbConfig');

const getConsultaByIdentity = async (req, res) => {
    const { identidad } = req.query;

    try {
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
            .input('identidad', sql.VarChar, identidad)
            .query(`
                SELECT TOP 5
                    disp.numerohc,
                    pac.numtis,
                    pac.nombre,
                    pac.apellid1,
                    pac.apellid2,
                    disp.fecha, 
                    art.des_farma,
                    disp.cantidad
                FROM 
                    farmacia.dbo.dp_disp_his AS disp
                    JOIN paci_his AS pac ON disp.numerohc = pac.numerohc
                    JOIN dbo.articulos AS art ON disp.codigo = art.codigo
                WHERE 
                    pac.numtis = @identidad
                ORDER BY 
                    disp.fecha DESC
            `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        res.status(500).json({ message: 'Error en la consulta de la base de datos', error: error.message });
    }
};

module.exports = { getConsultaByIdentity };
