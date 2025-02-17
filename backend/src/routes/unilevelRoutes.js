const express = require("express");
const { calculateUnilevelBonus, calculateSuccessBonus, calculateGlobalBonus } = require("../controllers/unilevelController");

const router = express.Router();

// ✅ Ruta para calcular bono unilevel
router.post("/calculateUnilevel", async (req, res) => {
    const { userId, totalPoints } = req.body;
    if (!userId || !totalPoints) {
        return res.status(400).json({ error: "Faltan parámetros: userId y totalPoints" });
    }
    const result = await calculateUnilevelBonus(userId, totalPoints);
    res.json(result);
});

// ✅ Ruta para calcular bono de éxito unilevel
router.post("/calculateSuccessBonus", async (req, res) => {
    const { userId, directEarnings } = req.body;
    if (!userId || !directEarnings) {
        return res.status(400).json({ error: "Faltan parámetros: userId y directEarnings" });
    }
    const result = await calculateSuccessBonus(userId, directEarnings);
    res.json(result);
});

// ✅ Ruta para calcular bono global unilevel
router.post("/calculateGlobalBonus", async (req, res) => {
    const { totalPoints } = req.body;
    if (!totalPoints) {
        return res.status(400).json({ error: "Faltan parámetros: totalPoints" });
    }
    const result = await calculateGlobalBonus(totalPoints);
    res.json(result);
});

module.exports = router;
