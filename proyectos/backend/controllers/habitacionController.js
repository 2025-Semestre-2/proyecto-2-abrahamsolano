// controllers/habitacionController.js
/**
 * Controlador para gestión de habitaciones
 * Conecta con tablas: Habitacion, TipoHabitacion, FotoHabitacion
 */

/**
 * Obtener habitaciones disponibles (públicas)
 */
exports.getHabitacionesDisponibles = async (req, res) => {
  try {
    const habitaciones = await executeQuery(`
      SELECT 
        h.habitacion_id,
        h.numero_habitacion,
        th.nombre_tipo_habitacion,
        th.descripcion_tipo_habitacion,
        th.precio_noche,
        h.empresa_id,
        e.nombre_empresa,
        h.estado_habitacion,
        COUNT(fh.foto_id) as cantidad_fotos
      FROM Habitacion h
      INNER JOIN TipoHabitacion th ON h.tipo_habitacion_id = th.tipo_habitacion_id
      INNER JOIN Empresa e ON h.empresa_id = e.cedula_juridica
      LEFT JOIN FotoHabitacion fh ON h.habitacion_id = fh.habitacion_id
      WHERE h.estado_habitacion = 1
      GROUP BY 
        h.habitacion_id,
        h.numero_habitacion,
        th.nombre_tipo_habitacion,
        th.descripcion_tipo_habitacion,
        th.precio_noche,
        h.empresa_id,
        e.nombre_empresa,
        h.estado_habitacion
      ORDER BY e.nombre_empresa, h.numero_habitacion
    `);

    res.json({
      success: true,
      data: habitaciones,
      count: habitaciones.length
    });
  } catch (error) {
    console.error('Error obteniendo habitaciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener habitaciones',
      details: error.message
    });
  }
};

/**
 * Obtener habitaciones de un hotel específico
 */
exports.getHabitacionesByHotel = async (req, res) => {
  try {
    const { empresa_id } = req.params;

    const habitaciones = await executeQuery(`
      SELECT 
        h.habitacion_id,
        h.numero_habitacion,
        th.tipo_habitacion_id,
        th.nombre_tipo_habitacion,
        th.descripcion_tipo_habitacion,
        th.precio_noche,
        h.estado_habitacion,
        COUNT(fh.foto_id) as cantidad_fotos
      FROM Habitacion h
      INNER JOIN TipoHabitacion th ON h.tipo_habitacion_id = th.tipo_habitacion_id
      LEFT JOIN FotoHabitacion fh ON h.habitacion_id = fh.habitacion_id
      WHERE h.empresa_id = @empresa_id
      GROUP BY 
        h.habitacion_id,
        h.numero_habitacion,
        th.tipo_habitacion_id,
        th.nombre_tipo_habitacion,
        th.descripcion_tipo_habitacion,
        th.precio_noche,
        h.estado_habitacion
      ORDER BY h.numero_habitacion
    `, { empresa_id });

    res.json({
      success: true,
      data: habitaciones,
      count: habitaciones.length
    });
  } catch (error) {
    console.error('Error obteniendo habitaciones del hotel:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener habitaciones',
      details: error.message
    });
  }
};

/**
 * Obtener detalles de una habitación (con fotos)
 */
exports.getHabitacionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener info de la habitación
    const habitacion = await executeQuery(`
      SELECT 
        h.habitacion_id,
        h.numero_habitacion,
        th.tipo_habitacion_id,
        th.nombre_tipo_habitacion,
        th.descripcion_tipo_habitacion,
        th.precio_noche,
        h.estado_habitacion,
        h.empresa_id,
        e.nombre_empresa
      FROM Habitacion h
      INNER JOIN TipoHabitacion th ON h.tipo_habitacion_id = th.tipo_habitacion_id
      INNER JOIN Empresa e ON h.empresa_id = e.cedula_juridica
      WHERE h.habitacion_id = @id
    `, { id: parseInt(id) });

    if (!habitacion || habitacion.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Habitación no encontrada'
      });
    }

    // Obtener fotos
    const fotos = await executeQuery(`
      SELECT 
        foto_id,
        tipo_foto_id,
        ruta_foto,
        descripcion_foto,
        fecha_carga
      FROM FotoHabitacion
      WHERE habitacion_id = @habitacion_id
      ORDER BY fecha_carga DESC
    `, { habitacion_id: parseInt(id) });

    res.json({
      success: true,
      data: {
        ...habitacion[0],
        fotos: fotos
      }
    });
  } catch (error) {
    console.error('Error obteniendo habitación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener habitación',
      details: error.message
    });
  }
};

/**
 * Crear nueva habitación (solo empresa propietaria)
 */
exports.createHabitacion = async (req, res) => {
  try {
    const {
      numero_habitacion,
      tipo_habitacion_id,
      empresa_id,
      estado_habitacion = 1
    } = req.body;

    // Validaciones
    if (!numero_habitacion || !tipo_habitacion_id || !empresa_id) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos'
      });
    }

    // Verificar que el tipo de habitación existe
    const tipoExiste = await executeQuery(`
      SELECT tipo_habitacion_id FROM TipoHabitacion
      WHERE tipo_habitacion_id = @tipo_id
    `, { tipo_id: tipo_habitacion_id });

    if (!tipoExiste || tipoExiste.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Tipo de habitación no válido'
      });
    }

    // Insertar habitación
    await executeQuery(`
      INSERT INTO Habitacion 
      (numero_habitacion, tipo_habitacion_id, empresa_id, estado_habitacion)
      VALUES (@num, @tipo, @emp, @estado)
    `, {
      num: numero_habitacion,
      tipo: tipo_habitacion_id,
      emp: empresa_id,
      estado: estado_habitacion
    });

    res.status(201).json({
      success: true,
      message: 'Habitación creada correctamente'
    });

  } catch (error) {
    console.error('Error creando habitación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear habitación',
      details: error.message
    });
  }
};

/**
 * Actualizar estado de habitación
 */
exports.updateHabitacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_habitacion } = req.body;

    if (estado_habitacion === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Campo estado_habitacion requerido'
      });
    }

    await executeQuery(`
      UPDATE Habitacion
      SET estado_habitacion = @estado
      WHERE habitacion_id = @id
    `, {
      estado: estado_habitacion ? 1 : 0,
      id: parseInt(id)
    });

    res.json({
      success: true,
      message: 'Habitación actualizada correctamente'
    });

  } catch (error) {
    console.error('Error actualizando habitación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar habitación',
      details: error.message
    });
  }
};

/**
 * Obtener disponibilidad de una habitación en rango de fechas
 */
exports.checkDisponibilidad = async (req, res) => {
  try {
    const { habitacion_id, fecha_entrada, fecha_salida } = req.body;

    if (!habitacion_id || !fecha_entrada || !fecha_salida) {
      return res.status(400).json({
        success: false,
        error: 'Faltan parámetros requeridos'
      });
    }

    // Buscar reservas que se solapen con las fechas solicitadas
    const conflicto = await executeQuery(`
      SELECT COUNT(*) as cantidad
      FROM Reserva
      WHERE habitacion_id = @hab_id
        AND fecha_check_in < @fecha_salida
        AND fecha_check_out > @fecha_entrada
    `, {
      hab_id: habitacion_id,
      fecha_entrada: new Date(fecha_entrada),
      fecha_salida: new Date(fecha_salida)
    });

    const disponible = conflicto[0]?.cantidad === 0;

    res.json({
      success: true,
      disponible: disponible,
      message: disponible ? 'Habitación disponible' : 'Habitación no disponible en esas fechas'
    });

  } catch (error) {
    console.error('Error verificando disponibilidad:', error);
    res.status(500).json({
      success: false,
      error: 'Error al verificar disponibilidad',
      details: error.message
    });
  }
};

/**
 * Subir foto de habitación
 */
exports.uploadFotoHabitacion = async (req, res) => {
  try {
    const { habitacion_id, tipo_foto_id, ruta_foto, descripcion_foto } = req.body;

    if (!habitacion_id || !tipo_foto_id || !ruta_foto) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos'
      });
    }

    await executeQuery(`
      INSERT INTO FotoHabitacion 
      (habitacion_id, tipo_foto_id, ruta_foto, descripcion_foto, fecha_carga)
      VALUES (@hab, @tipo, @ruta, @desc, GETDATE())
    `, {
      hab: habitacion_id,
      tipo: tipo_foto_id,
      ruta: ruta_foto,
      desc: descripcion_foto || null
    });

    res.status(201).json({
      success: true,
      message: 'Foto subida correctamente'
    });

  } catch (error) {
    console.error('Error subiendo foto:', error);
    res.status(500).json({
      success: false,
      error: 'Error al subir foto',
      details: error.message
    });
  }
};