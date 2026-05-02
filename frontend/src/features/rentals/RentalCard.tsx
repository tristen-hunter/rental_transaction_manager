import DataCard, { currency, Field, fmt, OverflowMenu, Section } from "@/components/global/DataCard";
import { Home, Edit2, PlusSquare, RefreshCw, Trash2 } from "lucide-react";
import type { RentalStatus } from "./rental";


interface RentalCardProps {
  rental: RentalBodyData;
  address: string;
  agentName: string;
  status: string;
  onEdit: (rental: RentalBodyData) => void;
  onSetStatus: (rental: RentalBodyData) => void;
  onCreateInstance: (rental: RentalBodyData) => void;
  onDelete: (rentalId: string) => void;
  onTitleClick: (agent: RentalBodyData) => void;
}

export interface RentalBodyData {
  // kind: "rental";
  id: string;
  agentId: string;
  agentName: string;
  address: string;
  paymentDate: string;
  // Collapsed preview
  startDate: string;
  // Expanded: tenant
  tenantName: string;
  endDate: string;
  autoRenew: boolean;
  status: RentalStatus;
  // Expanded: landlord
  landlordName: string;
  landlordBankName: string;
  landlordAccNo: string;
  landlordBranch: string;
  // Expanded: commission
  baseRent: number;
  rentalCommissionPercent: number;
  officeSplit: number;
  agentSplit: number;
  agentPaye: number;
  vatRegistered: boolean;
  // Expanded: logging
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

function RentalExpanded({ data }: { data: RentalBodyData }) {
  return (
    <div className="px-3 pb-3 space-y-2">
      <Section title="TENANT INFO" />
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        <Field label="name"       value={data.tenantName} />
        <Field label="Start Date" value={fmt(data.startDate)} />
        <Field label="End Date"   value={fmt(data.endDate)} />
      </div>

      <Section title="Landlord" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <Field label="Name"        value={data.landlordName} />
        <Field label="Bank"        value={data.landlordBankName} />
        <Field label="Account No." value={data.landlordAccNo} />
        <Field label="Branch"      value={data.landlordBranch} />
      </div>

      <Section title="Commission Breakdown" />
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        <Field label="Base Rent"       value={currency(data.baseRent)} />
        <Field label="Commission %"    value={`${data.rentalCommissionPercent*100}%`} />
        <Field label="Office Split"    value={`${data.officeSplit*100}%`} />
        <Field label="Agent Split"     value={`${data.agentSplit*100}%`} />
        <Field label="Agent PAYE"      value={`${data.agentPaye*100}%`} />
        <Field label="VAT Registered"  value={data.vatRegistered ? "Yes" : "No"} />
      </div>

      <Section title="Log" />
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        <Field label="Created By" value={data.createdBy} />
        <Field label="Created"    value={fmt(data.createdAt)} />
        <Field label="Updated"    value={fmt(data.updatedAt)} />
      </div>
    </div>
  );
}

export function RentalCard({
  rental, 
  address, 
  agentName, 
  status, 
  onEdit, 
  onSetStatus, 
  onCreateInstance, 
  onDelete,
  onTitleClick
}: RentalCardProps){

  const rentalStatusMap: Record<string, { label: string; color: string }> = {
    ACTIVE:    { label: "Active",    color: "bg-green-600 hover:bg-green-600" },
    CANCELLED: { label: "Cancelled", color: "bg-red-600 hover:bg-red-600" },
    COMPLETED: { label: "Completed", color: "bg-primary hover:bg-primary" },
  };

  const currentStatus = rentalStatusMap[status] || { 
    label: status, 
    color: "bg-gray-400" 
  };

  const actions = (
    <OverflowMenu>
      {/* Edit - Keep Logs */}
      <div 
        className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 rounded-sm"
        onClick={(e) => { e.stopPropagation(); onEdit(rental); }}
      >
        <Edit2 className="mr-2 h-3.5 w-3.5 text-gray-400" />
        <span>Edit Rental</span>
      </div>

      {/* Add Instance - Creates DRAFT */}
      <div 
        className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 rounded-sm"
        onClick={(e) => { 
          e.stopPropagation(); 
          onCreateInstance(rental); 
        }}
      >
        <PlusSquare className="mr-2 h-3.5 w-3.5 text-gray-400" />
        <span>Add Instance (Draft)</span>
      </div>

      {/* Set Status - Cycles statuses */}
      <div 
        className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 rounded-sm"
        onClick={(e) => { e.stopPropagation(); onSetStatus(rental); }}
      >
        <RefreshCw className="mr-2 h-3.5 w-3.5 text-gray-400" />
        <span>Set Status</span>
      </div>

      {/* Delete - Cascade.ALL Logic */}
      <div 
        className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-red-50 hover:text-red-600 text-red-500 rounded-sm border-t border-gray-100 mt-1"
        title="Warning: This will delete all children and instances (Cascade Delete)"
        onClick={(e) => { 
          e.stopPropagation(); 
          if (confirm("Are you sure? This will delete all associated instances and children.")) {
            onDelete(rental.id);
          }
        }}
      >
        <Trash2 className="mr-2 h-3.5 w-3.5" />
        <span className="font-medium">Delete Everything</span>
      </div>
    </OverflowMenu>
  );

  return(
    <DataCard
      title={address}
      subtitle={agentName}
      icon={Home}
      onTitleClick={() => onTitleClick(rental)}
      status={{
        label: currentStatus.label,
        colorClassName: currentStatus.color
      }}
      infoLabel={rental.startDate ? fmt(rental.startDate) : "No Date"}
      actions={actions}
    >
      <RentalExpanded data={rental} />
    </DataCard>
  )
}