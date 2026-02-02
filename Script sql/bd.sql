IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SG_Hotelera')
BEGIN
    CREATE DATABASE SG_Hotelera;
END
GO

USE SG_Hotelera;
GO

CREATE TABLE Paises (
    pais_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_pais VARCHAR(100) NOT NULL UNIQUE,
    codigo_telefono VARCHAR(5) UNIQUE NOT NULL,
    activo BIT DEFAULT 1
);
GO

CREATE TABLE Provincia (
    provincia_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_provincia VARCHAR(100) NOT NULL UNIQUE,
    pais_id INT NOT NULL,
    activo BIT DEFAULT 1,
    CONSTRAINT FK_Provincia_Paises FOREIGN KEY (pais_id) REFERENCES Paises(pais_id)
);
GO

CREATE TABLE Canton (
    canton_id INT IDENTITY(1,1) PRIMARY KEY,
    provincia_id INT NOT NULL,
    nombre_canton VARCHAR(100) NOT NULL,
    activo BIT DEFAULT 1,
    CONSTRAINT FK_Canton_Provincia FOREIGN KEY (provincia_id) REFERENCES Provincia(provincia_id),
    CONSTRAINT UQ_Canton_Nombre_Provincia UNIQUE (provincia_id, nombre_canton)
);
GO

CREATE TABLE Distrito (
    distrito_id INT IDENTITY(1,1) PRIMARY KEY,
    canton_id INT NOT NULL,
    nombre_distrito VARCHAR(100) NOT NULL,
    referencia_gps VARCHAR(100),
    activo BIT DEFAULT 1,
    CONSTRAINT FK_Distrito_Canton FOREIGN KEY (canton_id) REFERENCES Canton(canton_id),
    CONSTRAINT UQ_Distrito_Nombre_Canton UNIQUE (canton_id, nombre_distrito)
);
GO

CREATE TABLE EstadoReserva (
    estado_reserva_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

CREATE TABLE EstadoHabitacion (
    estado_habitacion_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

CREATE TABLE EstadoPago (
    estado_pago_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

CREATE TABLE MedioPago (
    medio_pago_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_medio VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

CREATE TABLE TipoAlojamiento (
    tipo_alojamiento_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_tipo VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

CREATE TABLE TipoCama (
    tipo_cama_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_tipo_cama VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

CREATE TABLE Servicio (
    servicio_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_servicio VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

CREATE TABLE RedSocial (
    red_social_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_red VARCHAR(50) NOT NULL UNIQUE,
    icono_url VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

CREATE TABLE TipoActividad (
    tipo_actividad_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_tipo_actividad VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

CREATE TABLE TipoServicioRecreacion (
    tipo_servicio_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_servicio VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

CREATE TABLE TipoFoto (
    tipo_foto_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_tipo_foto VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1
);
GO

CREATE TABLE Empresa (
    empresa_id INT IDENTITY(1,1) PRIMARY KEY,
    cedula_juridica VARCHAR(50) NOT NULL UNIQUE,
    nombre_empresa VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(255) NOT NULL UNIQUE,
    url_sitio_web VARCHAR(255),
    distrito_id INT NOT NULL,
    direccion_exacta VARCHAR(255) NOT NULL,
    referencia_gps VARCHAR(100),
    tipo_empresa VARCHAR(50) NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NOT NULL DEFAULT GETDATE(),
    usuario_creacion VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    activo BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Empresa_Distrito FOREIGN KEY (distrito_id) REFERENCES Distrito(distrito_id),
    CONSTRAINT CHK_Cedula_Juridica_Formato CHECK (cedula_juridica LIKE '[0-9]-[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]'),
    CONSTRAINT CHK_Correo_Electronico_Formato CHECK (correo_electronico LIKE '%@%.%'),
    CONSTRAINT CHK_Tipo_Empresa CHECK (tipo_empresa IN ('hospedaje', 'recreacion', 'ambas'))
);
GO

CREATE TABLE EmpresaHospedaje (
    empresa_id INT PRIMARY KEY,
    tipo_alojamiento_id INT NOT NULL,
    CONSTRAINT FK_EmpresaHospedaje_Empresa FOREIGN KEY (empresa_id) REFERENCES Empresa(empresa_id) ON DELETE CASCADE,
    CONSTRAINT FK_EmpresaHospedaje_TipoAlojamiento FOREIGN KEY (tipo_alojamiento_id) REFERENCES TipoAlojamiento(tipo_alojamiento_id)
);
GO

CREATE TABLE EmpresaRecreacion (
    empresa_id INT PRIMARY KEY,
    nombre_contacto VARCHAR(150) NOT NULL,
    CONSTRAINT FK_EmpresaRecreacion_Empresa FOREIGN KEY (empresa_id) REFERENCES Empresa(empresa_id) ON DELETE CASCADE
);
GO

CREATE TABLE TelefonoEmpresa (
    telefono_id INT IDENTITY(1,1) PRIMARY KEY,
    empresa_id INT NOT NULL,
    numero_telefono VARCHAR(15) NOT NULL,
    pais_id INT NOT NULL,
    es_principal BIT DEFAULT 0,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_TelefonoEmpresa_Empresa FOREIGN KEY (empresa_id) REFERENCES Empresa(empresa_id) ON DELETE CASCADE,
    CONSTRAINT FK_TelefonoEmpresa_Paises FOREIGN KEY (pais_id) REFERENCES Paises(pais_id),
    CONSTRAINT UQ_TelefonoEmpresa_Numero UNIQUE (empresa_id, numero_telefono),
    CONSTRAINT CHK_Telefono_Formato CHECK (numero_telefono LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
);
GO

CREATE TABLE EmpresaRedSocial (
    empresa_red_id INT IDENTITY(1,1) PRIMARY KEY,
    empresa_id INT NOT NULL,
    red_social_id INT NOT NULL,
    url_perfil VARCHAR(500) NOT NULL,
    usuario_red VARCHAR(255),
    fecha_creacion DATETIME DEFAULT GETDATE(),
    activo BIT DEFAULT 1,
    CONSTRAINT FK_EmpresaRedSocial_Empresa FOREIGN KEY (empresa_id) REFERENCES Empresa(empresa_id) ON DELETE CASCADE,
    CONSTRAINT FK_EmpresaRedSocial_RedSocial FOREIGN KEY (red_social_id) REFERENCES RedSocial(red_social_id),
    CONSTRAINT UQ_EmpresaRedSocial UNIQUE (empresa_id, red_social_id)
);
GO

CREATE TABLE EmpresaServicio (
    empresa_servicio_id INT IDENTITY(1,1) PRIMARY KEY,
    empresa_id INT NOT NULL,
    servicio_id INT NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_EmpresaServicio_Empresa FOREIGN KEY (empresa_id) REFERENCES Empresa(empresa_id) ON DELETE CASCADE,
    CONSTRAINT FK_EmpresaServicio_Servicio FOREIGN KEY (servicio_id) REFERENCES Servicio(servicio_id),
    CONSTRAINT UQ_EmpresaServicio UNIQUE (empresa_id, servicio_id)
);
GO

CREATE TABLE TipoHabitacion (
    tipo_habitacion_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_tipo_habitacion VARCHAR(100) NOT NULL,
    descripcion_tipo_habitacion VARCHAR(255) NOT NULL,
    tipo_cama_id INT NOT NULL,
    capacidad_personas INT NOT NULL DEFAULT 1,
    amenidades VARCHAR(500),
    fecha_creacion DATETIME DEFAULT GETDATE(),
    activo BIT DEFAULT 1,
    CONSTRAINT FK_TipoHabitacion_TipoCama FOREIGN KEY (tipo_cama_id) REFERENCES TipoCama(tipo_cama_id)
);
GO

CREATE TABLE Habitacion (
    habitacion_id INT IDENTITY(1,1) PRIMARY KEY,
    empresa_id INT NOT NULL,
    numero_habitacion INT NOT NULL,
    tipo_habitacion_id INT NOT NULL,
    precio_noche DECIMAL(10,2) NOT NULL,
    estado_habitacion_id INT NOT NULL,
    piso INT,
    numero_banos INT,
    metros_cuadrados DECIMAL(8,2),
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NOT NULL DEFAULT GETDATE(),
    usuario_creacion VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    activo BIT DEFAULT 1,
    CONSTRAINT FK_Habitacion_Empresa FOREIGN KEY (empresa_id) REFERENCES Empresa(empresa_id) ON DELETE CASCADE,
    CONSTRAINT FK_Habitacion_TipoHabitacion FOREIGN KEY (tipo_habitacion_id) REFERENCES TipoHabitacion(tipo_habitacion_id),
    CONSTRAINT FK_Habitacion_EstadoHabitacion FOREIGN KEY (estado_habitacion_id) REFERENCES EstadoHabitacion(estado_habitacion_id),
    CONSTRAINT UQ_Habitacion_Numero_Empresa UNIQUE (empresa_id, numero_habitacion),
    CONSTRAINT CHK_Precio_Positivo CHECK (precio_noche > 0)
);
GO

CREATE TABLE FotoHabitacion (
    foto_id INT IDENTITY(1,1) PRIMARY KEY,
    habitacion_id INT NOT NULL,
    tipo_foto_id INT NOT NULL,
    ruta_foto VARCHAR(500) NOT NULL,
    descripcion_foto VARCHAR(255),
    orden INT DEFAULT 0,
    fecha_carga DATETIME NOT NULL DEFAULT GETDATE(),
    activo BIT DEFAULT 1,
    CONSTRAINT FK_FotoHabitacion_Habitacion FOREIGN KEY (habitacion_id) REFERENCES Habitacion(habitacion_id) ON DELETE CASCADE,
    CONSTRAINT FK_FotoHabitacion_TipoFoto FOREIGN KEY (tipo_foto_id) REFERENCES TipoFoto(tipo_foto_id)
);
GO

CREATE TABLE Cliente (
    cliente_id INT IDENTITY(1,1) PRIMARY KEY,
    cliente_identificacion VARCHAR(50) NOT NULL UNIQUE,
    tipo_identificacion VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    primer_apellido VARCHAR(100) NOT NULL,
    segundo_apellido VARCHAR(100),
    fecha_nacimiento DATE,
    pais_residencia_id INT NOT NULL,
    distrito_id INT,
    direccion_exacta VARCHAR(255),
    correo_electronico VARCHAR(255) NOT NULL UNIQUE,
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NOT NULL DEFAULT GETDATE(),
    usuario_creacion VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    activo BIT DEFAULT 1,
    CONSTRAINT FK_Cliente_Paises FOREIGN KEY (pais_residencia_id) REFERENCES Paises(pais_id),
    CONSTRAINT FK_Cliente_Distrito FOREIGN KEY (distrito_id) REFERENCES Distrito(distrito_id),
    CONSTRAINT CHK_Cedula_Cliente_Formato CHECK (cliente_identificacion LIKE '[0-9]*'),
    CONSTRAINT CHK_Correo_Cliente_Formato CHECK (correo_electronico LIKE '%@%.%')
);
GO

CREATE TABLE TelefonoCliente (
    telefono_id INT IDENTITY(1,1) PRIMARY KEY,
    cliente_id INT NOT NULL,
    numero_telefono VARCHAR(15) NOT NULL,
    pais_id INT NOT NULL,
    es_principal BIT DEFAULT 0,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_TelefonoCliente_Cliente FOREIGN KEY (cliente_id) REFERENCES Cliente(cliente_id) ON DELETE CASCADE,
    CONSTRAINT FK_TelefonoCliente_Paises FOREIGN KEY (pais_id) REFERENCES Paises(pais_id),
    CONSTRAINT UQ_TelefonoCliente_Numero UNIQUE (cliente_id, numero_telefono),
    CONSTRAINT CHK_Telefono_Cliente_Formato CHECK (numero_telefono LIKE '[0-9]*')
);
GO

CREATE TABLE Reserva (
    reserva_id INT IDENTITY(1,1) PRIMARY KEY,
    cliente_id INT NOT NULL,
    habitacion_id INT NOT NULL,
    fecha_check_in DATETIME NOT NULL,
    fecha_check_out DATETIME NOT NULL,
    cantidad_personas INT NOT NULL,
    vehiculo BIT NOT NULL DEFAULT 0,
    estado_reserva_id INT NOT NULL,
    notas VARCHAR(500),
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NOT NULL DEFAULT GETDATE(),
    usuario_creacion VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    CONSTRAINT FK_Reserva_Cliente FOREIGN KEY (cliente_id) REFERENCES Cliente(cliente_id),
    CONSTRAINT FK_Reserva_Habitacion FOREIGN KEY (habitacion_id) REFERENCES Habitacion(habitacion_id),
    CONSTRAINT FK_Reserva_EstadoReserva FOREIGN KEY (estado_reserva_id) REFERENCES EstadoReserva(estado_reserva_id),
    CONSTRAINT CHK_Fechas_Validas CHECK (fecha_check_in < fecha_check_out),
    CONSTRAINT CHK_Personas_Positivas CHECK (cantidad_personas > 0),
    CONSTRAINT UQ_Habitacion_Fechas UNIQUE (habitacion_id, fecha_check_in, fecha_check_out)
);
GO

CREATE TABLE Factura (
    factura_id INT IDENTITY(1,1) PRIMARY KEY,
    reserva_id INT NOT NULL UNIQUE,
    numero_factura VARCHAR(20) UNIQUE NOT NULL,
    noches_estadia INT NOT NULL,
    importe_total DECIMAL(10,2) NOT NULL,
    estado_pago_id INT NOT NULL,
    medio_pago_id INT,
    fecha_emision DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_pago DATETIME,
    referencia_pago VARCHAR(255),
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NOT NULL DEFAULT GETDATE(),
    usuario_creacion VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    CONSTRAINT FK_Factura_Reserva FOREIGN KEY (reserva_id) REFERENCES Reserva(reserva_id),
    CONSTRAINT FK_Factura_EstadoPago FOREIGN KEY (estado_pago_id) REFERENCES EstadoPago(estado_pago_id),
    CONSTRAINT FK_Factura_MedioPago FOREIGN KEY (medio_pago_id) REFERENCES MedioPago(medio_pago_id),
    CONSTRAINT CHK_Importe_Positivo CHECK (importe_total > 0),
    CONSTRAINT CHK_Noches_Positivas CHECK (noches_estadia > 0)
);
GO

CREATE TABLE EmpresaTipoActividad (
    empresa_actividad_id INT IDENTITY(1,1) PRIMARY KEY,
    empresa_id INT NOT NULL,
    tipo_actividad_id INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    capacidad_minima INT DEFAULT 1,
    capacidad_maxima INT DEFAULT 30,
    duracion_horas DECIMAL(5,2),
    horario_inicio TIME,
    horario_fin TIME,
    dias_disponibles VARCHAR(100),
    fecha_creacion DATETIME DEFAULT GETDATE(),
    activo BIT DEFAULT 1,
    CONSTRAINT FK_EmpresaTipoActividad_Empresa FOREIGN KEY (empresa_id) REFERENCES EmpresaRecreacion(empresa_id) ON DELETE CASCADE,
    CONSTRAINT FK_EmpresaTipoActividad_TipoActividad FOREIGN KEY (tipo_actividad_id) REFERENCES TipoActividad(tipo_actividad_id),
    CONSTRAINT UQ_EmpresaTipoActividad UNIQUE (empresa_id, tipo_actividad_id),
    CONSTRAINT CHK_Precio_Actividad CHECK (precio > 0),
    CONSTRAINT CHK_Capacidad_Valida CHECK (capacidad_minima > 0 AND capacidad_maxima >= capacidad_minima)
);
GO

CREATE TABLE EmpresaServicioRecreacion (
    empresa_servicio_id INT IDENTITY(1,1) PRIMARY KEY,
    empresa_id INT NOT NULL,
    tipo_servicio_id INT NOT NULL,
    CONSTRAINT FK_EmpresaServicioRecreacion_Empresa FOREIGN KEY (empresa_id) REFERENCES EmpresaRecreacion(empresa_id) ON DELETE CASCADE,
    CONSTRAINT FK_EmpresaServicioRecreacion_TipoServicio FOREIGN KEY (tipo_servicio_id) REFERENCES TipoServicioRecreacion(tipo_servicio_id),
    CONSTRAINT UQ_EmpresaServicioRecreacion UNIQUE (empresa_id, tipo_servicio_id)
);
GO

CREATE TABLE Usuario (
    usuario_id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL,
    empresa_id INT,
    cliente_id INT,
    nombre_completo VARCHAR(255),
    ultimo_acceso DATETIME,
    intentos_fallidos INT DEFAULT 0,
    bloqueado BIT DEFAULT 0,
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NOT NULL DEFAULT GETDATE(),
    activo BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Usuario_Empresa FOREIGN KEY (empresa_id) REFERENCES Empresa(empresa_id) ON DELETE SET NULL,
    CONSTRAINT FK_Usuario_Cliente FOREIGN KEY (cliente_id) REFERENCES Cliente(cliente_id) ON DELETE SET NULL,
    CONSTRAINT CHK_Tipo_Usuario CHECK (tipo_usuario IN ('admin', 'empresa', 'cliente')),
    CONSTRAINT CHK_Email_Formato CHECK (email LIKE '%@%.%')
);
GO

CREATE TABLE Auditoria (
    auditoria_id INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT,
    tabla_afectada VARCHAR(100) NOT NULL,
    operacion VARCHAR(20) NOT NULL,
    registro_id INT,
    valores_anteriores VARCHAR(MAX),
    valores_nuevos VARCHAR(MAX),
    fecha_operacion DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Auditoria_Usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id),
    CONSTRAINT CHK_Operacion CHECK (operacion IN ('INSERT', 'UPDATE', 'DELETE'))
);
GO

-- Índices
CREATE INDEX IX_Empresa_Cedula ON Empresa(cedula_juridica);
CREATE INDEX IX_Empresa_Distrito ON Empresa(distrito_id);
CREATE INDEX IX_Empresa_TipoEmpresa ON Empresa(tipo_empresa);
CREATE INDEX IX_Empresa_Activo ON Empresa(activo);
GO

CREATE INDEX IX_Habitacion_Empresa ON Habitacion(empresa_id);
CREATE INDEX IX_Habitacion_Estado ON Habitacion(estado_habitacion_id);
CREATE INDEX IX_Habitacion_EmpresaEstado ON Habitacion(empresa_id, estado_habitacion_id);
GO

CREATE INDEX IX_Reserva_Cliente ON Reserva(cliente_id);
CREATE INDEX IX_Reserva_Habitacion ON Reserva(habitacion_id);
CREATE INDEX IX_Reserva_Estado ON Reserva(estado_reserva_id);
CREATE INDEX IX_Reserva_Fechas ON Reserva(fecha_check_in, fecha_check_out);
CREATE INDEX IX_Reserva_HabitacionFechas ON Reserva(habitacion_id, fecha_check_in, fecha_check_out);
GO

CREATE INDEX IX_Factura_Reserva ON Factura(reserva_id);
CREATE INDEX IX_Factura_EstadoPago ON Factura(estado_pago_id);
CREATE INDEX IX_Factura_Fecha ON Factura(fecha_emision);
CREATE INDEX IX_Factura_NumeroFactura ON Factura(numero_factura);
GO

CREATE INDEX IX_Cliente_Identificacion ON Cliente(cliente_identificacion);
CREATE INDEX IX_Cliente_Email ON Cliente(correo_electronico);
CREATE INDEX IX_Cliente_Pais ON Cliente(pais_residencia_id);
CREATE INDEX IX_Cliente_Activo ON Cliente(activo);
GO

CREATE INDEX IX_Usuario_Email ON Usuario(email);
CREATE INDEX IX_Usuario_Tipo ON Usuario(tipo_usuario);
CREATE INDEX IX_Usuario_Empresa ON Usuario(empresa_id);
CREATE INDEX IX_Usuario_Activo ON Usuario(activo);
GO

CREATE INDEX IX_Auditoria_Usuario ON Auditoria(usuario_id);
CREATE INDEX IX_Auditoria_Tabla ON Auditoria(tabla_afectada);
CREATE INDEX IX_Auditoria_Fecha ON Auditoria(fecha_operacion);
GO