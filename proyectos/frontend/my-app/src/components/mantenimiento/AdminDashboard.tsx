import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientDashboard } from "@/components/mantenimiento/clientes/ClientDashboard";
import { HospitalityDashboard } from "@/components/mantenimiento/hospitality/HospitalityDashboard";

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"clientes" | "hospedajes">("clientes");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cerrar sesión
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Panel de Administración
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "clientes" | "hospedajes")}>
          <TabsList className="mb-8 bg-gray-200/70 backdrop-blur-sm p-1.5 rounded-xl border border-gray-300 w-full max-w-md mx-auto md:mx-0 shadow-sm">
            <TabsTrigger
              value="clientes"
              className="
                flex-1 text-sm font-medium transition-all
                data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md
                data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-300/50
                rounded-lg px-6 py-2.5
              "
            >
              <Users className="h-4 w-4 mr-2" />
              Clientes
            </TabsTrigger>

            <TabsTrigger
              value="hospedajes"
              className="
                flex-1 text-sm font-medium transition-all
                data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md
                data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-300/50
                rounded-lg px-6 py-2.5
              "
            >
              <Building2 className="h-4 w-4 mr-2" />
              Servicios de Hospedaje
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clientes" className="mt-2 focus:outline-none">
            <ClientDashboard onBack={() => {}} />
          </TabsContent>

          <TabsContent value="hospedajes" className="mt-2 focus:outline-none">
            <HospitalityDashboard onBack={() => {}} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}