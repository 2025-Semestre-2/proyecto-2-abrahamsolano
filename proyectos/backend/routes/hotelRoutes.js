// routes/hotelRoutes.js
const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * RUTAS PÚBLICAS (sin autenticación)
 */

// Obtener todos los hoteles
router.get('/', hotelController.getHoteles);

// Obtener hotel por ID
router.get('/:id', hotelController.getHotelById);

// Buscar hoteles con filtros (provincia, tipo, nombre)
router.get('/search/filter', hotelController.searchHoteles);

/**
 * RUTAS PROTEGIDAS (requieren autenticación)
 */

// Crear nuevo hotel (solo empresas)
router.post('/', 
  authenticate, 
  authorize('empresa'), 
  hotelController.createHotel
);

// Actualizar hotel (solo la empresa propietaria)
router.put('/:id', 
  authenticate, 
  authorize('empresa'), 
  hotelController.updateHotel
);

module.exports = router;