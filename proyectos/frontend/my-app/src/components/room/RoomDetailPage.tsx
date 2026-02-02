import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Star,
  MapPin,
  Users,
  Bed,
  Wifi,
  Car,
  Waves,
  Utensils,
  Calendar,
} from "lucide-react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { Room } from "@/components/room/room.types";
import { useState } from "react";

interface RoomDetailPageProps {
  room: Room;
  onBack: () => void;
}

export function RoomDetailPage({ room, onBack }: RoomDetailPageProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    checkIn: "",
    checkOut: "",
    huespedes: "1",
    comentarios: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("¡Reserva enviada con éxito! Nos pondremos en contacto pronto.");
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 hover:bg-emerald-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a resultados
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Room Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative overflow-hidden rounded-2xl aspect-[16/9]">
              <ImageWithFallback
                src={room.imageUrl}
                alt={room.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title and Location */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl mb-2">{room.title}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{room.location}, Limón</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{room.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-gray-700 border-t border-b py-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <span>{room.guests} huéspedes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-emerald-600" />
                  <span>{room.beds} camas</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl mb-3">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">{room.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl mb-4">Servicios</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: Wifi, label: "WiFi gratis" },
                  { icon: Car, label: "Estacionamiento" },
                  { icon: Waves, label: "Vista al mar" },
                  { icon: Utensils, label: "Cocina" },
                  { icon: Bed, label: "Ropa de cama" },
                  { icon: Calendar, label: "Check-in flexible" },
                ].map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <amenity.icon className="h-5 w-5 text-emerald-600" />
                    <span className="text-gray-700">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Reservation Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl text-emerald-600">
                      ${room.price}
                    </span>
                    <span className="text-gray-600">/ noche</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre Completo *</Label>
                    <Input
                      id="nombre"
                      placeholder="Juan Pérez"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      placeholder="+506 1234-5678"
                      value={formData.telefono}
                      onChange={(e) =>
                        setFormData({ ...formData, telefono: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkIn">Check-in *</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={formData.checkIn}
                        onChange={(e) =>
                          setFormData({ ...formData, checkIn: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkOut">Check-out *</Label>
                      <Input
                        id="checkOut"
                        type="date"
                        value={formData.checkOut}
                        onChange={(e) =>
                          setFormData({ ...formData, checkOut: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="huespedes">Número de Huéspedes *</Label>
                    <Input
                      id="huespedes"
                      type="number"
                      min="1"
                      max={room.guests}
                      value={formData.huespedes}
                      onChange={(e) =>
                        setFormData({ ...formData, huespedes: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comentarios">Comentarios</Label>
                    <Textarea
                      id="comentarios"
                      placeholder="Alguna solicitud especial..."
                      rows={3}
                      value={formData.comentarios}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          comentarios: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6"
                  >
                    Reservar Ahora
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    No se realizará ningún cargo aún
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
