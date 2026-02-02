// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar JWT
 * Protege rutas que requieren autenticación
 */
const authenticate = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token no proporcionado o formato inválido' 
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
    
    // Agregar información del usuario al request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    
    return res.status(401).json({ 
      error: 'Token inválido',
      details: error.message 
    });
  }
};

/**
 * Middleware para verificar rol de usuario
 * @param {string|array} rolesPermitidos - Rol(es) permitido(s)
 */
const authorize = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const rolesArray = Array.isArray(rolesPermitidos) 
      ? rolesPermitidos 
      : [rolesPermitidos];

    if (!rolesArray.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para acceder a este recurso' 
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };