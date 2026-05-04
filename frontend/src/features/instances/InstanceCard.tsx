import DataCard, { currency, Field, fmt, OverflowMenu, Section } from "@/components/global/DataCard";
import { Edit2, FileText, RefreshCw, Trash2 } from "lucide-react";

interface InstanceCardProps {
  instance: InstanceBodyData;
  address: string;
  agentName: string;
  status: string;
  onEdit: (rental: InstanceBodyData) => void;
  onSetStatus: (rental: InstanceBodyData) => void;
  onDelete: (rental: InstanceBodyData) => void;
}

export interface InstanceBodyData {
  id: string;
  rentalId: string;
  // Collapsed preview
  actualPaymentDate: string;
  billingPeriod: string;
  // Expanded: commission
  baseRent: number;
  rentalCommissionPercent: number;
  officeSplit: number;
  agentSplit: number;
  agentPaye: number;
  // Expanded: financials
  totalAmountPaid: number;
  landlordPayAmount: number;
  baseComm: number;
  vat: number;
  commExclVat: number;
  companyComm: number;
  agentGrossComm: number;
  payeAmount: number;
  agentNettComm: number;
  // Expanded: once off
  deposit: number;
  leaseFee: number;
  leaseFeeAgentPortion: number;
  leaseFeeOfficePortion: number;

  // Expanded: logging
  status: string;
  createdBy: string;
  createdAt: string; // LocalDateTime (ISO format)
  lastModifiedBy: string; // LocalDateTime (ISO format)
  lastModifiedAt: string; // LocalDateTime (ISO format)
}

function InstanceExpanded({ data }: { data: InstanceBodyData }) {
  return (
    <div className="px-3 pb-3 space-y-2">
      <Section title="BILLING INFO" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <Field label="Payment Date" value={fmt(data.actualPaymentDate)} />
        <Field label="Billing Period" value={data.billingPeriod} />
      </div>

      <Section title="COMMISSION" />
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        <Field label="Base Rent" value={currency(data.baseRent)} />
        <Field
          label="Commission %"
          value={`${data.rentalCommissionPercent * 100}%`}
        />
        <Field label="Office Split" value={`${data.officeSplit * 100}%`} />
        <Field label="Agent Split" value={`${data.agentSplit * 100}%`} />
        <Field label="Agent PAYE" value={`${data.agentPaye * 100}%`} />
      </div>

      <Section title="FINANCIALS" />
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        <Field label="Total Paid" value={currency(data.totalAmountPaid)} />
        <Field label="Landlord Pay" value={currency(data.landlordPayAmount)} />
        <Field label="Base Commission" value={currency(data.baseComm)} />
        <Field label="VAT" value={currency(data.vat)} />
        <Field label="Commission Excl VAT" value={currency(data.commExclVat)} />
        <Field label="Company Comm" value={currency(data.companyComm)} />
        <Field label="Agent Gross" value={currency(data.agentGrossComm)} />
        <Field label="PAYE Amount" value={currency(data.payeAmount)} />
        <Field label="Agent Nett" value={currency(data.agentNettComm)} />
      </div>

      <Section title="ONCE OFF" />
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        <Field label="Deposit" value={currency(data.deposit)} />
        <Field label="Lease Fee" value={currency(data.leaseFee)} />
        <Field
          label="Agent Portion"
          value={currency(data.leaseFeeAgentPortion)}
        />
        <Field
          label="Office Portion"
          value={currency(data.leaseFeeOfficePortion)}
        />
      </div>

      <Section title="LOG" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <Field label="Created" value={data.createdBy} />
        <Field label="Created" value={fmt(data.createdAt)} />
        <Field label="Updated" value={data.lastModifiedBy} />
        <Field label="Updated" value={fmt(data.lastModifiedAt)} />
      </div>
    </div>
  );
}

export function InstanceCard({ instance, address, agentName, status, onEdit, onSetStatus, onDelete }: InstanceCardProps) {

  const instanceStatusMap: Record<string, { label: string; color: string }> = {
    APPROVED:  { label: "Approved",  color: "bg-green-600 hover:bg-green-600" },
    DRAFT:     { label: "Draft",     color: "bg-orange-500 hover:bg-orange-500" },
    CANCELLED: { label: "Cancelled", color: "bg-red-600 hover:bg-red-600" },
  };

  const currentStatus = instanceStatusMap[status] || {
    label: status,
    color: "bg-gray-400",
  };

  const actions = (
    <OverflowMenu>
      {/* Edit */}
      <div
        className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 rounded-sm"
        onClick={(e) => { e.stopPropagation(); onEdit(instance); }}
      >
        <Edit2 className="mr-2 h-3.5 w-3.5 text-gray-400" />
        <span>Edit</span>
      </div>

      {/* Set Status */}
      <div
        className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 rounded-sm"
        onClick={(e) => { e.stopPropagation(); onSetStatus(instance); }}
      >
        <RefreshCw className="mr-2 h-3.5 w-3.5 text-gray-400" />
        <span>Set Status</span>
      </div>

      {/* Delete */}
      <div
        className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-red-50 hover:text-red-600 text-red-500 rounded-sm border-t border-gray-100 mt-1"
        onClick={(e) => {
          e.stopPropagation();
          if (confirm("Are you sure you want to delete this instance?")) {
            onDelete(instance);
          }
        }}
      >
        <Trash2 className="mr-2 h-3.5 w-3.5" />
        <span className="font-medium">Delete</span>
      </div>
    </OverflowMenu>
  );

  return (
    <DataCard
      title={address}
      subtitle={agentName}
      icon={FileText}
      status={{
        label: currentStatus.label,
        colorClassName: currentStatus.color,
      }}
      infoLabel={instance.actualPaymentDate ? fmt(instance.actualPaymentDate) : "No Date"}
      actions={actions}
    >
      <InstanceExpanded data={instance} />
    </DataCard>
  );
}