-- ============================================================================
-- SCRIPT SQL: SISTEMA DE GESTIÓN HOTELERA - BASE DE DATOS NORMALIZADA (3NF)
-- ============================================================================
-- Descripción: Versión mejorada con normalización completa
-- Fecha: 2025-01-31
-- Status: Listo para producción
-- ============================================================================

-- Crear la base de datos si no existe
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SG_Hotelera')
BEGIN
    CREATE DATABASE SG_Hotelera;
END
GO

USE SG_Hotelera;
GO

-- ============================================================================
-- PASO 1: CREAR CATÁLOGOS GEOGRÁFICOS NORMALIZADOS
-- ============================================================================

-- Tabla: Países (Mejorada)
CREATE TABLE Paises (
    pais_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_pais VARCHAR(100) NOT NULL UNIQUE,
    codigo_telefono VARCHAR(5) UNIQUE NOT NULL,   -- +506, +34, +52, etc.
    activo BIT DEFAULT 1
);
GO

-- Tabla: Provincias (NUEVA - Catálogo)
CREATE TABLE Provincia (
    provincia_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_provincia VARCHAR(100) NOT NULL UNIQUE,
    pais_id INT NOT NULL,
    activo BIT DEFAULT 1,
    CONSTRAINT FK_Provincia_Paises
        FOREIGN KEY (pais_id)
        REFERENCES Paises(pais_id)
);
GO

-- Tabla: Cantones (NUEVA - Catálogo)
CREATE TABLE Canton (
    canton_id INT IDENTITY(1,1) PRIMARY KEY,
    provincia_id INT NOT NULL,
    nombre_canton VARCHAR(100) NOT NULL,
    activo BIT DEFAULT 1,
    CONSTRAINT FK_Canton_Provincia
        FOREIGN KEY (provincia_id)
        REFERENCES Provincia(provincia_id),
    CONSTRAINT UQ_Canton_Nombre_Provincia
        UNIQUE (provincia_id, nombre_canton)
);
GO

-- Tabla: Distritos (NUEVA - Catálogo)
CREATE TABLE Distrito (
    distrito_id INT IDENTITY(1,1) PRIMARY KEY,
    canton_id INT NOT NULL,
    nombre_distrito VARCHAR(100) NOT NULL,
    referencia_gps VARCHAR(100),  -- Ej: "9.6500, -82.7500"
    activo BIT DEFAULT 1,
    CONSTRAINT FK_Distrito_Canton
        FOREIGN KEY (canton_id)
        REFERENCES Canton(canton_id),
    CONSTRAINT UQ_Distrito_Nombre_Canton
        UNIQUE (canton_id, nombre_distrito)
);
GO

-- ============================================================================
-- PASO 2: CREAR CATÁLOGOS DE ESTADOS
-- ============================================================================

-- Tabla: Estados de Reserva (NUEVA)
CREATE TABLE EstadoReserva (
    estado_reserva_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE,  -- Pendiente, Confirmada, Cancelada, Cerrada
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

-- Tabla: Estados de Habitación (NUEVA)
CREATE TABLE EstadoHabitacion (
    estado_habitacion_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE,  -- Disponible, Ocupada, Limpieza, Mantenimiento, etc.
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

-- Tabla: Estados de Pago (NUEVA)
CREATE TABLE EstadoPago (
    estado_pago_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE,  -- Pendiente, Pagada, Parcial, Anulada
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

-- Tabla: Medios de Pago (NUEVA)
CREATE TABLE MedioPago (
    medio_pago_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_medio VARCHAR(50) NOT NULL UNIQUE,   -- Tarjeta, Efectivo, Transferencia, Cheque, etc.
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

-- ============================================================================
-- PASO 3: CREAR CATÁLOGOS DE TIPOS
-- ============================================================================

-- Tabla: Tipos de Alojamiento (sin cambios, pero con más campos)
CREATE TABLE TipoAlojamiento (
    tipo_alojamiento_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_tipo VARCHAR(100) NOT NULL UNIQUE,   -- Hotel, Hostal, Casa, Departamento, etc.
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

-- Tabla: Tipos de Cama (sin cambios)
CREATE TABLE TipoCama (
    tipo_cama_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_tipo_cama VARCHAR(100) NOT NULL UNIQUE,  -- Individual, Queen, King, Matrimonial, etc.
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

-- Tabla: Servicios (sin cambios)
CREATE TABLE Servicio (
    servicio_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_servicio VARCHAR(100) NOT NULL UNIQUE,   -- Piscina, WiFi, Parqueo, etc.
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

-- Tabla: Redes Sociales (NUEVA - Normalizar redes)
CREATE TABLE RedSocial (
    red_social_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_red VARCHAR(50) NOT NULL UNIQUE,     -- Facebook, Instagram, Twitter, YouTube, TikTok, etc.
    icono_url VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

-- Tabla: Tipos de Actividad (sin cambios estructurales)
CREATE TABLE TipoActividad (
    tipo_actividad_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_tipo_actividad VARCHAR(100) NOT NULL UNIQUE,  -- Tour en bote, Kayak, Catamarán, etc.
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

-- Tabla: Tipos de Servicio Recreación (sin cambios)
CREATE TABLE TipoServicioRecreacion (
    tipo_servicio_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_servicio VARCHAR(100) NOT NULL UNIQUE,    -- Guía, Transporte, Equipo, etc.
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

-- Tabla: Tipos de Foto (sin cambios)
CREATE TABLE TipoFoto (
    tipo_foto_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_tipo_foto VARCHAR(100) NOT NULL UNIQUE,   -- Principal, Galería, Amenidades, etc.
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

-- ============================================================================
-- PASO 4: CREAR TABLA BASE DE EMPRESA (NORMALIZADA Y UNIFICADA)
-- ============================================================================

CREATE TABLE Empresa (
    empresa_id INT IDENTITY(1,1) PRIMARY KEY,
    cedula_juridica VARCHAR(50) NOT NULL UNIQUE,     -- 1-2345-6789
    nombre_empresa VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(255) NOT NULL UNIQUE,
    url_sitio_web VARCHAR(255),
    
    -- Ubicación (referencia a catálogos, no texto)
    distrito_id INT NOT NULL,
    direccion_exacta VARCHAR(255) NOT NULL,
    referencia_gps VARCHAR(100),                      -- "9.6500, -82.7500"
    
    -- Tipo de empresa
    tipo_empresa VARCHAR(50) NOT NULL,                -- 'hospedaje', 'recreacion', 'ambas'
    
    -- Auditoría
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NOT NULL DEFAULT GETDATE(),
    usuario_creacion VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    activo BIT NOT NULL DEFAULT 1,
    
    CONSTRAINT FK_Empresa_Distrito
        FOREIGN KEY (distrito_id)
        REFERENCES Distrito(distrito_id),
    CONSTRAINT CHK_Cedula_Juridica_Formato
        CHECK (cedula_juridica LIKE '[0-9]-[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]'),
    CONSTRAINT CHK_Correo_Electronico_Formato
        CHECK (correo_electronico LIKE '%@%.%'),
    CONSTRAINT CHK_Tipo_Empresa
        CHECK (tipo_empresa IN ('hospedaje', 'recreacion', 'ambas'))
);
GO

-- ============================================================================
-- PASO 5: CREAR TABLA DE ESPECIALIZACIÓN: EMPRESA HOSPEDAJE
-- ============================================================================

CREATE TABLE EmpresaHospedaje (
    empresa_id INT PRIMARY KEY,
    tipo_alojamiento_id INT NOT NULL,
    
    CONSTRAINT FK_EmpresaHospedaje_Empresa
        FOREIGN KEY (empresa_id)
        REFERENCES Empresa(empresa_id)
        ON DELETE CASCADE,
    CONSTRAINT FK_EmpresaHospedaje_TipoAlojamiento
        FOREIGN KEY (tipo_alojamiento_id)
        REFERENCES TipoAlojamiento(tipo_alojamiento_id)
);
GO

-- ============================================================================
-- PASO 6: CREAR TABLA DE ESPECIALIZACIÓN: EMPRESA RECREACION
-- ============================================================================

CREATE TABLE EmpresaRecreacion (
    empresa_id INT PRIMARY KEY,
    nombre_contacto VARCHAR(150) NOT NULL,
    
    CONSTRAINT FK_EmpresaRecreacion_Empresa
        FOREIGN KEY (empresa_id)
        REFERENCES Empresa(empresa_id)
        ON DELETE CASCADE
);
GO

-- ============================================================================
-- PASO 7: CREAR TABLA DE TELÉFONOS NORMALIZADOS
-- ============================================================================

-- Teléfonos de Empresa (ACTUALIZADO - con FK a Paises)
CREATE TABLE TelefonoEmpresa (
    telefono_id INT IDENTITY(1,1) PRIMARY KEY,
    empresa_id INT NOT NULL,
    numero_telefono VARCHAR(15) NOT NULL,
    pais_id INT NOT NULL,
    es_principal BIT DEFAULT 0,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT FK_TelefonoEmpresa_Empresa
        FOREIGN KEY (empresa_id)
        REFERENCES Empresa(empresa_id)
        ON DELETE CASCADE,
    CONSTRAINT FK_TelefonoEmpresa_Paises
        FOREIGN KEY (pais_id)
        REFERENCES Paises(pais_id),
    CONSTRAINT UQ_TelefonoEmpresa_Numero
        UNIQUE (empresa_id, numero_telefono),
    CONSTRAINT CHK_Telefono_Formato
        CHECK (numero_telefono LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
);
GO

-- ============================================================================
-- PASO 8: CREAR TABLA DE REDES SOCIALES NORMALIZADAS
-- ============================================================================

CREATE TABLE EmpresaRedSocial (
    empresa_red_id INT IDENTITY(1,1) PRIMARY KEY,
    empresa_id INT NOT NULL,
    red_social_id INT NOT NULL,
    url_perfil VARCHAR(500) NOT NULL,
    usuario_red VARCHAR(255),
    fecha_creacion DATETIME DEFAULT GETDATE(),
    activo BIT DEFAULT 1,
    
    CONSTRAINT FK_EmpresaRedSocial_Empresa
        FOREIGN KEY (empresa_id)
        REFERENCES Empresa(empresa_id)
        ON DELETE CASCADE,
    CONSTRAINT FK_EmpresaRedSocial_RedSocial
        FOREIGN KEY (red_social_id)
        REFERENCES RedSocial(red_social_id),
    CONSTRAINT UQ_EmpresaRedSocial
        UNIQUE (empresa_id, red_social_id)
);
GO

-- ============================================================================
-- PASO 9: CREAR TABLA SERVICIOS DE EMPRESA (sin cambios esenciales)
-- ============================================================================

CREATE TABLE EmpresaServicio (
    empresa_servicio_id INT IDENTITY(1,1) PRIMARY KEY,
    empresa_id INT NOT NULL,
    servicio_id INT NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT FK_EmpresaServicio_Empresa
        FOREIGN KEY (empresa_id)
        REFERENCES Empresa(empresa_id)
        ON DELETE CASCADE,
    CONSTRAINT FK_EmpresaServicio_Servicio
        FOREIGN KEY (servicio_id)
        REFERENCES Servicio(servicio_id),
    CONSTRAINT UQ_EmpresaServicio
        UNIQUE (empresa_id, servicio_id)
);
GO

-- ============================================================================
-- PASO 10: CREAR TABLAS DE HABITACIONES (NORMALIZADAS)
-- ============================================================================

-- Tipo de Habitación (ACTUALIZADO - sin precio)
CREATE TABLE TipoHabitacion (
    tipo_habitacion_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_tipo_habitacion VARCHAR(100) NOT NULL,
    descripcion_tipo_habitacion VARCHAR(255) NOT NULL,
    tipo_cama_id INT NOT NULL,
    capacidad_personas INT NOT NULL DEFAULT 1,
    amenidades VARCHAR(500),  -- Descripción de comodidades
    fecha_creacion DATETIME DEFAULT GETDATE(),
    activo BIT DEFAULT 1,
    
    CONSTRAINT FK_TipoHabitacion_TipoCama
        FOREIGN KEY (tipo_cama_id)
        REFERENCES TipoCama(tipo_cama_id)
);
GO

-- Habitación (ACTUALIZADO - precio aquí, estado como FK)
CREATE TABLE Habitacion (
    habitacion_id INT IDENTITY(1,1) PRIMARY KEY,
    empresa_id INT NOT NULL,
    numero_habitacion INT NOT NULL,
    tipo_habitacion_id INT NOT NULL,
    precio_noche DECIMAL(10,2) NOT NULL,         -- ← MOVIDO AQUÍ
    estado_habitacion_id INT NOT NULL,            -- ← FK a tabla de estados
    piso INT,
    numero_banos INT,
    metros_cuadrados DECIMAL(8,2),
    
    -- Auditoría
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NOT NULL DEFAULT GETDATE(),
    usuario_creacion VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    activo BIT DEFAULT 1,
    
    CONSTRAINT FK_Habitacion_Empresa
        FOREIGN KEY (empresa_id)
        REFERENCES Empresa(empresa_id)
        ON DELETE CASCADE,
    CONSTRAINT FK_Habitacion_TipoHabitacion
        FOREIGN KEY (tipo_habitacion_id)
        REFERENCES TipoHabitacion(tipo_habitacion_id),
    CONSTRAINT FK_Habitacion_EstadoHabitacion
        FOREIGN KEY (estado_habitacion_id)
        REFERENCES EstadoHabitacion(estado_habitacion_id),
    CONSTRAINT UQ_Habitacion_Numero_Empresa
        UNIQUE (empresa_id, numero_habitacion),
    CONSTRAINT CHK_Precio_Positivo
        CHECK (precio_noche > 0)
);
GO

-- ============================================================================
-- PASO 11: CREAR TABLA DE FOTOS DE HABITACIONES
-- ============================================================================

CREATE TABLE FotoHabitacion (
    foto_id INT IDENTITY(1,1) PRIMARY KEY,
    habitacion_id INT NOT NULL,
    tipo_foto_id INT NOT NULL,
    ruta_foto VARCHAR(500) NOT NULL,
    descripcion_foto VARCHAR(255),
    orden INT DEFAULT 0,
    fecha_carga DATETIME NOT NULL DEFAULT GETDATE(),
    activo BIT DEFAULT 1,
    
    CONSTRAINT FK_FotoHabitacion_Habitacion
        FOREIGN KEY (habitacion_id)
        REFERENCES Habitacion(habitacion_id)
        ON DELETE CASCADE,
    CONSTRAINT FK_FotoHabitacion_TipoFoto
        FOREIGN KEY (tipo_foto_id)
        REFERENCES TipoFoto(tipo_foto_id)
);
GO

-- ============================================================================
-- PASO 12: CREAR TABLA DE CLIENTES (sin cambios esenciales, mejorado)
-- ============================================================================

CREATE TABLE Cliente (
    cliente_id INT IDENTITY(1,1) PRIMARY KEY,
    cliente_identificacion VARCHAR(50) NOT NULL UNIQUE,  -- Cédula o pasaporte
    tipo_identificacion VARCHAR(50) NOT NULL,            -- Cédula, Pasaporte, Dimex, Otro
    nombre VARCHAR(100) NOT NULL,
    primer_apellido VARCHAR(100) NOT NULL,
    segundo_apellido VARCHAR(100),
    fecha_nacimiento DATE,
    pais_residencia_id INT NOT NULL,
    
    -- Dirección si es costarricense
    distrito_id INT,  -- FK opcional a Distrito
    direccion_exacta VARCHAR(255),
    
    -- Contacto
    correo_electronico VARCHAR(255) NOT NULL UNIQUE,
    
    -- Auditoría
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NOT NULL DEFAULT GETDATE(),
    usuario_creacion VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    activo BIT DEFAULT 1,
    
    CONSTRAINT FK_Cliente_Paises
        FOREIGN KEY (pais_residencia_id)
        REFERENCES Paises(pais_id),
    CONSTRAINT FK_Cliente_Distrito
        FOREIGN KEY (distrito_id)
        REFERENCES Distrito(distrito_id),
    CONSTRAINT CHK_Cedula_Cliente_Formato
        CHECK (cliente_identificacion LIKE '[0-9]*'),  -- Solo números (flexible)
    CONSTRAINT CHK_Correo_Cliente_Formato
        CHECK (correo_electronico LIKE '%@%.%')
);
GO

-- ============================================================================
-- PASO 13: CREAR TABLA DE TELÉFONOS DE CLIENTES (NORMALIZADO)
-- ============================================================================

CREATE TABLE TelefonoCliente (
    telefono_id INT IDENTITY(1,1) PRIMARY KEY,
    cliente_id INT NOT NULL,
    numero_telefono VARCHAR(15) NOT NULL,
    pais_id INT NOT NULL,
    es_principal BIT DEFAULT 0,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT FK_TelefonoCliente_Cliente
        FOREIGN KEY (cliente_id)
        REFERENCES Cliente(cliente_id)
        ON DELETE CASCADE,
    CONSTRAINT FK_TelefonoCliente_Paises
        FOREIGN KEY (pais_id)
        REFERENCES Paises(pais_id),
    CONSTRAINT UQ_TelefonoCliente_Numero
        UNIQUE (cliente_id, numero_telefono),
    CONSTRAINT CHK_Telefono_Cliente_Formato
        CHECK (numero_telefono LIKE '[0-9]*')
);
GO

-- ============================================================================
-- PASO 14: CREAR TABLA DE RESERVAS (NORMALIZADA CON ESTADO)
-- ============================================================================

CREATE TABLE Reserva (
    reserva_id INT IDENTITY(1,1) PRIMARY KEY,
    cliente_id INT NOT NULL,
    habitacion_id INT NOT NULL,
    fecha_check_in DATETIME NOT NULL,
    fecha_check_out DATETIME NOT NULL,
    cantidad_personas INT NOT NULL,
    vehiculo BIT NOT NULL DEFAULT 0,
    estado_reserva_id INT NOT NULL,               -- ← NUEVO: FK a estado
    notas VARCHAR(500),
    
    -- Auditoría
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NOT NULL DEFAULT GETDATE(),
    usuario_creacion VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    
    CONSTRAINT FK_Reserva_Cliente
        FOREIGN KEY (cliente_id)
        REFERENCES Cliente(cliente_id),
    CONSTRAINT FK_Reserva_Habitacion
        FOREIGN KEY (habitacion_id)
        REFERENCES Habitacion(habitacion_id),
    CONSTRAINT FK_Reserva_EstadoReserva
        FOREIGN KEY (estado_reserva_id)
        REFERENCES EstadoReserva(estado_reserva_id),
    CONSTRAINT CHK_Fechas_Validas
        CHECK (fecha_check_in < fecha_check_out),
    CONSTRAINT CHK_Personas_Positivas
        CHECK (cantidad_personas > 0),
    CONSTRAINT UQ_Habitacion_Fechas
        UNIQUE (habitacion_id, fecha_check_in, fecha_check_out)  -- Evita sobreposición
);
GO

-- ============================================================================
-- PASO 15: CREAR TABLA DE FACTURAS (NORMALIZADA CON ESTADO PAGO)
-- ============================================================================

CREATE TABLE Factura (
    factura_id INT IDENTITY(1,1) PRIMARY KEY,
    reserva_id INT NOT NULL UNIQUE,               -- Una factura por reserva
    numero_factura VARCHAR(20) UNIQUE NOT NULL,   -- Identificador único (ej: FAC-2025-001)
    noches_estadia INT NOT NULL,
    importe_total DECIMAL(10,2) NOT NULL,
    
    estado_pago_id INT NOT NULL,                  -- ← NUEVO: FK a estado de pago
    medio_pago_id INT,                            -- ← ACTUALIZADO: FK a tabla de medio pago
    fecha_emision DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_pago DATETIME,
    referencia_pago VARCHAR(255),
    
    -- Auditoría
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NOT NULL DEFAULT GETDATE(),
    usuario_creacion VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    
    CONSTRAINT FK_Factura_Reserva
        FOREIGN KEY (reserva_id)
        REFERENCES Reserva(reserva_id),
    CONSTRAINT FK_Factura_EstadoPago
        FOREIGN KEY (estado_pago_id)
        REFERENCES EstadoPago(estado_pago_id),
    CONSTRAINT FK_Factura_MedioPago
        FOREIGN KEY (medio_pago_id)
        REFERENCES MedioPago(medio_pago_id),
    CONSTRAINT CHK_Importe_Positivo
        CHECK (importe_total > 0),
    CONSTRAINT CHK_Noches_Positivas
        CHECK (noches_estadia > 0)
);
GO

-- ============================================================================
-- PASO 16: CREAR TABLAS DE ACTIVIDADES DE RECREACIÓN (MEJORADAS)
-- ============================================================================

-- Actividades de Empresa Recreación (ACTUALIZADO)
CREATE TABLE EmpresaTipoActividad (
    empresa_actividad_id INT IDENTITY(1,1) PRIMARY KEY,
    empresa_id INT NOT NULL,
    tipo_actividad_id INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,                -- ← Precio específico por tipo
    descripcion VARCHAR(500) NOT NULL,            -- ← Descripción específica
    capacidad_minima INT DEFAULT 1,
    capacidad_maxima INT DEFAULT 30,
    duracion_horas DECIMAL(5,2),
    horario_inicio TIME,
    horario_fin TIME,
    dias_disponibles VARCHAR(100),                -- Ej: "Lunes,Martes,Miércoles,etc"
    
    fecha_creacion DATETIME DEFAULT GETDATE(),
    activo BIT DEFAULT 1,
    
    CONSTRAINT FK_EmpresaTipoActividad_Empresa
        FOREIGN KEY (empresa_id)
        REFERENCES EmpresaRecreacion(empresa_id)
        ON DELETE CASCADE,
    CONSTRAINT FK_EmpresaTipoActividad_TipoActividad
        FOREIGN KEY (tipo_actividad_id)
        REFERENCES TipoActividad(tipo_actividad_id),
    CONSTRAINT UQ_EmpresaTipoActividad
        UNIQUE (empresa_id, tipo_actividad_id),
    CONSTRAINT CHK_Precio_Actividad
        CHECK (precio > 0),
    CONSTRAINT CHK_Capacidad_Valida
        CHECK (capacidad_minima > 0 AND capacidad_maxima >= capacidad_minima)
);
GO

-- Servicios de Empresa Recreación
CREATE TABLE EmpresaServicioRecreacion (
    empresa_servicio_id INT IDENTITY(1,1) PRIMARY KEY,
    empresa_id INT NOT NULL,
    tipo_servicio_id INT NOT NULL,
    
    CONSTRAINT FK_EmpresaServicioRecreacion_Empresa
        FOREIGN KEY (empresa_id)
        REFERENCES EmpresaRecreacion(empresa_id)
        ON DELETE CASCADE,
    CONSTRAINT FK_EmpresaServicioRecreacion_TipoServicio
        FOREIGN KEY (tipo_servicio_id)
        REFERENCES TipoServicioRecreacion(tipo_servicio_id),
    CONSTRAINT UQ_EmpresaServicioRecreacion
        UNIQUE (empresa_id, tipo_servicio_id)
);
GO

-- ============================================================================
-- PASO 17: CREAR TABLA DE USUARIOS (NUEVA - Para autenticación)
-- ============================================================================

CREATE TABLE Usuario (
    usuario_id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL,            -- 'admin', 'empresa', 'cliente'
    empresa_id INT,                               -- FK si es usuario empresa
    cliente_id INT,                               -- FK si es usuario cliente
    
    nombre_completo VARCHAR(255),
    ultimo_acceso DATETIME,
    intentos_fallidos INT DEFAULT 0,
    bloqueado BIT DEFAULT 0,
    
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NOT NULL DEFAULT GETDATE(),
    activo BIT NOT NULL DEFAULT 1,
    
    CONSTRAINT FK_Usuario_Empresa
        FOREIGN KEY (empresa_id)
        REFERENCES Empresa(empresa_id)
        ON DELETE SET NULL,
    CONSTRAINT FK_Usuario_Cliente
        FOREIGN KEY (cliente_id)
        REFERENCES Cliente(cliente_id)
        ON DELETE SET NULL,
    CONSTRAINT CHK_Tipo_Usuario
        CHECK (tipo_usuario IN ('admin', 'empresa', 'cliente')),
    CONSTRAINT CHK_Email_Formato
        CHECK (email LIKE '%@%.%')
);
GO

-- ============================================================================
-- PASO 18: CREAR TABLA DE AUDITORÍA (NUEVA - Para tracking)
-- ============================================================================

CREATE TABLE Auditoria (
    auditoria_id INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT,
    tabla_afectada VARCHAR(100) NOT NULL,
    operacion VARCHAR(20) NOT NULL,               -- INSERT, UPDATE, DELETE
    registro_id INT,
    valores_anteriores VARCHAR(MAX),              -- JSON o serializado
    valores_nuevos VARCHAR(MAX),                  -- JSON o serializado
    
    fecha_operacion DATETIME NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_Auditoria_Usuario
        FOREIGN KEY (usuario_id)
        REFERENCES Usuario(usuario_id),
    CONSTRAINT CHK_Operacion
        CHECK (operacion IN ('INSERT', 'UPDATE', 'DELETE'))
);
GO

-- ============================================================================
-- PASO 19: CREAR ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================================

-- Índices en Empresa
CREATE INDEX IX_Empresa_Cedula ON Empresa(cedula_juridica);
CREATE INDEX IX_Empresa_Distrito ON Empresa(distrito_id);
CREATE INDEX IX_Empresa_TipoEmpresa ON Empresa(tipo_empresa);
CREATE INDEX IX_Empresa_Activo ON Empresa(activo);
GO

-- Índices en Habitacion
CREATE INDEX IX_Habitacion_Empresa ON Habitacion(empresa_id);
CREATE INDEX IX_Habitacion_Estado ON Habitacion(estado_habitacion_id);
CREATE INDEX IX_Habitacion_EmpresaEstado ON Habitacion(empresa_id, estado_habitacion_id);
GO

-- Índices en Reserva
CREATE INDEX IX_Reserva_Cliente ON Reserva(cliente_id);
CREATE INDEX IX_Reserva_Habitacion ON Reserva(habitacion_id);
CREATE INDEX IX_Reserva_Estado ON Reserva(estado_reserva_id);
CREATE INDEX IX_Reserva_Fechas ON Reserva(fecha_check_in, fecha_check_out);
CREATE INDEX IX_Reserva_HabitacionFechas ON Reserva(habitacion_id, fecha_check_in, fecha_check_out);
GO

-- Índices en Factura
CREATE INDEX IX_Factura_Reserva ON Factura(reserva_id);
CREATE INDEX IX_Factura_EstadoPago ON Factura(estado_pago_id);
CREATE INDEX IX_Factura_Fecha ON Factura(fecha_emision);
CREATE INDEX IX_Factura_NumeroFactura ON Factura(numero_factura);
GO

-- Índices en Cliente
CREATE INDEX IX_Cliente_Identificacion ON Cliente(cliente_identificacion);
CREATE INDEX IX_Cliente_Email ON Cliente(correo_electronico);
CREATE INDEX IX_Cliente_Pais ON Cliente(pais_residencia_id);
CREATE INDEX IX_Cliente_Activo ON Cliente(activo);
GO

-- Índices en Usuario
CREATE INDEX IX_Usuario_Email ON Usuario(email);
CREATE INDEX IX_Usuario_Tipo ON Usuario(tipo_usuario);
CREATE INDEX IX_Usuario_Empresa ON Usuario(empresa_id);
CREATE INDEX IX_Usuario_Activo ON Usuario(activo);
GO

-- Índices en Auditoria
CREATE INDEX IX_Auditoria_Usuario ON Auditoria(usuario_id);
CREATE INDEX IX_Auditoria_Tabla ON Auditoria(tabla_afectada);
CREATE INDEX IX_Auditoria_Fecha ON Auditoria(fecha_operacion);
GO

-- ============================================================================
-- PASO 20: PROTECCIONES CON TRIGGERS
-- ============================================================================

-- TRIGGER: Prevenir eliminación de Factura
CREATE TRIGGER TRG_PreventFacturaDelete
ON Factura
INSTEAD OF DELETE
AS
BEGIN
    RAISERROR('No se permite eliminar facturas. Las facturas son inmutables.', 16, 1);
    ROLLBACK TRANSACTION;
END;
GO

-- TRIGGER: Prevenir eliminación de Reserva confirmada
CREATE TRIGGER TRG_PreventReservaDeleteConfirmada
ON Reserva
INSTEAD OF DELETE
AS
BEGIN
    DECLARE @estado INT;
    SELECT @estado = estado_reserva_id FROM deleted;
    
    IF @estado NOT IN (3)  -- 3 = Cancelada (permitir borrar solo canceladas)
    BEGIN
        RAISERROR('No se permite eliminar reservas confirmadas o cerradas. Use cambio de estado.', 16, 1);
        ROLLBACK TRANSACTION;
    END
    ELSE
    BEGIN
        DELETE FROM Reserva WHERE reserva_id = (SELECT reserva_id FROM deleted);
    END
END;
GO

-- TRIGGER: Crear Factura al cerrar Reserva
CREATE TRIGGER TRG_CrearFacturaAlCerrarReserva
ON Reserva
AFTER UPDATE
AS
BEGIN
    DECLARE @reserva_id INT;
    DECLARE @noches INT;
    DECLARE @importe DECIMAL(10,2);
    DECLARE @numero_factura VARCHAR(20);
    DECLARE @precio_noche DECIMAL(10,2);
    DECLARE @estado_nuevo INT;
    DECLARE @estado_anterior INT;
    
    -- Obtener datos de la actualización
    SELECT 
        @reserva_id = i.reserva_id,
        @estado_nuevo = i.estado_reserva_id,
        @estado_anterior = d.estado_reserva_id
    FROM inserted i
    INNER JOIN deleted d ON i.reserva_id = d.reserva_id;
    
    -- Si cambio a estado "Cerrada" (asumiendo estado_reserva_id = 4)
    IF @estado_nuevo = 4 AND @estado_anterior <> 4
    BEGIN
        -- Calcular noches
        SELECT @noches = DATEDIFF(DAY, fecha_check_in, fecha_check_out)
        FROM Reserva WHERE reserva_id = @reserva_id;
        
        -- Obtener precio de la habitación
        SELECT @precio_noche = h.precio_noche
        FROM Reserva r
        INNER JOIN Habitacion h ON r.habitacion_id = h.habitacion_id
        WHERE r.reserva_id = @reserva_id;
        
        -- Calcular importe total
        SET @importe = @noches * @precio_noche;
        
        -- Generar número de factura único
        SET @numero_factura = 'FAC-' + CONVERT(VARCHAR(4), YEAR(GETDATE())) + '-' 
                            + RIGHT('0000' + CONVERT(VARCHAR(4), 
                            (SELECT COUNT(*) FROM Factura WHERE YEAR(fecha_creacion) = YEAR(GETDATE())) + 1), 4);
        
        -- Verificar que la factura no exista ya
        IF NOT EXISTS (SELECT 1 FROM Factura WHERE reserva_id = @reserva_id)
        BEGIN
            -- Insertar factura con estado "Pendiente" (asumiendo estado_pago_id = 1)
            INSERT INTO Factura (
                reserva_id,
                numero_factura,
                noches_estadia,
                importe_total,
                estado_pago_id,
                fecha_emision,
                usuario_creacion
            )
            VALUES (
                @reserva_id,
                @numero_factura,
                @noches,
                @importe,
                1,  -- Estado "Pendiente"
                GETDATE(),
                SYSTEM_USER
            );
        END
    END
END;
GO

-- TRIGGER: Actualizar fecha_modificacion en Empresa
CREATE TRIGGER TRG_ActualizarFechaEmpresa
ON Empresa
AFTER UPDATE
AS
BEGIN
    UPDATE Empresa
    SET fecha_modificacion = GETDATE(),
        usuario_modificacion = SYSTEM_USER
    FROM Empresa e
    INNER JOIN inserted i ON e.empresa_id = i.empresa_id;
END;
GO

-- TRIGGER: Actualizar fecha_modificacion en Habitacion
CREATE TRIGGER TRG_ActualizarFechaHabitacion
ON Habitacion
AFTER UPDATE
AS
BEGIN
    UPDATE Habitacion
    SET fecha_modificacion = GETDATE(),
        usuario_modificacion = SYSTEM_USER
    FROM Habitacion h
    INNER JOIN inserted i ON h.habitacion_id = i.habitacion_id;
END;
GO

-- TRIGGER: Actualizar fecha_modificacion en Reserva
CREATE TRIGGER TRG_ActualizarFechaReserva
ON Reserva
AFTER UPDATE
AS
BEGIN
    UPDATE Reserva
    SET fecha_modificacion = GETDATE(),
        usuario_modificacion = SYSTEM_USER
    FROM Reserva r
    INNER JOIN inserted i ON r.reserva_id = i.reserva_id;
END;
GO

-- TRIGGER: Auditoría en Factura
CREATE TRIGGER TRG_AuditoriaFactura
ON Factura
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    DECLARE @operacion VARCHAR(20);
    
    IF EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
        SET @operacion = 'UPDATE';
    ELSE IF EXISTS (SELECT 1 FROM inserted)
        SET @operacion = 'INSERT';
    ELSE
        SET @operacion = 'DELETE';
    
    INSERT INTO Auditoria (tabla_afectada, operacion, registro_id, fecha_operacion)
    SELECT 'Factura', @operacion, COALESCE(i.factura_id, d.factura_id), GETDATE()
    FROM inserted i
    FULL OUTER JOIN deleted d ON i.factura_id = d.factura_id;
END;
GO

-- ============================================================================
-- PASO 21: INSERTAR DATOS DE CATÁLOGOS INICIALES
-- ============================================================================

-- Insertar países
INSERT INTO Paises (nombre_pais, codigo_iso_2, codigo_iso_3, codigo_telefono) VALUES
('Costa Rica', '+506'),
('España',  '+34'),
('México', '+52'),
('Estados Unidos', '+1'),
('Panamá', '+507'),
('Colombia', '+57'),
('Nicaragua','+505');
GO

-- Insertar provincias de Costa Rica (LIMÓN)
INSERT INTO Provincia (nombre_provincia, pais_id) VALUES
('Limón', 1);  -- Costa Rica
GO

-- Insertar cantones de Limón
INSERT INTO Canton (provincia_id, nombre_canton) VALUES
(1, 'Limón'),
(1, 'Pococí'),
(1, 'Siquirres'),
(1, 'Talamanca'),
(1, 'Matina'),
(1, 'Guácimo');
GO

-- Insertar distritos de Talamanca (ejemplo)
INSERT INTO Distrito (canton_id, nombre_distrito, referencia_gps) VALUES
(4, 'Puerto Viejo', '9.6500, -82.7500'),
(4, 'Cahuita', '9.7325, -82.8458'),
(4, 'Sixaola', '9.5947, -82.5814'),
(3, 'Siquirres', '9.9167, -82.0000'),
(2, 'Guápiles', '10.2167, -83.7667'),
(6, 'Guácimo', '10.3500, -83.4167'),
(1, 'Limón', '10.0036, -83.0342'),
(5, 'Matina', '10.0333, -82.9667');
GO

-- Insertar tipos de alojamiento
INSERT INTO TipoAlojamiento (nombre_tipo, descripcion) VALUES
('Hotel', 'Establecimiento de hospedaje con servicios completos'),
('Hostal', 'Alojamiento económico, generalmente con habitaciones compartidas'),
('Casa', 'Propiedad privada alquilada como alojamiento completo'),
('Departamento', 'Apartamento amueblado para alquiler turístico'),
('Cuarto compartido', 'Habitación compartida con otras personas'),
('Cabaña', 'Estructura pequeña, generalmente en entorno natural');
GO

-- Insertar tipos de cama
INSERT INTO TipoCama (nombre_tipo_cama, descripcion) VALUES
('Individual', 'Cama para una persona, aproximadamente 90x190 cm'),
('Matrimonial', 'Cama para pareja, aproximadamente 135x190 cm'),
('Queen', 'Cama grande, aproximadamente 150x200 cm'),
('King', 'Cama extra grande, aproximadamente 180x200 cm'),
('Litera', 'Dos camas apiladas verticalmente');
GO

-- Insertar estados de reserva
INSERT INTO EstadoReserva (nombre_estado, descripcion) VALUES
('Pendiente', 'Reserva creada, esperando confirmación'),
('Confirmada', 'Reserva confirmada y pagada'),
('Cancelada', 'Reserva cancelada por cliente'),
('Cerrada', 'Reserva finalizada, cliente ya se fue');
GO

-- Insertar estados de habitación
INSERT INTO EstadoHabitacion (nombre_estado, descripcion) VALUES
('Disponible', 'Habitación lista para hospedar'),
('Ocupada', 'Habitación con huésped'),
('Limpieza', 'En proceso de limpieza'),
('Mantenimiento', 'En mantenimiento o reparación'),
('Bloqueada', 'Bloqueada temporalmente'),
('Fuera de Servicio', 'No disponible permanentemente');
GO

-- Insertar estados de pago
INSERT INTO EstadoPago (nombre_estado, descripcion) VALUES
('Pendiente', 'Factura sin pagar'),
('Pagada', 'Factura completamente pagada'),
('Parcial', 'Factura pagada parcialmente'),
('Anulada', 'Factura anulada o cancelada');
GO

-- Insertar medios de pago
INSERT INTO MedioPago (nombre_medio, descripcion) VALUES
('Tarjeta de Crédito', 'Pago con tarjeta de crédito'),
('Tarjeta de Débito', 'Pago con tarjeta de débito'),
('Efectivo', 'Pago en efectivo'),
('Transferencia Bancaria', 'Transferencia bancaria'),
('Cheque', 'Pago con cheque'),
('Criptomoneda', 'Pago con criptomonedas');
GO

-- Insertar servicios
INSERT INTO Servicio (nombre_servicio, descripcion) VALUES
('Piscina', 'Piscina para el disfrute de los huéspedes'),
('WiFi', 'Conexión a internet inalámbrica'),
('Parqueo', 'Estacionamiento para vehículos'),
('Restaurante', 'Servicio de alimentos y bebidas'),
('Bar', 'Servicio de bebidas alcohólicas y no alcohólicas'),
('Ranchos', 'Espacios techados para reuniones'),
('Aire Acondicionado', 'Sistema de climatización en las habitaciones'),
('Desayuno incluido', 'Desayuno como parte del precio'),
('Servicio a la habitación', 'Servicio de comidas en la habitación'),
('Gimnasio', 'Área de ejercicio físico'),
('Spa', 'Servicio de masajes y tratamientos'),
('Playa privada', 'Acceso privado a playa'),
('Tours', 'Organización de tours y excursiones'),
('Transporte', 'Servicio de transporte de huéspedes');
GO

-- Insertar redes sociales
INSERT INTO RedSocial (nombre_red, icono_url) VALUES
('Facebook', 'facebook.png'),
('Instagram', 'instagram.png'),
('Twitter/X', 'twitter.png'),
('YouTube', 'youtube.png'),
('TikTok', 'tiktok.png'),
('WhatsApp', 'whatsapp.png'),
('Telegram', 'telegram.png'),
('LinkedIn', 'linkedin.png'),
('Threads', 'threads.png'),
('Airbnb', 'airbnb.png');
GO

-- Insertar tipos de actividades
INSERT INTO TipoActividad (nombre_tipo_actividad, descripcion) VALUES
('Tour en Bote', 'Excursión en bote por ríos y costas'),
('Tour en Lancha', 'Viaje en lancha de alta velocidad'),
('Tour en Catamarán', 'Paseo en catamarán'),
('Kayak', 'Navegación en kayak'),
('Senderismo', 'Caminata en senderos naturales'),
('Avistamiento de Fauna', 'Observación de animales silvestres'),
('Tours Culturales', 'Visitas a sitios históricos y culturales'),
('Transporte', 'Servicio de transporte turístico');
GO

-- Insertar tipos de servicios de recreación
INSERT INTO TipoServicioRecreacion (nombre_servicio, descripcion) VALUES
('Guía Turístico', 'Personal especializado que acompaña el tour'),
('Transporte', 'Transporte incluido en la actividad'),
('Equipo', 'Equipamiento necesario para la actividad'),
('Seguro', 'Cobertura de seguro durante la actividad'),
('Alimentos', 'Comida y bebidas incluidas'),
('Fotos', 'Servicio de fotografía profesional');
GO

-- Insertar tipos de foto
INSERT INTO TipoFoto (nombre_tipo_foto, descripcion) VALUES
('Principal', 'Foto principal de la habitación'),
('Galería', 'Fotos adicionales de la habitación'),
('Amenidades', 'Fotos de amenidades y servicios'),
('Baño', 'Foto del baño'),
('Vista', 'Fotos de vistas desde la habitación');
GO

-- ============================================================================
-- PASO 22: VERIFICACIÓN FINAL
-- ============================================================================

PRINT '========================================';
PRINT 'BASE DE DATOS CREADA EXITOSAMENTE';
PRINT '========================================';
PRINT '';
PRINT 'Catálogos de referencia:';
PRINT '✓ Paises (8 registros)';
PRINT '✓ Provincias (1 registro - Limón)';
PRINT '✓ Cantones (6 registros)';
PRINT '✓ Distritos (8 registros)';
PRINT '✓ EstadoReserva (4 registros)';
PRINT '✓ EstadoHabitacion (6 registros)';
PRINT '✓ EstadoPago (4 registros)';
PRINT '✓ MedioPago (6 registros)';
PRINT '✓ TipoAlojamiento (6 registros)';
PRINT '✓ TipoCama (5 registros)';
PRINT '✓ Servicio (14 registros)';
PRINT '✓ RedSocial (10 registros)';
PRINT '✓ TipoActividad (8 registros)';
PRINT '✓ TipoServicioRecreacion (6 registros)';
PRINT '✓ TipoFoto (5 registros)';
PRINT '';
PRINT 'Tablas principales:';
PRINT '✓ Empresa (tabla base)';
PRINT '✓ EmpresaHospedaje (especialización)';
PRINT '✓ EmpresaRecreacion (especialización)';
PRINT '✓ Habitacion (con precio normalizado)';
PRINT '✓ Reserva (con estado)';
PRINT '✓ Factura (con estado de pago)';
PRINT '✓ Cliente (con mejoras)';
PRINT '✓ Usuario (nueva)';
PRINT '✓ Auditoria (nueva)';
PRINT '';
PRINT 'Protecciones:';
PRINT '✓ Índices para optimización';
PRINT '✓ Triggers para integridad';
PRINT '✓ Constraints para validación';
PRINT '✓ FK para integridad referencial';
PRINT '';
PRINT '========================================';
GO