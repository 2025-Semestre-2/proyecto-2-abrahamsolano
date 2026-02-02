import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { PropertyFormData } from "@/types/business.types";

interface PropertyFormProps {
  formData: PropertyFormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof PropertyFormData, value: string) => void;
  onCancel: () => void;
}

export function PropertyForm({
  formData,
  onSubmit,
  onChange,
  onCancel,
}: PropertyFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título de la Propiedad *</Label>
        <Input
          id="title"
          placeholder="ej: Cabaña Frente al Mar"
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación *</Label>
          <Input
            id="location"
            placeholder="Puerto Viejo, Cahuita..."
            value={formData.location}
            onChange={(e) => onChange("location", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Propiedad *</Label>
          <Input
            id="type"
            placeholder="Cabaña, Suite, Villa..."
            value={formData.type}
            onChange={(e) => onChange("type", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Precio/Noche ($) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="75"
            value={formData.price}
            onChange={(e) => onChange("price", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guests">Huéspedes *</Label>
          <Input
            id="guests"
            type="number"
            min="1"
            placeholder="4"
            value={formData.guests}
            onChange={(e) => onChange("guests", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="beds">Camas *</Label>
          <Input
            id="beds"
            type="number"
            min="1"
            placeholder="2"
            value={formData.beds}
            onChange={(e) => onChange("beds", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción *</Label>
        <Textarea
          id="description"
          placeholder="Describe tu propiedad..."
          rows={4}
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL de Imagen</Label>
        <div className="flex gap-2">
          <Input
            id="imageUrl"
            type="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={formData.imageUrl}
            onChange={(e) => onChange("imageUrl", e.target.value)}
          />
          <Button type="button" variant="outline">
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Opcional: Deja vacío para usar imagen por defecto
        </p>
      </div>

      <div className="flex gap-3 pt-4">
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
          Agregar Propiedad
        </Button>
      </div>
    </form>
  );
}
