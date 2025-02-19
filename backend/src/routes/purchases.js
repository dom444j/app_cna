const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { createPurchase, getAllPurchases, getPurchaseById, deletePurchase } = require("../controllers/purchaseController");

// ✅ Crear una compra
router.post("/", verifyToken, createPurchase);

// ✅ Obtener todas las compras
router.get("/", verifyToken, getAllPurchases);

// ✅ Obtener una compra por ID
router.get("/:id", verifyToken, getPurchaseById);

// ✅ Eliminar una compra por ID (solo admin)
router.delete("/:id", verifyToken, deletePurchase);

module.exports = router;
