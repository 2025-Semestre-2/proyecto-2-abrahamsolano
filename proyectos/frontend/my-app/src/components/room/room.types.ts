// src/components/RoomCard.tsx o crea src/types/room.ts
export type Room = {
  id: number;
  title: string;
  location: string;
  price: number;
  rating?: number;
  imageUrl?: string;
  // Campos nuevos que necesita el detalle
  guests: number;       // ej: 2, 4
  beds: number;         // ej: 1, 2
  description: string;  // texto largo de descripción
};