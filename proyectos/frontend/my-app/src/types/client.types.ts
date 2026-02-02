export interface Client {
  id: string;                     // email o cédula como identificador único
  nombre: string;
  apellidos: string;
  documentoIdentidad: string;     // cédula, pasaporte, etc.
  email: string;
  telefono1: string;
  telefono2?: string;
  fechaNacimiento?: string;       // ISO date "YYYY-MM-DD"
  nacionalidad?: string;
  direccion?: string;
  activo: boolean;                // para desactivar cuentas sin eliminar
  fechaRegistro: string;          // fecha de creación
  ultimaActividad?: string;       // opcional, para reportes
}