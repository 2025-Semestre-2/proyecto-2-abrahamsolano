import { Button } from "@/components/ui/button";
import { Edit, Trash2, User, Mail, Phone } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/types/client.types";

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export function ClientTable({
  clients,
  onEdit,
  onDelete,
  onAddNew,
}: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">Aún no hay clientes registrados</p>
        <Button onClick={onAddNew} variant="outline">
          Registrar Primer Cliente
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">
                {client.nombre} {client.apellidos}
              </TableCell>
              <TableCell>{client.documentoIdentidad}</TableCell>
              <TableCell>
                <div className="flex flex-col text-sm">
                  {client.telefono1 && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {client.telefono1}
                    </div>
                  )}
                  {client.telefono2 && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {client.telefono2}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>
                <Badge variant={client.activo ? "default" : "secondary"}>
                  {client.activo ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(client)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(client.id)}
                    disabled={!client.activo} // Evitar eliminar activos por ahora
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}