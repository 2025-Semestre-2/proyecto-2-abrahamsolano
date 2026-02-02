export interface Cliente {
  id: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  tipoIdentificacion: 'pasaporte' | 'dimex' | 'cedula' | 'otro';
  numeroIdentificacion: string;
  paisResidencia: string;
  direccion?: {
    provincia?: string;
    canton?: string;
    distrito?: string;
  };
  telefono1: {
    codigoPais: string;
    numero: string;
  };
  telefono2?: {
    codigoPais: string;
    numero: string;
  };
  email: string;
}

export interface ClienteFormData {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  tipoIdentificacion: 'pasaporte' | 'dimex' | 'cedula' | 'otro';
  numeroIdentificacion: string;
  paisResidencia: string;
  provincia?: string;
  canton?: string;
  distrito?: string;
  telefono1CodigoPais: string;
  telefono1Numero: string;
  telefono2CodigoPais?: string;
  telefono2Numero?: string;
  email: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  location?: string;
  bio?: string;
  languages: string[];
  preferences: {
    petFriendly: boolean;
    nonSmoking: boolean;
    oceanView: boolean;
    bedType?: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
  };
  photoUrl?: string;
  verified: boolean;
  stats: {
    bookingsCount: number;
    totalNights: number;
    reviewsCount: number;
  };
}

export interface UserProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender?: string;
  location?: string;
  bio?: string;
  languages: string[];
  petFriendly: boolean;
  nonSmoking: boolean;
  oceanView: boolean;
  bedType?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  photoUrl?: string;
}
