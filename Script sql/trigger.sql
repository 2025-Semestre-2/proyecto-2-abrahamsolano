USE SG_Hotelera;
GO

CREATE TRIGGER TRG_PreventFacturaDelete
ON Factura
INSTEAD OF DELETE
AS
BEGIN
    RAISERROR('No se permite eliminar facturas. Las facturas son inmutables.', 16, 1);
    ROLLBACK TRANSACTION;
END;
GO

CREATE TRIGGER TRG_PreventReservaDeleteConfirmada
ON Reserva
INSTEAD OF DELETE
AS
BEGIN
    DECLARE @estado INT;
    SELECT @estado = estado_reserva_id FROM deleted;
   
    IF @estado NOT IN (3)
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
   
    SELECT
        @reserva_id = i.reserva_id,
        @estado_nuevo = i.estado_reserva_id,
        @estado_anterior = d.estado_reserva_id
    FROM inserted i
    INNER JOIN deleted d ON i.reserva_id = d.reserva_id;
   
    IF @estado_nuevo = 4 AND @estado_anterior <> 4
    BEGIN
        SELECT @noches = DATEDIFF(DAY, fecha_check_in, fecha_check_out)
        FROM Reserva WHERE reserva_id = @reserva_id;
       
        SELECT @precio_noche = h.precio_noche
        FROM Reserva r
        INNER JOIN Habitacion h ON r.habitacion_id = h.habitacion_id
        WHERE r.reserva_id = @reserva_id;
       
        SET @importe = @noches * @precio_noche;
       
        SET @numero_factura = 'FAC-' + CONVERT(VARCHAR(4), YEAR(GETDATE())) + '-'
                            + RIGHT('0000' + CONVERT(VARCHAR(4),
                            (SELECT COUNT(*) FROM Factura WHERE YEAR(fecha_creacion) = YEAR(GETDATE())) + 1), 4);
       
        IF NOT EXISTS (SELECT 1 FROM Factura WHERE reserva_id = @reserva_id)
        BEGIN
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
                1,
                GETDATE(),
                SYSTEM_USER
            );
        END
    END
END;
GO

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