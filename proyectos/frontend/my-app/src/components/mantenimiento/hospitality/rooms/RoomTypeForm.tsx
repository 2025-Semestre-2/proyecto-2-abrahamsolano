import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign } from "lucide-react";
import { RoomType } from "@/types/room.types";

const COMODIDADES = [
  "Wifi", "Aire acondicionado", "Ventilador", "Agua caliente",
  "TV", "Minibar", "Caja fuerte", "Balcón", "Vista al mar",
  "Terraza", "Cafetera", "Nevera", "Acceso discapacitados"
];

interface RoomTypeFormProps {
  formData: Partial<RoomType>;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (field: keyof RoomType, value: any) => void;
  onToggleComodidad: (comodidad: string) => void;
}

export function RoomTypeForm({
  formData,
  isEditing,
  onSubmit,
  onCancel,
  onChange,
  onToggleComodidad,
}: RoomTypeFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>Nombre del tipo de habitación *</Label>
        <Input
          value={formData.nombre || ""}
          onChange={(e) => onChange("nombre", e.target.value)}
          placeholder="Ej: Suite Familiar con vista al mar"
          required
        />
      </div>

      <div className="space-y-4">
        <Label>Descripción</Label>
        <Textarea
          value={formData.descripcion || ""}
          onChange={(e) => onChange("descripcion", e.target.value)}
          placeholder="Detalles importantes..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>Tipo de cama *</Label>
          <Select
            value={formData.tipoCama}
            onValueChange={(v) => onChange("tipoCama", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="queen">Queen</SelectItem>
              <SelectItem value="king">King</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Precio por noche (USD) *</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="number"
              className="pl-10"
              value={formData.precio || ""}
              onChange={(e) => onChange("precio", Number(e.target.value))}
              placeholder="Ej: 95"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Comodidades incluidas</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {COMODIDADES.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={item}
                checked={formData.comodidades?.includes(item)}
                onCheckedChange={() => onToggleComodidad(item)}
              />
              <Label htmlFor={item} className="text-sm cursor-pointer">
                {item}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
          {isEditing ? "Actualizar tipo" : "Crear tipo"}
        </Button>
      </div>
    </form>
  );
}