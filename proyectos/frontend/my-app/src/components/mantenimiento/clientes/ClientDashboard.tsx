import { ClientRegistry } from "./ClientRegistry";

interface ClientDashboardProps {
  onBack: () => void;
}

export function ClientDashboard({ onBack }: ClientDashboardProps) {
  return (
    <ClientRegistry onBack={onBack} />
  );
}