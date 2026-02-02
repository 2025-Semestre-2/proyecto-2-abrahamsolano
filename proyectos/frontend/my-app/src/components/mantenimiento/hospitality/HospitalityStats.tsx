import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { HospitalityService } from "@/types/hospitality.types";

interface HospitalityStatsProps {
  services: HospitalityService[];
}

export function HospitalityStats({ services }: HospitalityStatsProps) {
  const hotelesCount = services.filter((s) => s.tipoHospedaje === "Hotel").length;
  const cabanasCount = services.filter((s) => s.tipoHospedaje === "Cabaña").length;
  const otrosCount = services.filter(
    (s) => s.tipoHospedaje !== "Hotel" && s.tipoHospedaje !== "Cabaña"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm text-gray-600">
            Total Servicios
          </CardTitle>
          <Building2 className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl">{services.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm text-gray-600">Hoteles</CardTitle>
          <Building2 className="h-4 w-4 text-teal-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl">{hotelesCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm text-gray-600">Cabañas</CardTitle>
          <Building2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl">{cabanasCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm text-gray-600">Otros</CardTitle>
          <Building2 className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl">{otrosCount}</div>
        </CardContent>
      </Card>
    </div>
  );
}
