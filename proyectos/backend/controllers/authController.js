const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, getPool } = require('../config/db');

exports.login = async (req, res) => {
  try {
    const { email, password, type } = req.body;

    // Validar que lleguen los datos
    if (!email || !password || !type) {
      return res.status(400).json({
        success: false,
        error: 'Email, contraseña y tipo de usuario son obligatorios'
      });
    }

    const pool = await getPool();
    
    // Buscar usuario en la BD
    let query = `SELECT * FROM usuarios WHERE email = @email`;
    
    if (type === 'cliente') {
      query = `
        SELECT u.usuario_id, u.email, u.password_hash, u.tipo_usuario, c.nombre
        FROM usuarios u
        LEFT JOIN clientes c ON u.usuario_id = c.usuario_id
        WHERE u.email = @email AND u.tipo_usuario = 'cliente'
      `;
    } else if (type === 'empresa') {
      query = `
        SELECT u.usuario_id, u.email, u.password_hash, u.tipo_usuario, e.nombre
        FROM usuarios u
        LEFT JOIN empresas e ON u.usuario_id = e.usuario_id
        WHERE u.email = @email AND u.tipo_usuario = 'empresa'
      `;
    }

    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query(query);

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Contraseña incorrecta'
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        id: user.usuario_id, 
        email: user.email, 
        type: user.tipo_usuario 
      },
      process.env.JWT_SECRET || 'tu_secreto_super_seguro',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.usuario_id,
          email: user.email,
          type: user.tipo_usuario,
          name: user.nombre || email.split('@')[0]
        }
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error en el servidor'
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, type, nombre_empresa, nombre, ubicacion, telefono } = req.body;

    // Validar datos
    if (!email || !password || !type) {
      return res.status(400).json({
        success: false,
        error: 'Email, contraseña y tipo son obligatorios'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const pool = await getPool();

    // Verificar que el usuario no exista
    const checkUser = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT usuario_id FROM usuarios WHERE email = @email');

    if (checkUser.recordset.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'El correo electrónico ya está registrado'
      });
    }

    // Hash la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const userInsert = await pool.request()
      .input('email', sql.VarChar, email)
      .input('password_hash', sql.VarChar, hashedPassword)
      .input('tipo_usuario', sql.VarChar, type)
      .query(`
        INSERT INTO usuarios (email, password_hash, tipo_usuario)
        VALUES (@email, @password_hash, @tipo_usuario)
        SELECT SCOPE_IDENTITY() as usuario_id
      `);

    const usuarioId = userInsert.recordset[0].usuario_id;

    // Si es cliente, insertar en tabla clientes
    if (type === 'cliente') {
      await pool.request()
        .input('usuario_id', sql.Int, usuarioId)
        .input('nombre', sql.VarChar, nombre || email.split('@')[0])
        .query(`
          INSERT INTO clientes (usuario_id, nombre, telefono)
          VALUES (@usuario_id, @nombre, @telefono)
        `)
        .input('telefono', sql.VarChar, telefono || '');
    }

    // Si es empresa, insertar en tabla empresas
    if (type === 'empresa') {
      await pool.request()
        .input('usuario_id', sql.Int, usuarioId)
        .input('nombre', sql.VarChar, nombre_empresa || email.split('@')[0])
        .input('ubicacion', sql.VarChar, ubicacion || '')
        .query(`
          INSERT INTO empresas (usuario_id, nombre, ubicacion)
          VALUES (@usuario_id, @nombre, @ubicacion)
        `);
    }

    res.status(201).json({
      success: true,
      data: {
        message: 'Usuario registrado exitosamente',
        user: {
          id: usuarioId,
          email,
          type,
          name: type === 'empresa' ? nombre_empresa : nombre
        }
      }
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error en el servidor'
    });
  }
};

exports.logout = (req, res) => {
  res.json({
    success: true,
    data: { message: 'Sesión cerrada' }
  });
};

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token no encontrado'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'tu_secreto_super_seguro'
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token inválido'
    });
  }
};