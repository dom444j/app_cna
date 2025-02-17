const { User } = require("../models");

// ✅ Obtener usuario por ID
async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: ["id", "username", "email", "full_name", "role", "created_at"],
        });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(user);
    } catch (error) {
        console.error("❌ Error al obtener usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// ✅ Obtener perfil del usuario autenticado
async function getUserProfile(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            attributes: ["id", "username", "email", "full_name", "role", "created_at"],
        });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(user);
    } catch (error) {
        console.error("❌ Error al obtener perfil:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// ✅ Obtener todos los usuarios (opcional)
async function getAllUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: ["id", "username", "email", "full_name", "role", "created_at"],
        });
        res.json(users);
    } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// ✅ Actualizar datos del usuario
async function updateUser(req, res) {
    try {
        const { id } = req.params;
        // Actualizamos solo los campos que existen en la tabla: username, email, full_name y phone (si fuera necesario)
        const { username, email, full_name, phone } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        await user.update({ username, email, full_name, phone });
        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        console.error("❌ Error al actualizar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// ✅ Eliminar usuario
async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        await user.destroy();
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

module.exports = {
    getUserById,
    getUserProfile,
    getAllUsers,
    updateUser,
    deleteUser
};
