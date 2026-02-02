import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Search, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Client } from "@/types/client.types";
import { ClientStats } from "./ClientStats";
import { ClientTable } from "./ClientTable";
import { ClientForm } from "./ClientForm";

interface ClientRegistryProps {
  onBack: () => void;
}

export function ClientRegistry({ onBack }: ClientRegistryProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const initialForm: Partial<Client> = {
    activo: true,
    fechaRegistro: new Date().toISOString().split("T")[0],
  };

  const [formData, setFormData] = useState<Partial<Client>>(initialForm);

  const updateField = <K extends keyof Client>(field: K, value: Client[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setFormData(initialForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!formData.nombre || !formData.apellidos || !formData.documentoIdentidad || !formData.email) {
      toast.error("Faltan campos obligatorios");
      return;
    }

    // Validar unicidad de documento y email
    const documentoExists = clients.some(
      (c) => c.documentoIdentidad === formData.documentoIdentidad && c.id !== editingClient?.id
    );
    const emailExists = clients.some(
      (c) => c.email === formData.email && c.id !== editingClient?.id
    );

    if (documentoExists) {
      toast.error("Ya existe un cliente con ese documento de identidad");
      return;
    }
    if (emailExists) {
      toast.error("Ya existe un cliente con ese correo electrónico");
      return;
    }

    if (editingClient) {
      // Editar
      setClients((prev) =>
        prev.map((c) =>
          c.id === editingClient.id ? { ...c, ...formData } : c
        )
      );
      toast.success("Cliente actualizado correctamente");
    } else {
      // Crear nuevo
      const newClient: Client = {
        ...formData,
        id: formData.email!, // Usamos email como ID por simplicidad
        fechaRegistro: new Date().toISOString(),
        activo: true,
      } as Client;

      setClients((prev) => [...prev, newClient]);
      toast.success("Cliente registrado correctamente");
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    // En producción: verificar si tiene reservas activas
    if (confirm("¿Realmente deseas eliminar este cliente? Esta acción no se puede deshacer.")) {
      setClients((prev) => prev.filter((c) => c.id !== id));
      toast.success("Cliente eliminado");
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.documentoIdentidad.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>

        <ClientStats clients={clients} />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Clientes</CardTitle>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, email o documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredClients.length === 0 && searchTerm ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No se encontraron clientes</p>
              </div>
            ) : (
              <ClientTable
                clients={filteredClients}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                onAddNew={() => handleOpenModal()}
              />
            )}
          </CardContent>
        </Card>

        {/* Modal de creación/edición */}
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? "Editar Cliente" : "Registrar Nuevo Cliente"}
              </DialogTitle>
              <DialogDescription>
                Complete la información del cliente
              </DialogDescription>
            </DialogHeader>

            <ClientForm
              client={formData}
              isEditing={!!editingClient}
              onSubmit={handleSubmit}
              onCancel={handleCloseModal}
              onChange={updateField}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}