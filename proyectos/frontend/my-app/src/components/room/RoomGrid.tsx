// src/components/RoomsGrid.tsx
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, MapPin } from "lucide-react";
import { RoomCard } from "./RoomCard";
import type { Room } from "./room.types";

const mockRooms: Room[] = [
  {
    id: 1,
    title: "Cabaña Frente al Mar - Puerto Viejo",
    location: "Puerto Viejo de Talamanca",
    price: 75,
    rating: 4.8,
    guests: 4,
    beds: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1662638852986-fdea10dd4f52?auto=format&fit=crop&w=1080&q=80",
    description: "Hermosa cabaña frente al mar caribeño.",
  },
  {
    id: 2,
    title: "Suite de Lujo - Cahuita",
    location: "Cahuita",
    price: 120,
    rating: 4.9,
    guests: 2,
    beds: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1764533977104-9b258b474661?auto=format&fit=crop&w=1080&q=80",
    description: "Suite de lujo ideal para parejas.",
  },
  {
    id: 3,
    title: "Casa de Campo - Limón Centro",
    location: "Limón Centro",
    price: 55,
    rating: 4.7,
    guests: 6,
    beds: 3,
    imageUrl: "/src/assets/image.png",
    description: "Casa espaciosa en el corazón de Limón con acceso a servicios.",
  },
  {
    id: 4,
    title: "Departamento Moderno - Tortuguero",
    location: "Tortuguero",
    price: 85,
    rating: 4.6,
    guests: 4,
    beds: 2,
    imageUrl: "/src/assets/image.png",
    description: "Departamento moderno con vistas a la naturaleza tropical.",
  },
  {
    id: 5,
    title: "Bungalow Rústico - Cahuita",
    location: "Cahuita",
    price: 45,
    rating: 4.8,
    guests: 2,
    beds: 1,
    imageUrl: "/src/assets/image.png",
    description: "Bungalow acogedor rodeado de naturaleza y tranquilidad.",
  },
  {
    id: 6,
    title: "Villa Exclusiva - Puerto Viejo",
    location: "Puerto Viejo de Talamanca",
    price: 150,
    rating: 4.9,
    guests: 8,
    beds: 4,
    imageUrl: "/src/assets/image.png",
    description: "Villa exclusiva con piscina privada y acceso directo a la playa.",
  },
];

interface RoomsGridProps {
  onSelectRoom?: (room: Room) => void;
}

export function RoomsGrid({ onSelectRoom }: RoomsGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = mockRooms.filter(
    (room) =>
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    
    <section className="bg-gray-50">
      {/* Search */}
      <div className="mx-auto max-w-7xl px-4 pt-10">
        <div className="mb-8 flex items-center gap-2 rounded-full bg-white p-2 shadow-md">
          <MapPin className="ml-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar por ubicación o nombre..."
            className="border-none shadow-none focus-visible:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700">
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-6">
          <h2 className="text-3xl">Hospedajes disponibles</h2>
          <p className="text-muted-foreground">
            {filteredRooms.length} propiedades encontradas
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onClick={onSelectRoom}          // ← cambio clave aquí
            />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <p className="py-12 text-center text-gray-500">
            No se encontraron hospedajes
          </p>
        )}
      </div>
    </section>
    </>
  );
}