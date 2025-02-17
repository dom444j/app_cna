// Importamos Sequelize, que es un ORM para Node.js que nos permite interactuar con bases de datos SQL.
const { Sequelize } = require('sequelize');

// Cargamos las variables de entorno desde el archivo .env usando dotenv.
require('dotenv').config();

// Configuración de la conexión a MySQL
// Creamos una instancia de Sequelize, que representa la conexión a la base de datos.
const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL) // Si DATABASE_URL está definida, la usamos para la conexión.
    : new Sequelize(
        process.env.DB_NAME || 'multinivel_system', // Nombre de la base de datos
        process.env.DB_USER || 'root', // Usuario de la base de datos
        process.env.DB_PASSWORD || '', // Contraseña de la base de datos
        {
            host: process.env.DB_HOST || 'localhost', // Host de la base de datos
            port: process.env.DB_PORT || 3306, // Puerto de la base de datos
            dialect: 'mysql', // Tipo de base de datos
            logging: false, // Desactiva logs en consola para evitar ruido innecesario
        }
    );

// Probar la conexión
// Usamos el método authenticate() de Sequelize para verificar que la conexión a la base de datos es exitosa.
sequelize.authenticate()
    .then(() => console.log("✅ Conectado a la base de datos MySQL")) // Mensaje de éxito si la conexión es exitosa.
    .catch(err => console.error("❌ Error en la conexión:", err)); // Mensaje de error si la conexión falla.

// Exportamos la instancia de Sequelize para que pueda ser utilizada en otras partes de la aplicación.
module.exports = sequelize;
