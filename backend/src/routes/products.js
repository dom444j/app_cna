const express = require("express");
const router = express.Router();
const {
    createProduct, // ✅ Verifica que esta función existe en productController.js
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

// ✅ Definir las rutas correctamente
router.post("/", createProduct); // Agregar producto
router.get("/", getAllProducts); // Obtener todos los productos
router.get("/:id", getProductById); // Obtener un producto por ID
router.put("/:id", updateProduct); // Actualizar producto
router.delete("/:id", deleteProduct); // Eliminar producto

module.exports = router;

