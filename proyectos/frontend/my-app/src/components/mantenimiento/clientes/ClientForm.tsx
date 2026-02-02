import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, User, Calendar, Globe, MapPin } from "lucide-react";
import { Client } from "@/types/client.types";

interface ClientFormProps {
  client: Partial<Client>;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (field: keyof Client, value: any) => void;
}

export function ClientForm({
  client,
  isEditing,
  onSubmit,
  onCancel,
  onChange,
}: ClientFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="nombre"
              value={client.nombre || ""}
              onChange={(e) => onChange("nombre", e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Apellidos */}
        <div className="space-y-2">
          <Label htmlFor="apellidos">Apellidos</Label>
          <Input
            id="apellidos"
            value={client.apellidos || ""}
            onChange={(e) => onChange("apellidos", e.target.value)}
            required
          />
        </div>

        {/* Documento */}
        <div className="space-y-2">
          <Label htmlFor="documento">Cédula / Pasaporte</Label>
          <Input
            id="documento"
            value={client.documentoIdentidad || ""}
            onChange={(e) => onChange("documentoIdentidad", e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={client.email || ""}
              onChange={(e) => onChange("email", e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Teléfono 1 */}
        <div className="space-y-2">
          <Label htmlFor="telefono1">Teléfono principal</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="telefono1"
              value={client.telefono1 || ""}
              onChange={(e) => onChange("telefono1", e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Teléfono 2 */}
        <div className="space-y-2">
          <Label htmlFor="telefono2">Teléfono secundario (opcional)</Label>
          <Input
            id="telefono2"
            value={client.telefono2 || ""}
            onChange={(e) => onChange("telefono2", e.target.value)}
          />
        </div>

        {/* Fecha nacimiento */}
        <div className="space-y-2">
          <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="fechaNacimiento"
              type="date"
              value={client.fechaNacimiento || ""}
              onChange={(e) => onChange("fechaNacimiento", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Nacionalidad */}
        <div className="space-y-2">
          <Label htmlFor="nacionalidad">Nacionalidad</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="nacionalidad"
              value={client.nacionalidad || ""}
              onChange={(e) => onChange("nacionalidad", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Dirección */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="direccion">Dirección</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Textarea
              id="direccion"
              value={client.direccion || ""}
              onChange={(e) => onChange("direccion", e.target.value)}
              className="pl-10 min-h-[80px]"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        >
          {isEditing ? "Actualizar Cliente" : "Registrar Cliente"}
        </Button>
      </div>
    </form>
  );
}