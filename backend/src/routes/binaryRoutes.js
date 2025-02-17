const express = require('express');
const router = express.Router();
const { calcularBonoBinario } = require('../controllers/binaryController');

// Ruta para calcular el bono binario de un usuario específico
router.get('/binary-bonus/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const resultado = await calcularBonoBinario(user_id);
    res.json(resultado);
});

module.exports = router;
