const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User } = require('../models'); // Importamos la conexión con Sequelize y el modelo User

const SECRET_KEY = process.env.SECRET_KEY || "secreto_super_seguro";

// ✅ **Login de usuarios**
async function login(req, res) {
    const { email, password } = req.body;

    try {
        // Buscar usuario en la base de datos
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.error("❌ Usuario no encontrado:", email);
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        // Verificar la contraseña
        console.log("🔍 Comparando contraseña:", password, "con hash:", user.password_hash);
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            console.error("❌ Contraseña incorrecta para usuario:", email);
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Generar Token JWT
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '2h' });

        // Enviar Cookie con el token
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.json({ message: 'Login exitoso', token });

    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// ✅ **Registro de usuarios**
async function register(req, res) {
    try {
        console.log("📌 Recibiendo datos de registro:", req.body);

        const { username, email, password, sponsor, team_position } = req.body;

        if (!username || !email || !password || !sponsor || !team_position) {
            console.error("❌ Campos faltantes");
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            console.error("⚠️ El correo ya está registrado");
            return res.status(400).json({ error: "El correo ya está registrado" });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 12);

        // Crear usuario
        const newUser = await User.create({
            username,
            email,
            password_hash: hashedPassword, // 🔹 Guardamos en la columna correcta
            full_name: "", // Se deja vacío si no se envía
            phone: "",
            role: "user"
        });        

        console.log("✅ Usuario registrado:", newUser);
        res.json({ message: "Registro exitoso", userId: newUser.id });

    } catch (error) {
        console.error("❌ Error en el registro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// ✅ **Obtener usuario por ID**
async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(user);
    } catch (error) {
        console.error("❌ Error al obtener usuario:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// ✅ **Actualizar datos del usuario**
async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { username, email, team_position } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        await user.update({ username, email, team_position });
        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        console.error("❌ Error al actualizar usuario:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// ✅ **Eliminar usuario**
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
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// ✅ **Verificar token de usuario**
function verifyToken(req, res) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Acceso denegado' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido' });
        res.json({ message: 'Token válido', user: decoded });
    });
}

// ✅ **Verificar autenticación y rol**
function verifyAuth(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "No autenticado" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Token inválido" });
        }
        res.json({ user: { id: decoded.id, role: decoded.role } });
    });
}

// ✅ **Exportar las funciones**
module.exports = { register, login, getUserById, updateUser, deleteUser, verifyAuth, verifyToken };
