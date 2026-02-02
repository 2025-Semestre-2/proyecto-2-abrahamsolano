// controllers/hotelController.js
const sql = require('mssql');

/**
 * Obtener todos los hoteles registrados
 */
exports.getHoteles = async (req, res) => {
  try {
    // Ejecutar vista desde BD
    const hoteles = await executeQuery(`
      SELECT 
        cedula_juridica as id,
        nombre_empresa as nombre,
        tipo_alojamiento as tipo,
        provincia,
        canton,
        distrito,
        correo_electronico,
        url_sitio_web
      FROM Empresa
      ORDER BY nombre_empresa
    `);

    res.json({
      success: true,
      data: hoteles,
      count: hoteles.length
    });
  } catch (error) {
    console.error('Error obteniendo hoteles:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los hoteles',
      details: error.message
    });
  }
};

/**
 * Obtener hotel por ID (cédula jurídica)
 */
exports.getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await executeQuery(`
      SELECT 
        cedula_juridica as id,
        nombre_empresa as nombre,
        tipo_alojamiento as tipo,
        provincia,
        canton,
        distrito,
        direccion_exacta,
        correo_electronico,
        url_sitio_web,
        redes_sociales
      FROM Empresa
      WHERE cedula_juridica = @cedula
    `, { cedula: id });

    if (!hotel || hotel.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Hotel no encontrado'
      });
    }

    // Obtener telefonos del hotel
    const telefonos = await executeQuery(`
      SELECT numero_telefono, codigo_pais
      FROM TelefonoEmpresa
      WHERE empresa_id = @empresa_id
    `, { empresa_id: id });

    // Obtener servicios del hotel
    const servicios = await executeQuery(`
      SELECT s.nombre_servicio
      FROM Servicio s
      INNER JOIN EmpresaServicio es ON s.servicio_id = es.servicio_id
      WHERE es.empresa_id = @empresa_id
    `, { empresa_id: id });

    res.json({
      success: true,
      data: {
        ...hotel[0],
        telefonos: telefonos,
        servicios: servicios.map(s => s.nombre_servicio)
      }
    });
  } catch (error) {
    console.error('Error obteniendo hotel:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el hotel',
      details: error.message
    });
  }
};

/**
 * Crear un nuevo hotel
 */
exports.createHotel = async (req, res) => {
  try {
    const {
      cedula_juridica,
      nombre_empresa,
      tipo_alojamiento,
      provincia,
      canton,
      distrito,
      direccion_exacta,
      correo_electronico,
      url_sitio_web,
      redes_sociales,
      telefonos,
      servicios
    } = req.body;

    // Validaciones básicas
    if (!cedula_juridica || !nombre_empresa || !correo_electronico) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos'
      });
    }

    // Insertar empresa (usando query directa - idealmente usar SP)
    await executeQuery(`
      INSERT INTO Empresa 
      (cedula_juridica, nombre_empresa, tipo_alojamiento, provincia, canton, distrito, 
       direccion_exacta, correo_electronico, url_sitio_web, redes_sociales)
      VALUES (@ced, @nom, @tipo, @prov, @cant, @dist, @dir, @correo, @web, @redes)
    `, {
      ced: cedula_juridica,
      nom: nombre_empresa,
      tipo: tipo_alojamiento,
      prov: provincia,
      cant: canton,
      dist: distrito,
      dir: direccion_exacta,
      correo: correo_electronico,
      web: url_sitio_web || null,
      redes: redes_sociales || null
    });

    // Insertar telefonos
    if (telefonos && Array.isArray(telefonos)) {
      for (const tel of telefonos) {
        await executeQuery(`
          INSERT INTO TelefonoEmpresa (empresa_id, numero_telefono, codigo_pais)
          VALUES (@emp, @num, @cod)
        `, {
          emp: cedula_juridica,
          num: tel.numero,
          cod: tel.codigo_pais
        });
      }
    }

    // Insertar servicios
    if (servicios && Array.isArray(servicios)) {
      for (const servicio_id of servicios) {
        await executeQuery(`
          INSERT INTO EmpresaServicio (empresa_id, servicio_id)
          VALUES (@emp, @ser)
        `, {
          emp: cedula_juridica,
          ser: servicio_id
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Hotel creado correctamente',
      data: { cedula_juridica }
    });

  } catch (error) {
    console.error('Error creando hotel:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear el hotel',
      details: error.message
    });
  }
};

/**
 * Actualizar hotel (solo datos básicos, no eliminar)
 */
exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_empresa,
      correo_electronico,
      url_sitio_web,
      redes_sociales
    } = req.body;

    await executeQuery(`
      UPDATE Empresa
      SET 
        nombre_empresa = @nom,
        correo_electronico = @correo,
        url_sitio_web = @web,
        redes_sociales = @redes
      WHERE cedula_juridica = @ced
    `, {
      nom: nombre_empresa,
      correo: correo_electronico,
      web: url_sitio_web,
      redes: redes_sociales,
      ced: id
    });

    res.json({
      success: true,
      message: 'Hotel actualizado correctamente'
    });

  } catch (error) {
    console.error('Error actualizando hotel:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el hotel',
      details: error.message
    });
  }
};

/**
 * Buscar hoteles con filtros
 */
exports.searchHoteles = async (req, res) => {
  try {
    const { provincia, tipo, nombre } = req.query;

    let query = `
      SELECT 
        cedula_juridica as id,
        nombre_empresa as nombre,
        tipo_alojamiento as tipo,
        provincia,
        canton,
        distrito,
        correo_electronico
      FROM Empresa
      WHERE 1=1
    `;

    const params = {};

    if (provincia) {
      query += ` AND provincia = @provincia`;
      params.provincia = provincia;
    }

    if (tipo) {
      query += ` AND tipo_alojamiento = @tipo`;
      params.tipo = tipo;
    }

    if (nombre) {
      query += ` AND nombre_empresa LIKE @nombre`;
      params.nombre = `%${nombre}%`;
    }

    query += ` ORDER BY nombre_empresa`;

    const hoteles = await executeQuery(query, params);

    res.json({
      success: true,
      data: hoteles,
      count: hoteles.length
    });

  } catch (error) {
    console.error('Error buscando hoteles:', error);
    res.status(500).json({
      success: false,
      error: 'Error al buscar hoteles',
      details: error.message
    });
  }
};