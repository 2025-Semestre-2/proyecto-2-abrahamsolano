const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, reservaController.createReserva);
router.get('/', authenticate, reservaController.getReservas);
router.get('/:id', authenticate, reservaController.getReservaById);
router.get('/cliente/:cliente_id', authenticate, reservaController.getReservasByCliente);
router.put('/:id', authenticate, reservaController.updateReserva);
router.post('/:id/cancelar', authenticate, reservaController.cancelarReserva);
router.post('/disponibilidad/check', reservaController.checkDisponibilidad);

module.exports = router;
