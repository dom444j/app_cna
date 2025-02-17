const express = require('express');
const router = express.Router();
const { calculateBinary, applySuccessBonus, applyGlobalBonus } = require('../controllers/compensationController');
const { verifyToken } = require('../middleware/authMiddleware');

// Endpoint para calcular la compensación binaria
// Se espera recibir en el body: { userData: { purchaseCount, recompraPoints, leftLeg, rightLeg, rankId, ... }, monthPayoutSoFar: number }
router.post('/calculateBinary', verifyToken, async (req, res) => {
    try {
        const { userData, monthPayoutSoFar } = req.body;
        // Calcula el binario
        const binaryResult = calculateBinary(userData, monthPayoutSoFar);
        // Opcional: Calcula bonos, si deseas integrarlo:
        // const successBonus = applySuccessBonus(userData, binaryResult.pay);
        // const globalBonus = applyGlobalBonus(userData, userData.recompraPoints);
        // binaryResult.successBonus = successBonus;
        // binaryResult.globalBonus = globalBonus;
        res.json(binaryResult);
    } catch (error) {
        console.error("❌ Error al calcular compensación binaria:", error);
        res.status(500).json({ error: "Error al calcular compensación binaria", details: error.message });
    }
});

module.exports = router;
