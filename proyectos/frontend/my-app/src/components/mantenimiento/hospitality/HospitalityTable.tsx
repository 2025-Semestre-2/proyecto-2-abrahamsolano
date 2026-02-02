import { Button } from "@/components/ui/button";
import { Building2, Edit, Trash2, Phone, Mail } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HospitalityService } from "@/types/hospitality.types";

interface HospitalityTableProps {
  services: HospitalityService[];
  onEdit: (service: HospitalityService) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export function HospitalityTable({
  services,
  onEdit,
  onDelete,
  onAddNew,
}: HospitalityTableProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">Aún no hay servicios registrados</p>
        <Button onClick={onAddNew} variant="outline">
          Registrar Primer Servicio
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
            <TableHead>Cédula Jurídica</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Servicios</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">
                {service.nombreHotel}
              </TableCell>
              <TableCell>{service.cedulaJuridica}</TableCell>
              <TableCell>
                <Badge variant="outline">{service.tipoHospedaje}</Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {service.direccion.provincia}, {service.direccion.canton}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {service.telefono1}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {service.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-600">
                  {service.servicios.length} servicio
                  {service.servicios.length !== 1 ? "s" : ""}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(service.id)}
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
