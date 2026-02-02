USE SG_Hotelera;
GO

IF OBJECT_ID('sp_CrearUsuario', 'P') IS NOT NULL
    DROP PROCEDURE sp_CrearUsuario;
GO

IF OBJECT_ID('sp_ValidarUsuario', 'P') IS NOT NULL
    DROP PROCEDURE sp_ValidarUsuario;
GO

IF OBJECT_ID('sp_CrearEmpresa', 'P') IS NOT NULL
    DROP PROCEDURE sp_CrearEmpresa;
GO

IF OBJECT_ID('sp_CrearReserva', 'P') IS NOT NULL
    DROP PROCEDURE sp_CrearReserva;
GO

IF OBJECT_ID('sp_ActualizarEstadoReserva', 'P') IS NOT NULL
    DROP PROCEDURE sp_ActualizarEstadoReserva;
GO

IF OBJECT_ID('sp_RegistrarCliente', 'P') IS NOT NULL
    DROP PROCEDURE sp_RegistrarCliente;
GO

IF OBJECT_ID('sp_MarcarFacturaPagada', 'P') IS NOT NULL
    DROP PROCEDURE sp_MarcarFacturaPagada;
GO

IF OBJECT_ID('sp_CrearHabitacion', 'P') IS NOT NULL
    DROP PROCEDURE sp_CrearHabitacion;
GO

CREATE PROCEDURE sp_CrearUsuario
    @email VARCHAR(255),
    @password_hash VARCHAR(255),
    @tipo_usuario VARCHAR(50),
    @empresa_id INT = NULL,
    @cliente_id INT = NULL,
    @nombre_completo VARCHAR(255) = NULL,
    @usuario_id INT OUTPUT,
    @resultado INT OUTPUT
AS
BEGIN
    BEGIN TRY
        IF @email NOT LIKE '%@%.%'
        BEGIN
            SET @usuario_id = 0;
            SET @resultado = -1;
            RETURN;
        END
       
        IF @tipo_usuario NOT IN ('admin', 'empresa', 'cliente')
        BEGIN
            SET @usuario_id = 0;
            SET @resultado = -2;
            RETURN;
        END
       
        IF EXISTS (SELECT 1 FROM Usuario WHERE email = @email)
        BEGIN
            SET @usuario_id = 0;
            SET @resultado = -3;
            RETURN;
        END
       
        INSERT INTO Usuario (email, password_hash, tipo_usuario, empresa_id, cliente_id, nombre_completo)
        VALUES (@email, @password_hash, @tipo_usuario, @empresa_id, @cliente_id, @nombre_completo);
       
        SET @usuario_id = @@IDENTITY;
        SET @resultado = 1;
    END TRY
    BEGIN CATCH
        SET @usuario_id = 0;
        SET @resultado = -99;
    END CATCH
END;
GO

CREATE PROCEDURE sp_ValidarUsuario
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

CREATE PROCEDURE sp_CrearEmpresa
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
            SET @empresa_id = 0;
            RETURN;
        END
       
        IF EXISTS (SELECT 1 FROM Empresa WHERE cedula_juridica = @cedula_juridica)
        BEGIN
            SET @resultado = -2;
            SET @empresa_id = 0;
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
        SET @empresa_id = 0;
    END CATCH
END;
GO

CREATE PROCEDURE sp_CrearReserva
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
            SET @reserva_id = 0;
            RETURN;
        END
       
        IF @cantidad_personas <= 0
        BEGIN
            SET @resultado = -2;
            SET @reserva_id = 0;
            RETURN;
        END
       
        IF EXISTS (
            SELECT 1 FROM Reserva r
            WHERE r.habitacion_id = @habitacion_id
            AND r.estado_reserva_id IN (1, 2)
            AND ((@fecha_check_in < r.fecha_check_out AND @fecha_check_out > r.fecha_check_in))
        )
        BEGIN
            SET @resultado = -3;
            SET @reserva_id = 0;
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
        SET @reserva_id = 0;
    END CATCH
END;
GO

CREATE PROCEDURE sp_ActualizarEstadoReserva
    @reserva_id INT,
    @nuevo_estado_id INT,
    @resultado INT OUTPUT
AS
BEGIN
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Reserva WHERE reserva_id = @reserva_id)
        BEGIN
            SET @resultado = -1;
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

CREATE PROCEDURE sp_RegistrarCliente
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
            SET @cliente_id = 0;
            RETURN;
        END
       
        IF @correo_electronico NOT LIKE '%@%.%'
        BEGIN
            SET @resultado = -2;
            SET @cliente_id = 0;
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
        SET @cliente_id = 0;
    END CATCH
END;
GO

CREATE PROCEDURE sp_MarcarFacturaPagada
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

CREATE PROCEDURE sp_CrearHabitacion
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
            SET @habitacion_id = 0;
            RETURN;
        END
       
        IF @precio_noche <= 0
        BEGIN
            SET @resultado = -2;
            SET @habitacion_id = 0;
            RETURN;
        END
       
        IF EXISTS (SELECT 1 FROM Habitacion WHERE empresa_id = @empresa_id AND numero_habitacion = @numero_habitacion)
        BEGIN
            SET @resultado = -3;
            SET @habitacion_id = 0;
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
        SET @habitacion_id = 0;
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
GRANT EXECUTE ON sp_CrearReserva TO ClienteRole;
GRANT EXECUTE ON sp_RegistrarCliente TO ClienteRole;
GO

DECLARE @usuario_id INT, @resultado INT;
EXECUTE sp_CrearUsuario
    @email = 'admin@hotelera.com',
    @password_hash = 'CAMBIAR_ESTO_EN_PRODUCCION_HASH',
    @tipo_usuario = 'admin',
    @nombre_completo = 'Administrador Sistema',
    @usuario_id = @usuario_id OUTPUT,
    @resultado = @resultado OUTPUT;
GO