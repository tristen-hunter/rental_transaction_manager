import { User, Edit2, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataCard, { Field, fmt, Section } from "@/components/global/DataCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";


interface AgentCardProps {
  agent: AgentBodyData;
  name: string;
  email: string;
  isActive: boolean;
  onEdit: (agent: AgentBodyData) => void;
  onDeactivate: (agent: AgentBodyData) => void;
}

export interface AgentBodyData {
  kind: "agent";
  // Collapsed preview
  totalRentals?: number;
  // Expanded: banking
  bankName: string;
  accountNumber: string;
  branchCode: string;
  // Expanded: logging
  createdAt: string;
  updatedAt: string;
}

function AgentExpanded({ data }: { data: AgentBodyData }) {
  return (
    <div className="px-3 pb-3 space-y-2">
      <Section title="Banking Details" />
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        <Field label="Bank"           value={data.bankName} />
        <Field label="Account No."    value={data.accountNumber} />
        <Field label="Branch Code"    value={data.branchCode} />
      </div>

      <Section title="Log" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <Field label="Created"  value={fmt(data.createdAt)} />
        <Field label="Updated"  value={fmt(data.updatedAt)} />
      </div>
    </div>
  );
}

function OverflowMenu({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AgentCard({ agent, name, email, isActive, onEdit, onDeactivate }: AgentCardProps) {
  
  const canDeactivate = (agent.totalRentals ?? 0) === 0;

  const actions = (
    <OverflowMenu>
      {/* Edit Action */}
      <div 
        className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 rounded-sm"
        onClick={(e) => { e.stopPropagation(); onEdit(agent); }}
      >
        <Edit2 className="mr-2 h-3.5 w-3.5 text-gray-400" />
        <span>Edit Agent</span>
      </div>

      {/* Deactivate Action */}
      <button
        disabled={!canDeactivate}
        className={`w-full flex items-center px-2 py-1.5 text-sm rounded-sm transition-colors
          ${canDeactivate 
            ? "cursor-pointer hover:bg-orange-50 hover:text-orange-600 text-gray-700" 
            : "opacity-50 cursor-not-allowed text-gray-400"}`}
        title={canDeactivate ? "" : "Cannot deactivate: Agent has active rentals"}
        onClick={(e) => { 
          if (canDeactivate) {
            e.stopPropagation(); 
            onDeactivate(agent); 
          }
        }}
      >
        <PowerOff className="mr-2 h-3.5 w-3.5" />
        <span>Deactivate</span>
      </button>
    </OverflowMenu>
  );

  return (
    <DataCard
      title={name}
      subtitle={email}
      icon={User}
      status={isActive}
      infoLabel={agent.totalRentals !== undefined ? `${agent.totalRentals} rentals` : null}
      actions={actions}
    >
      <AgentExpanded data={agent} />
    </DataCard>
  );
}