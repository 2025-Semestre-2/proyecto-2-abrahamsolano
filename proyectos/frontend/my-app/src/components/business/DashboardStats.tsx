import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, DollarSign } from "lucide-react";

interface DashboardStatsProps {
  propertiesCount: number;
}

export function DashboardStats({ propertiesCount }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm text-gray-600">
            Propiedades Activas
          </CardTitle>
          <Home className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl">{propertiesCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm text-gray-600">
            Reservas Este Mes
          </CardTitle>
          <DollarSign className="h-4 w-4 text-teal-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl">0</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm text-gray-600">
            Ingresos Estimados
          </CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl">$0</div>
        </CardContent>
      </Card>
    </div>
  );
}
