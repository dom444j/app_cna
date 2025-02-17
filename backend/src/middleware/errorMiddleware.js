const winston = require('winston');

// Configuración de logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log' })
  ]
});

// Middleware de manejo de errores
function errorHandler(err, req, res, next) {
  logger.error(`Error en la ruta ${req.url}: ${err.message}`, {
    stack: err.stack,
    method: req.method,
    headers: req.headers
  });

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Error interno del servidor' : err.message,
    code: statusCode,
    timestamp: new Date().toISOString()
  });
}

module.exports = errorHandler;
