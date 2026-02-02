const { sql, poolPromise } = require('../config/db');

async function executeSP(spName, params = {}) {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    Object.keys(params).forEach(key => request.input(key, params[key]));
    const result = await request.execute(spName);
    return result.recordset || result.returnValue;
  } catch (err) {
    throw new Error(`Error ejecutando SP ${spName}: ${err.message}`);
  }
}

async function executeQuery(query) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    throw new Error(`Error en query: ${err.message}`);
  }
}

module.exports = { executeSP, executeQuery };