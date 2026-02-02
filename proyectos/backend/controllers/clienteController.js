const { executeSP, executeQuery } = require('../services/dbService');

exports.createCliente = async (req, res) => {
  const { cedula, nombre, apellido, email, telefono } = req.body;
  try {
    const result = await executeSP('sp_CrearCliente', { cedula, nombre, apellido, email, telefono });
    res.json({ id: result[0].cliente_id, message: result[0].resultado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClientes = async (req, res) => {
  try {
    const clientes = await executeQuery('SELECT * FROM vw_ClientesRegistrados');
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClienteById = async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await executeQuery(`SELECT * FROM vw_ClientesRegistrados WHERE cliente_id = @id`, { id });
    if (!cliente || cliente.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, telefono } = req.body;
  try {
    const result = await executeSP('sp_ActualizarCliente', { cliente_id: id, nombre, apellido, email, telefono });
    res.json({ message: result[0].resultado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await executeSP('sp_EliminarCliente', { cliente_id: id });
    res.json({ message: result[0].resultado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
