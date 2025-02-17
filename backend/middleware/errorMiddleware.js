const logger = require('../config/logger');

const errorMiddleware = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.url}`);
  res.status(500).json({ error: 'Ocurrió un error en el servidor' });
};

module.exports = errorMiddleware;
