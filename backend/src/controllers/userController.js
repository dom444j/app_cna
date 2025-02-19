const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// ✅ Registrar un nuevo usuario
async function registerUser(req, res) {
    try {
        const { username, email, password, full_name, phone, role, points } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "El usuario ya está registrado" });
        }

        // Encriptar la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear nuevo usuario
        const newUser = await User.create({
            username,
            email,
            password_hash: hashedPassword,
            full_name,
            phone,
            role,
            points,
        });

        res.status(201).json({ message: "Usuario registrado con éxito", user: newUser });
    } catch (error) {
        console.error("❌ Error en registerUser:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// ✅ Iniciar sesión
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || "claveSecreta",
            { expiresIn: "7d" }
        );

        res.json({ message: "Inicio de sesión exitoso", token, user });
    } catch (error) {
        console.error("❌ Error en loginUser:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

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

// ✅ Obtener todos los usuarios
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

// Exportar funciones
module.exports = {
    registerUser, 
    loginUser, 
    getUserById,
    getUserProfile,
    getAllUsers,
    updateUser,
    deleteUser
};
