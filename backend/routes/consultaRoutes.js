// backend/routes/consultaRoutes.js
const express = require('express');
const { getConsultaByIdentity } = require('../controllers/consultaController');
const verificarToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/consulta', verificarToken, getConsultaByIdentity);

module.exports = router;
