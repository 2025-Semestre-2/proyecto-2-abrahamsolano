const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, clienteController.createCliente);
router.get('/', authenticate, clienteController.getClientes);
router.get('/:id', authenticate, clienteController.getClienteById);
router.put('/:id', authenticate, clienteController.updateCliente);
router.delete('/:id', authenticate, clienteController.deleteCliente);

module.exports = router;
