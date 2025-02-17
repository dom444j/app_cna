const express = require("express");
const router = express.Router();
const {
  getUserById,
  getUserProfile,
  getAllUsers,
  updateUser,
  deleteUser // 🔹 Importar la función deleteUser
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

// ✅ Obtener perfil del usuario autenticado
router.get("/profile", verifyToken, getUserProfile);

// ✅ Obtener todos los usuarios (opcional)
router.get("/", verifyToken, getAllUsers);

// ✅ Obtener usuario por ID
router.get("/:id", verifyToken, getUserById);

// ✅ Actualizar usuario por ID
router.put("/:id", verifyToken, updateUser);

// ✅ Eliminar usuario por ID
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;

