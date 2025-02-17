const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const process = require("process");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "..", "config", "config.json"))[env];

const db = {};

// ✅ Inicializar Sequelize correctamente
let sequelize;
if (config.use_env_variable && process.env[config.use_env_variable]) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
  console.log(`✅ Inicializando Sequelize usando DATABASE_URL`);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false, // 🔹 Desactiva logs en consola
  });
  console.log(`✅ Inicializando Sequelize con configuración separada`);
}

// ✅ Cargar todos los modelos automáticamente
fs.readdirSync(__dirname)
  .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
  .forEach((file) => {
    const modelPath = path.join(__dirname, file);
    try {
      const model = require(modelPath)(sequelize, DataTypes);
      db[model.name] = model;
    } catch (error) {
      console.error(`❌ Error cargando el modelo ${file}:`, error);
    }
  });

// ✅ Importar manualmente modelos específicos para evitar problemas de carga
const modelsToLoad = ["User", "UnilevelTree", "Transactions"];
modelsToLoad.forEach((modelName) => {
  try {
    const model = require(`./${modelName.toLowerCase()}`)(sequelize, DataTypes);
    db[modelName] = model;
  } catch (error) {
    console.error(`❌ Error cargando manualmente el modelo ${modelName}:`, error);
  }
});

// ✅ Establecer asociaciones de modelos si existen
Object.keys(db).forEach((modelName) => {
  if (typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
});

// ✅ Exportar la conexión y los modelos
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

