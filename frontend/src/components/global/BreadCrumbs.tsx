import { useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ current }: { current?: string }) {
  const location = useLocation();
  const { agentName, rentalAddress } = location.state || {};

  return (
    <nav className="flex items-center space-x-2 text-[12px] text-muted-foreground uppercase tracking-wide">
      {agentName && (
        <>
          <span className="font-medium text-gray-700">{agentName}</span>
          <ChevronRight size={16} />
        </>
      )}
      
      {rentalAddress && (
        <>
          <span className="font-medium text-gray-700">{rentalAddress}</span>
          <ChevronRight size={16} />
        </>
      )}

      {current && (
        <span className="font-bold text-primary">{current}</span>
      )}
    </nav>
  );
}