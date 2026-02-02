export type BedType = 'individual' | 'queen' | 'king';

export interface RoomType {
  id: string;
  hospitalityId: string;
  nombre: string;
  descripcion: string;
  tipoCama: BedType;
  comodidades: string[];
  precio: number;
  fotos?: string[];              // URLs separadas por coma o array
  activo: boolean;
}

export interface RoomInstance {
  id: string;
  hospitalityId: string;
  roomTypeId: string;
  numero: string;
  estado: 'activo' | 'inactivo';
}