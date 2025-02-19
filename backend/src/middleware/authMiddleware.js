const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || "secreto_super_seguro";

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
    let token = req.cookies.token; // Intentar obtener el token desde cookies

    if (!token) {
        const authHeader = req.headers["authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1]; // Extraer el token del header
        }
    }

    if (!token) {
        return res.status(403).json({ error: 'Token requerido' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = { verifyToken };
