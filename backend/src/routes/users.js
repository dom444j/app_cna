const express = require("express"); 
const router = express.Router();
const {
  registerUser,  // 🔹 Función para registrar usuario
  loginUser,     // 🔹 Nueva función para iniciar sesión
  getUserById,
  getUserProfile,
  getAllUsers,
  updateUser,
  deleteUser
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

// ✅ Registrar un nuevo usuario
router.post("/register", registerUser);

// ✅ Iniciar sesión (Nuevo)
router.post("/login", loginUser);

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
