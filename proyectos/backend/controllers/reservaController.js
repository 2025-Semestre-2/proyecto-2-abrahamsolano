const { executeSP, executeQuery } = require('../services/dbService');

exports.createReserva = async (req, res) => {
  const { cliente_id, habitacion_id, fecha_entrada, fecha_salida, num_huespedes } = req.body;
  try {
    const result = await executeSP('sp_CrearReserva', { cliente_id, habitacion_id, fecha_entrada, fecha_salida, num_huespedes });
    res.json({ id: result[0].reserva_id, message: result[0].resultado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReservas = async (req, res) => {
  try {
    const reservas = await executeQuery('SELECT * FROM vw_ReservasActivas');
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReservaById = async (req, res) => {
  const { id } = req.params;
  try {
    const reserva = await executeQuery(`SELECT * FROM vw_ReservasActivas WHERE reserva_id = @id`, { id });
    if (!reserva || reserva.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.json(reserva[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReservasByCliente = async (req, res) => {
  const { cliente_id } = req.params;
  try {
    const reservas = await executeQuery(`SELECT * FROM vw_ReservasActivas WHERE cliente_id = @cliente_id`, { cliente_id });
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReserva = async (req, res) => {
  const { id } = req.params;
  const { fecha_entrada, fecha_salida, num_huespedes, estado } = req.body;
  try {
    const result = await executeSP('sp_ActualizarReserva', { reserva_id: id, fecha_entrada, fecha_salida, num_huespedes, estado });
    res.json({ message: result[0].resultado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelarReserva = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await executeSP('sp_CancelarReserva', { reserva_id: id });
    res.json({ message: result[0].resultado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkDisponibilidad = async (req, res) => {
  const { habitacion_id, fecha_entrada, fecha_salida } = req.body;
  try {
    const result = await executeQuery(
      `SELECT * FROM fn_VerificarDisponibilidad(@habitacion_id, @fecha_entrada, @fecha_salida)`,
      { habitacion_id, fecha_entrada, fecha_salida }
    );
    res.json({ disponible: result[0]?.disponible || false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
