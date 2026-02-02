export interface HospitalityService {
  id: string;
  nombreHotel: string;
  cedulaJuridica: string;
  tipoHospedaje:
    | "Hotel"
    | "Hostal"
    | "Casa"
    | "Departamento"
    | "Cuarto compartido"
    | "Cabaña";
  direccion: {
    provincia: string;
    canton: string;
    distrito: string;
    barrio: string;
    senasExactas: string;
  };
  referenciaGPS: string;
  telefono1: string;
  telefono2: string;
  email: string;
  sitioWeb?: string;
  redesSociales: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    airbnb?: string;
    threads?: string;
    x?: string;
  };
  servicios: string[];
}

export type HospitalityFormData = Partial<HospitalityService>;
