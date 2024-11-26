// backend/routes/authRoutes.js
const express = require('express');
const { login, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);    // Ruta para iniciar sesión
router.post('/logout', logout);  // Ruta para cerrar sesión

module.exports = router;
