const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/ocupacion', authenticate, reporteController.getReporteOcupacion);
router.get('/ingresos', authenticate, reporteController.getReporteIngresos);
router.get('/reservas', authenticate, reporteController.getReporteReservas);
router.get('/clientes', authenticate, reporteController.getReporteClientes);
router.get('/periodo', authenticate, reporteController.getReportePorPeriodo);
router.get('/resumen/hoteles', authenticate, reporteController.getResumenHoteles);

module.exports = router;
