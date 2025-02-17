const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const errorHandler = require("./src/middleware/errorMiddleware");
const { sequelize } = require("./src/models/index"); // ✅ Usar Sequelize en lugar de mysql2

// ✅ Inicializar Express antes de importar rutas
const app = express();

// ✅ Importar rutas después de inicializar Express
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/users");
const binaryRoutes = require("./src/routes/binaryRoutes");
const compensationRoutes = require("./src/routes/compensationRoutes");
const unilevelRoutes = require("./src/routes/unilevelRoutes"); // ✅ Rutas Unilevel

// Middleware para parseo de JSON, cookies y CORS
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://tudominio.com", "http://localhost:3000"],
    credentials: true,
  })
);

// ✅ Definir las rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/binary", binaryRoutes);
app.use("/api/compensation", compensationRoutes);
app.use("/api/unilevel", unilevelRoutes); // ✅ Ruta Unilevel agregada correctamente

const SECRET_KEY = process.env.SECRET_KEY || "secreto_super_seguro";

// 📌 **Conexión a la base de datos con Sequelize**
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Conectado a la base de datos MySQL con Sequelize");
    return sequelize.sync(); // ✅ Sincroniza modelos con la base de datos
  })
  .then(() => console.log("✅ Modelos sincronizados con la base de datos"))
  .catch((err) => console.error("❌ Error en la conexión a MySQL:", err));

// ✅ Middleware para verificar JWT en Cookies (Usar en rutas protegidas)
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ error: "Token requerido" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token inválido" });
    req.user = decoded;
    next();
  });
};

// ✅ Rate Limiting en login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Demasiados intentos de inicio de sesión. Inténtalo más tarde.",
});

// ✅ Ruta de prueba para verificar el servidor
app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente." });
});

// 📌 Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// 📌 Middleware global de manejo de errores (debe estar al final)
app.use(errorHandler);

// 🚀 **Iniciar el servidor**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
