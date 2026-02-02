import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { HospitalityService } from "@/types/hospitality.types";
import { useHospitalityForm } from "@/hooks/useHospitalityForm";
import { HospitalityStats } from "./HospitalityStats";
import { HospitalityTable } from "./HospitalityTable";
import { HospitalityForm } from "./HospitalityForm";
import { RoomTypesSection } from "./rooms/RoomTypesSection";

interface HospitalityRegistryProps {
  onBack: () => void;
}

export function HospitalityRegistry({ onBack }: HospitalityRegistryProps) {
  const [services, setServices] = useState<HospitalityService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    formData,
    editingService,
    resetForm,
    loadServiceForEdit,
    updateFormField,
    updateDireccionField,
    updateRedesSocialesField,
    toggleServicio,
  } = useHospitalityForm();

  const handleOpenModal = (service?: HospitalityService) => {
    if (service) {
      loadServiceForEdit(service);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar cédula jurídica única
    const cedulaExists = services.some(
      (s) =>
        s.cedulaJuridica === formData.cedulaJuridica &&
        s.id !== editingService?.id
    );

    if (cedulaExists) {
      toast.error("La cédula jurídica ya está registrada");
      return;
    }

    if (editingService) {
      // Editar servicio existente
      setServices(
        services.map((s) =>
          s.id === editingService.id
            ? { ...(formData as HospitalityService), id: s.id }
            : s
        )
      );
      toast.success("Servicio actualizado exitosamente");
    } else {
      // Crear nuevo servicio
      const newService: HospitalityService = {
        ...(formData as HospitalityService),
        id: Date.now().toString(),
      };
      setServices([...services, newService]);
      toast.success("Servicio registrado exitosamente");
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    const service = services.find((s) => s.id === id);
    if (
      confirm(
        `¿Está seguro de eliminar el servicio "${service?.nombreHotel}"?`
      )
    ) {
      setServices(services.filter((s) => s.id !== id));
      toast.success("Servicio eliminado exitosamente");
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.nombreHotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.cedulaJuridica.includes(searchTerm) ||
      service.tipoHospedaje.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 hover:bg-emerald-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl mb-2">
                Registro de Servicios de Hospedaje
              </h1>
              <p className="text-gray-600">
                Gestiona los establecimientos registrados en Limón, Costa Rica
              </p>
            </div>
            <Button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Registrar Servicio
            </Button>
          </div>
        </div>

        {/* Stats */}
        <HospitalityStats services={services} />

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Servicios Registrados</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, cédula o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredServices.length === 0 && searchTerm ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No se encontraron servicios</p>
              </div>
            ) : (
              <HospitalityTable
                services={filteredServices}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                onAddNew={() => handleOpenModal()}
              />
            )}
          </CardContent>
        </Card>
      </div>
            
      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Editar" : "Registrar"} Servicio de Hospedaje
            </DialogTitle>
            <DialogDescription>
              Complete la información del establecimiento en Limón, Costa Rica
            </DialogDescription>
          </DialogHeader>

          <HospitalityForm
            formData={formData}
            isEditing={!!editingService}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            onUpdateField={updateFormField}
            onUpdateDireccion={updateDireccionField}
            onUpdateRedesSociales={updateRedesSocialesField}
            onToggleServicio={toggleServicio}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
