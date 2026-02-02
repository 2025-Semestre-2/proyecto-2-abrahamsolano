import { HospitalityRegistry } from "./HospitalityRegistry"; // Importa local

export function HospitalityDashboard({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <HospitalityRegistry onBack={onBack} />
        {/* Placeholder para Reports (Proyecto 2) */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Reportes</h2>
          <ul className="list-disc pl-5">
            <li>Reporte de facturación por día/mes/año (pendiente implementar).</li>
            <li>Reporte por tipo de habitación y reservas.</li>
            <li>Rango de edades de clientes.</li>
            <li>Hoteles de mayor demanda.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}