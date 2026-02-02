import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";  // Nota: ajusta esta importación si es inconsistente (debería ser "@/components/ui/card")
import {
  Plus,
  Home,
  LogOut,
  Building2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Property, PropertyFormData } from "@/types/business.types";
import { DashboardStats } from "@/components/business/DashboardStats";
import { PropertyCard } from "@/components/business/PropertyCard";
import { PropertyForm } from "@/components/business/PropertyForm";
import type { UserType } from "@/types/user.types";  // Importa el tipo compartido

interface BusinessDashboardProps {
  userType: UserType;  // Agregado: ahora acepta userType
  onLogout: () => void;
  onOpenRegistry: () => void;
}

export function BusinessDashboard({
  userType,
  onLogout,
  onOpenRegistry,
}: BusinessDashboardProps) {

  const [properties, setProperties] = useState<Property[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    location: "",
    price: "",
    guests: "",
    beds: "",
    type: "",
    description: "",
    imageUrl: "",
  });

  const handleFormChange = (
    field: keyof PropertyFormData,
    value: string
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProperty: Property = {
      id: Date.now(),
      title: formData.title,
      location: formData.location,
      price: parseFloat(formData.price),
      guests: parseInt(formData.guests),
      beds: parseInt(formData.beds),
      type: formData.type,
      description: formData.description,
      imageUrl:
        formData.imageUrl ||
        "https://images.unsplash.com/photo-1662638852986-fdea10dd4f52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJ1bmdhbG93fGVufDF8fHx8MTc2Nzg1ODMzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    };
    setProperties([...properties, newProperty]);
    setIsAddModalOpen(false);
    setFormData({
      title: "",
      location: "",
      price: "",
      guests: "",
      beds: "",
      type: "",
      description: "",
      imageUrl: "",
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta propiedad?")) {
      setProperties(properties.filter((p) => p.id !== id));
    }
  };

  const handleEdit = (property: Property) => {
    // Funcionalidad de edición se puede implementar después
    console.log("Editar propiedad:", property);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl mb-2">Panel de Empresa</h1>
            <p className="text-gray-600">
              Gestiona tus propiedades y reservas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onOpenRegistry}
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Registro de empresas
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Propiedad
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Stats */}
        <DashboardStats propertiesCount={properties.length} />

        {/* Properties List */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Propiedades</CardTitle>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <div className="text-center py-12">
                <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Aún no has agregado ninguna propiedad
                </p>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  variant="outline"
                >
                  Agregar Primera Propiedad
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Property Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Nueva Propiedad</DialogTitle>
            <DialogDescription>
              Completa la información de tu propiedad en Limón
            </DialogDescription>
          </DialogHeader>

          <PropertyForm
            formData={formData}
            onSubmit={handleSubmit}
            onChange={handleFormChange}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
