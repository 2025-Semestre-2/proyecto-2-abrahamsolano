USE SG_Hotelera;
GO

IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'AdminRole' AND type = 'R')
BEGIN
    CREATE ROLE AdminRole;
END
GO

IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'ClienteRole' AND type = 'R')
BEGIN
    CREATE ROLE ClienteRole;
END
GO

CREATE OR ALTER VIEW vw_EmpresaDetallada AS
SELECT
    e.empresa_id,
    e.cedula_juridica,
    e.nombre_empresa,
    e.correo_electronico,
    e.url_sitio_web,
    p.nombre_provincia,
    c.nombre_canton,
    d.nombre_distrito,
    e.direccion_exacta,
    e.referencia_gps,
    e.tipo_empresa,
    e.fecha_creacion,
    e.activo
FROM Empresa e
JOIN Distrito d ON e.distrito_id = d.distrito_id
JOIN Canton c ON d.canton_id = c.canton_id
JOIN Provincia p ON c.provincia_id = p.provincia_id;
GO

CREATE OR ALTER VIEW vw_HabitacionesDisponibles AS
SELECT DISTINCT
    h.habitacion_id,
    h.numero_habitacion,
    e.nombre_empresa,
    th.nombre_tipo_habitacion,
    h.precio_noche,
    eh.nombre_estado,
    h.piso,
    h.numero_banos,
    h.metros_cuadrados
FROM Habitacion h
JOIN Empresa e ON h.empresa_id = e.empresa_id
JOIN TipoHabitacion th ON h.tipo_habitacion_id = th.tipo_habitacion_id
JOIN EstadoHabitacion eh ON h.estado_habitacion_id = eh.estado_habitacion_id
WHERE h.estado_habitacion_id = 1
    AND NOT EXISTS (
        SELECT 1 FROM Reserva r
        WHERE r.habitacion_id = h.habitacion_id
        AND r.estado_reserva_id IN (1, 2)
    );
GO

CREATE OR ALTER VIEW vw_ClienteDetalles AS
SELECT
    c.cliente_id,
    c.cliente_identificacion,
    c.tipo_identificacion,
    c.nombre,
    c.primer_apellido,
    c.segundo_apellido,
    p.nombre_pais,
    CASE WHEN c.distrito_id IS NOT NULL THEN
        (SELECT d.nombre_distrito + ', ' + ca.nombre_canton + ', ' + pr.nombre_provincia
         FROM Distrito d
         JOIN Canton ca ON d.canton_id = ca.canton_id
         JOIN Provincia pr ON ca.provincia_id = pr.provincia_id
         WHERE d.distrito_id = c.distrito_id)
    ELSE NULL END AS ubicacion,
    c.correo_electronico
FROM Cliente c
JOIN Paises p ON c.pais_residencia_id = p.pais_id;
GO

CREATE OR ALTER VIEW vw_ReservasActivas AS
SELECT
    r.reserva_id,
    c.cliente_identificacion,
    c.nombre,
    c.primer_apellido,
    h.numero_habitacion,
    e.nombre_empresa,
    th.nombre_tipo_habitacion,
    r.fecha_check_in,
    r.fecha_check_out,
    DATEDIFF(DAY, r.fecha_check_in, r.fecha_check_out) AS noches,
    r.cantidad_personas,
    h.precio_noche,
    (DATEDIFF(DAY, r.fecha_check_in, r.fecha_check_out) * h.precio_noche) AS importe_total,
    er.nombre_estado,
    r.fecha_creacion
FROM Reserva r
JOIN Cliente c ON r.cliente_id = c.cliente_id
JOIN Habitacion h ON r.habitacion_id = h.habitacion_id
JOIN Empresa e ON h.empresa_id = e.empresa_id
JOIN TipoHabitacion th ON h.tipo_habitacion_id = th.tipo_habitacion_id
JOIN EstadoReserva er ON r.estado_reserva_id = er.estado_reserva_id
WHERE r.estado_reserva_id IN (1, 2);
GO

CREATE OR ALTER VIEW vw_FacturaDetalle AS
SELECT
    f.factura_id,
    f.numero_factura,
    r.reserva_id,
    c.cliente_identificacion,
    c.nombre,
    c.primer_apellido,
    h.numero_habitacion,
    e.nombre_empresa,
    f.noches_estadia,
    f.importe_total,
    mp.nombre_medio,
    ep.nombre_estado,
    f.fecha_emision,
    f.fecha_pago,
    f.fecha_creacion
FROM Factura f
JOIN Reserva r ON f.reserva_id = r.reserva_id
JOIN Cliente c ON r.cliente_id = c.cliente_id
JOIN Habitacion h ON r.habitacion_id = h.habitacion_id
JOIN Empresa e ON h.empresa_id = e.empresa_id
JOIN MedioPago mp ON f.medio_pago_id = mp.medio_pago_id
JOIN EstadoPago ep ON f.estado_pago_id = ep.estado_pago_id;
GO

CREATE OR ALTER VIEW vw_ActividadesRecreacion AS
SELECT
    e.empresa_id,
    e.nombre_empresa,
    er.nombre_contacto,
    ta.nombre_tipo_actividad,
    eta.precio,
    eta.descripcion,
    eta.duracion_horas,
    eta.capacidad_minima,
    eta.capacidad_maxima,
    eta.dias_disponibles
FROM EmpresaRecreacion er
JOIN Empresa e ON er.empresa_id = e.empresa_id
JOIN EmpresaTipoActividad eta ON e.empresa_id = eta.empresa_id
JOIN TipoActividad ta ON eta.tipo_actividad_id = ta.tipo_actividad_id
WHERE e.activo = 1 AND e.tipo_empresa IN ('recreacion', 'ambas');
GO

CREATE OR ALTER VIEW vw_DisponibilidadPorEmpresa AS
SELECT
    e.empresa_id,
    e.nombre_empresa,
    COUNT(h.habitacion_id) AS total_habitaciones,
    SUM(CASE WHEN eh.nombre_estado = 'Disponible' THEN 1 ELSE 0 END) AS disponibles,
    SUM(CASE WHEN eh.nombre_estado = 'Ocupada' THEN 1 ELSE 0 END) AS ocupadas,
    SUM(CASE WHEN eh.nombre_estado = 'Limpieza' THEN 1 ELSE 0 END) AS limpieza,
    SUM(CASE WHEN eh.nombre_estado = 'Mantenimiento' THEN 1 ELSE 0 END) AS mantenimiento
FROM Empresa e
LEFT JOIN Habitacion h ON e.empresa_id = h.empresa_id
LEFT JOIN EstadoHabitacion eh ON h.estado_habitacion_id = eh.estado_habitacion_id
WHERE e.tipo_empresa IN ('hospedaje', 'ambas')
GROUP BY e.empresa_id, e.nombre_empresa;
GO

CREATE OR ALTER PROCEDURE sp_CrearUsuario
    @email VARCHAR(255),
    @password_hash VARCHAR(255),
    @tipo_usuario VARCHAR(50),
    @empresa_id INT = NULL,
    @cliente_id INT = NULL,
    @nombre_completo VARCHAR(255) = NULL,
    @resultado INT OUTPUT
AS
BEGIN
    BEGIN TRY
        IF @email NOT LIKE '%@%.%'
        BEGIN
            SET @resultado = -1;
            RAISERROR('Email inválido', 16, 1);
            RETURN;
        END
       
        IF @tipo_usuario NOT IN ('admin', 'empresa', 'cliente')
        BEGIN
            SET @resultado = -2;
            RAISERROR('Tipo de usuario inválido', 16, 1);
            RETURN;
        END
       
        IF EXISTS (SELECT 1 FROM Usuario WHERE email = @email)
        BEGIN
            SET @resultado = -3;
            RAISERROR('El email ya está registrado', 16, 1);
            RETURN;
        END
       
        INSERT INTO Usuario (email, password_hash, tipo_usuario, empresa_id, cliente_id, nombre_completo)
        VALUES (@email, @password_hash, @tipo_usuario, @empresa_id, @cliente_id, @nombre_completo);
       
        SET @resultado = @@IDENTITY;
    END TRY
    BEGIN CATCH
        SET @resultado = -99;
        RAISERROR('Error al crear usuario', 16, 1);
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE sp_ValidarUsuario
    @email VARCHAR(255),
    @password_hash VARCHAR(255),
    @usuario_id INT OUTPUT,
    @tipo_usuario VARCHAR(50) OUTPUT,
    @resultado INT OUTPUT
AS
BEGIN
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Usuario WHERE email = @email AND password_hash = @password_hash AND activo = 1)
        BEGIN
            SET @resultado = -1;
            SET @usuario_id = NULL;
            SET @tipo_usuario = NULL;
            RETURN;
        END
       
        SELECT
            @usuario_id = usuario_id,
            @tipo_usuario = tipo_usuario
        FROM Usuario
        WHERE email = @email AND password_hash = @password_hash AND activo = 1;
       
        UPDATE Usuario SET ultimo_acceso = GETDATE() WHERE usuario_id = @usuario_id;
       
        SET @resultado = 1;
    END TRY
    BEGIN CATCH
        SET @resultado = -99;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE sp_CrearEmpresa
    @cedula_juridica VARCHAR(50),
    @nombre_empresa VARCHAR(255),
    @correo_electronico VARCHAR(255),
    @url_sitio_web VARCHAR(255),
    @distrito_id INT,
    @direccion_exacta VARCHAR(255),
    @referencia_gps VARCHAR(100),
    @tipo_empresa VARCHAR(50),
    @tipo_alojamiento_id INT = NULL,
    @empresa_id INT OUTPUT,
    @resultado INT OUTPUT
AS
BEGIN
    BEGIN TRY
        IF @cedula_juridica NOT LIKE '[0-9]-[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]'
        BEGIN
            SET @resultado = -1;
            RAISERROR('Cédula jurídica inválida', 16, 1);
            RETURN;
        END
       
        IF EXISTS (SELECT 1 FROM Empresa WHERE cedula_juridica = @cedula_juridica)
        BEGIN
            SET @resultado = -2;
            RAISERROR('La cédula jurídica ya existe', 16, 1);
            RETURN;
        END
       
        INSERT INTO Empresa (cedula_juridica, nombre_empresa, correo_electronico, url_sitio_web,
                            distrito_id, direccion_exacta, referencia_gps, tipo_empresa,
                            fecha_creacion, usuario_creacion)
        VALUES (@cedula_juridica, @nombre_empresa, @correo_electronico, @url_sitio_web,
                @distrito_id, @direccion_exacta, @referencia_gps, @tipo_empresa,
                GETDATE(), SYSTEM_USER);
       
        SET @empresa_id = @@IDENTITY;
       
        IF @tipo_empresa IN ('hospedaje', 'ambas') AND @tipo_alojamiento_id IS NOT NULL
        BEGIN
            INSERT INTO EmpresaHospedaje (empresa_id, tipo_alojamiento_id)
            VALUES (@empresa_id, @tipo_alojamiento_id);
        END
       
        IF @tipo_empresa IN ('recreacion', 'ambas')
        BEGIN
            INSERT INTO EmpresaRecreacion (empresa_id, nombre_contacto)
            VALUES (@empresa_id, @nombre_empresa);
        END
       
        SET @resultado = 1;
    END TRY
    BEGIN CATCH
        SET @resultado = -99;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE sp_CrearReserva
    @cliente_id INT,
    @habitacion_id INT,
    @fecha_check_in DATETIME,
    @fecha_check_out DATETIME,
    @cantidad_personas INT,
    @vehiculo BIT,
    @notas VARCHAR(500) = NULL,
    @reserva_id INT OUTPUT,
    @resultado INT OUTPUT
AS
BEGIN
    BEGIN TRY
        IF @fecha_check_in >= @fecha_check_out
        BEGIN
            SET @resultado = -1;
            RAISERROR('Fecha de check-out debe ser después de check-in', 16, 1);
            RETURN;
        END
       
        IF @cantidad_personas <= 0
        BEGIN
            SET @resultado = -2;
            RAISERROR('La cantidad de personas debe ser mayor a 0', 16, 1);
            RETURN;
        END
       
        IF EXISTS (
            SELECT 1 FROM Reserva r
            WHERE r.habitacion_id = @habitacion_id
            AND r.estado_reserva_id IN (1, 2)
            AND (
                (@fecha_check_in < r.fecha_check_out AND @fecha_check_out > r.fecha_check_in)
            )
        )
        BEGIN
            SET @resultado = -3;
            RAISERROR('La habitación no está disponible en esas fechas', 16, 1);
            RETURN;
        END
       
        INSERT INTO Reserva (cliente_id, habitacion_id, fecha_check_in, fecha_check_out,
                            cantidad_personas, vehiculo, estado_reserva_id, notas,
                            fecha_creacion, usuario_creacion)
        VALUES (@cliente_id, @habitacion_id, @fecha_check_in, @fecha_check_out,
                @cantidad_personas, @vehiculo, 1, @notas,
                GETDATE(), SYSTEM_USER);
       
        SET @reserva_id = @@IDENTITY;
        SET @resultado = 1;
    END TRY
    BEGIN CATCH
        SET @resultado = -99;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE sp_ActualizarEstadoReserva
    @reserva_id INT,
    @nuevo_estado_id INT,
    @resultado INT OUTPUT
AS
BEGIN
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Reserva WHERE reserva_id = @reserva_id)
        BEGIN
            SET @resultado = -1;
            RAISERROR('La reserva no existe', 16, 1);
            RETURN;
        END
       
        UPDATE Reserva
        SET estado_reserva_id = @nuevo_estado_id,
            fecha_modificacion = GETDATE(),
            usuario_modificacion = SYSTEM_USER
        WHERE reserva_id = @reserva_id;
       
        SET @resultado = 1;
    END TRY
    BEGIN CATCH
        SET @resultado = -99;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE sp_RegistrarCliente
    @cliente_identificacion VARCHAR(50),
    @tipo_identificacion VARCHAR(50),
    @nombre VARCHAR(100),
    @primer_apellido VARCHAR(100),
    @segundo_apellido VARCHAR(100) = NULL,
    @fecha_nacimiento DATE = NULL,
    @pais_residencia_id INT,
    @distrito_id INT = NULL,
    @direccion_exacta VARCHAR(255) = NULL,
    @correo_electronico VARCHAR(255),
    @cliente_id INT OUTPUT,
    @resultado INT OUTPUT
AS
BEGIN
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM Cliente WHERE cliente_identificacion = @cliente_identificacion)
        BEGIN
            SET @resultado = -1;
            RAISERROR('El cliente ya existe', 16, 1);
            RETURN;
        END
       
        IF @correo_electronico NOT LIKE '%@%.%'
        BEGIN
            SET @resultado = -2;
            RAISERROR('Email inválido', 16, 1);
            RETURN;
        END
       
        INSERT INTO Cliente (cliente_identificacion, tipo_identificacion, nombre, primer_apellido,
                            segundo_apellido, fecha_nacimiento, pais_residencia_id, distrito_id,
                            direccion_exacta, correo_electronico, fecha_creacion, usuario_creacion)
        VALUES (@cliente_identificacion, @tipo_identificacion, @nombre, @primer_apellido,
                @segundo_apellido, @fecha_nacimiento, @pais_residencia_id, @distrito_id,
                @direccion_exacta, @correo_electronico, GETDATE(), SYSTEM_USER);
       
        SET @cliente_id = @@IDENTITY;
        SET @resultado = 1;
    END TRY
    BEGIN CATCH
        SET @resultado = -99;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE sp_MarcarFacturaPagada
    @factura_id INT,
    @medio_pago_id INT,
    @referencia_pago VARCHAR(255) = NULL,
    @resultado INT OUTPUT
AS
BEGIN
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Factura WHERE factura_id = @factura_id)
        BEGIN
            SET @resultado = -1;
            RAISERROR('La factura no existe', 16, 1);
            RETURN;
        END
       
        UPDATE Factura
        SET estado_pago_id = 2,
            medio_pago_id = @medio_pago_id,
            fecha_pago = GETDATE(),
            referencia_pago = @referencia_pago,
            fecha_modificacion = GETDATE(),
            usuario_modificacion = SYSTEM_USER
        WHERE factura_id = @factura_id;
       
        SET @resultado = 1;
    END TRY
    BEGIN CATCH
        SET @resultado = -99;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE sp_CrearHabitacion
    @empresa_id INT,
    @numero_habitacion INT,
    @tipo_habitacion_id INT,
    @precio_noche DECIMAL(10,2),
    @piso INT = NULL,
    @numero_banos INT = NULL,
    @metros_cuadrados DECIMAL(8,2) = NULL,
    @habitacion_id INT OUTPUT,
    @resultado INT OUTPUT
AS
BEGIN
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Empresa WHERE empresa_id = @empresa_id)
        BEGIN
            SET @resultado = -1;
            RAISERROR('La empresa no existe', 16, 1);
            RETURN;
        END
       
        IF @precio_noche <= 0
        BEGIN
            SET @resultado = -2;
            RAISERROR('El precio debe ser mayor a 0', 16, 1);
            RETURN;
        END
       
        IF EXISTS (SELECT 1 FROM Habitacion WHERE empresa_id = @empresa_id AND numero_habitacion = @numero_habitacion)
        BEGIN
            SET @resultado = -3;
            RAISERROR('El número de habitación ya existe en esta empresa', 16, 1);
            RETURN;
        END
       
        INSERT INTO Habitacion (empresa_id, numero_habitacion, tipo_habitacion_id, precio_noche,
                               estado_habitacion_id, piso, numero_banos, metros_cuadrados,
                               fecha_creacion, usuario_creacion)
        VALUES (@empresa_id, @numero_habitacion, @tipo_habitacion_id, @precio_noche,
                1, @piso, @numero_banos, @metros_cuadrados,
                GETDATE(), SYSTEM_USER);
       
        SET @habitacion_id = @@IDENTITY;
        SET @resultado = 1;
    END TRY
    BEGIN CATCH
        SET @resultado = -99;
    END CATCH
END;
GO

GRANT EXECUTE ON sp_CrearUsuario TO AdminRole;
GRANT EXECUTE ON sp_CrearEmpresa TO AdminRole;
GRANT EXECUTE ON sp_CrearReserva TO AdminRole;
GRANT EXECUTE ON sp_ActualizarEstadoReserva TO AdminRole;
GRANT EXECUTE ON sp_RegistrarCliente TO AdminRole;
GRANT EXECUTE ON sp_MarcarFacturaPagada TO AdminRole;
GRANT EXECUTE ON sp_CrearHabitacion TO AdminRole;
GRANT SELECT ON vw_EmpresaDetallada TO AdminRole;
GRANT SELECT ON vw_HabitacionesDisponibles TO AdminRole;
GRANT SELECT ON vw_ClienteDetalles TO AdminRole;
GRANT SELECT ON vw_ReservasActivas TO AdminRole;
GRANT SELECT ON vw_FacturaDetalle TO AdminRole;
GRANT SELECT ON vw_ActividadesRecreacion TO AdminRole;
GRANT SELECT ON vw_DisponibilidadPorEmpresa TO AdminRole;
GO

GRANT SELECT ON vw_HabitacionesDisponibles TO ClienteRole;
GRANT SELECT ON vw_DisponibilidadPorEmpresa TO ClienteRole;
GRANT SELECT ON vw_ActividadesRecreacion TO ClienteRole;
GRANT EXECUTE ON sp_CrearReserva TO ClienteRole;
GRANT EXECUTE ON sp_RegistrarCliente TO ClienteRole;
GO

DECLARE @usuario_id INT, @resultado INT;
EXECUTE sp_CrearUsuario
    @email = 'admin@hotelera.com',
    @password_hash = 'password123',
    @tipo_usuario = 'admin',
    @nombre_completo = 'Administrador Sistema',
    @usuario_id = @usuario_id OUTPUT,
    @resultado = @resultado OUTPUT;
GO