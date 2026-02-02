import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { RoomTypeForm } from "./RoomTypeForm";
import type { RoomType } from "@/types/room.types";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";

interface RoomTypesSectionProps {
  hospitalityId: string;
  types: RoomType[];
  onChangeTypes: (updatedTypes: RoomType[]) => void;
}

export function RoomTypesSection({
  hospitalityId,
  types,
  onChangeTypes,
}: RoomTypesSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<RoomType | null>(null);
  const [formData, setFormData] = useState<Partial<RoomType>>({
    hospitalityId,
    comodidades: [],
  });

  const handleChange = (field: keyof RoomType, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleComodidad = (comodidad: string) => {
    const current = formData.comodidades || [];
    const updated = current.includes(comodidad)
      ? current.filter(c => c !== comodidad)
      : [...current, comodidad];
    setFormData(prev => ({ ...prev, comodidades: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre?.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    if (!formData.tipoCama) {
      toast.error("Seleccione tipo de cama");
      return;
    }
    if (!formData.precio || formData.precio <= 0) {
      toast.error("Precio inválido");
      return;
    }

    const newType: RoomType = {
      id: editing?.id || crypto.randomUUID(),
      hospitalityId,
      nombre: formData.nombre!,
      descripcion: formData.descripcion || "",
      tipoCama: formData.tipoCama!,
      comodidades: formData.comodidades || [],
      precio: formData.precio!,
      fotos: formData.fotos,
      activo: true,
    };

    let updated: RoomType[];
    if (editing) {
      updated = types.map(t => t.id === editing.id ? newType : t);
      toast.success("Tipo actualizado");
    } else {
      updated = [...types, newType];
      toast.success("Tipo creado");
    }

    onChangeTypes(updated);
    setIsOpen(false);
    setEditing(null);
    setFormData({ hospitalityId, comodidades: [] });
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este tipo de habitación?")) {
      onChangeTypes(types.filter(t => t.id !== id));
      toast.success("Tipo eliminado");
    }
  };

  return (
    <Card className="border-t-4 border-t-emerald-600 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Tipos de Habitación</CardTitle>
        <Button onClick={() => {
          setEditing(null);
          setFormData({ hospitalityId, comodidades: [] });
          setIsOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo tipo
        </Button>
      </CardHeader>

      <CardContent>
        {types.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>Aún no hay tipos de habitación para este hospedaje.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsOpen(true)}
            >
              Crear primer tipo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {types.map(type => (
              <div
                key={type.id}
                className="border rounded-lg p-4 hover:border-emerald-200 transition-colors bg-white"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <h4 className="font-semibold text-lg">{type.nombre}</h4>
                    <p className="text-sm text-gray-600">{type.descripcion || "Sin descripción"}</p>
                    <div className="flex flex-wrap gap-4 text-sm mt-2">
                      <div><strong>Cama:</strong> {type.tipoCama}</div>
                      <div><strong>Precio:</strong> <span className="text-emerald-700 font-medium">${type.precio}</span></div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {type.comodidades.length > 0 ? (
                        type.comodidades.map(item => (
                          <span
                            key={item}
                            className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">Sin comodidades especificadas</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(type);
                        setFormData(type);
                        setIsOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(type.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar tipo de habitación" : "Nuevo tipo de habitación"}
            </DialogTitle>
          </DialogHeader>

          <RoomTypeForm
            formData={formData}
            isEditing={!!editing}
            onSubmit={handleSubmit}
            onCancel={() => setIsOpen(false)}
            onChange={handleChange}
            onToggleComodidad={toggleComodidad}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}