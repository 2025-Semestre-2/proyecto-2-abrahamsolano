const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacionController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, habitacionController.createHabitacion);
router.get('/', habitacionController.getHabitaciones);
router.get('/hotel/:empresa_id', habitacionController.getHabitacionesByHotel);
router.get('/:id', habitacionController.getHabitacionById);
router.put('/:id', authenticate, habitacionController.updateHabitacion);
router.delete('/:id', authenticate, habitacionController.deleteHabitacion);

module.exports = router;
