const { executeSP, executeQuery } = require('../services/dbService');

exports.getReporteOcupacion = async (req, res) => {
  const { empresa_id, fecha_inicio, fecha_fin } = req.query;
  try {
    const result = await executeSP('sp_ReporteOcupacion', { empresa_id, fecha_inicio, fecha_fin });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReporteIngresos = async (req, res) => {
  const { empresa_id, fecha_inicio, fecha_fin } = req.query;
  try {
    const result = await executeSP('sp_ReporteIngresos', { empresa_id, fecha_inicio, fecha_fin });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReporteReservas = async (req, res) => {
  const { empresa_id, estado } = req.query;
  try {
    const result = await executeQuery(
      `SELECT * FROM vw_ReporteReservas WHERE empresa_id = @empresa_id AND estado = @estado`,
      { empresa_id, estado }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReporteClientes = async (req, res) => {
  const { empresa_id } = req.query;
  try {
    const result = await executeQuery(
      `SELECT * FROM vw_ReporteClientes WHERE empresa_id = @empresa_id`,
      { empresa_id }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReportePorPeriodo = async (req, res) => {
  const { empresa_id, fecha_inicio, fecha_fin } = req.query;
  try {
    const result = await executeSP('sp_ReportePorPeriodo', { empresa_id, fecha_inicio, fecha_fin });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getResumenHoteles = async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM vw_ResumenHoteles');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
