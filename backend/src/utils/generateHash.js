const bcrypt = require("bcryptjs");

async function generarHash() {
    const password = "test1234"; // La contraseña real que usa user1
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(`Contraseña encriptada:`, hashedPassword);
}

generarHash();
