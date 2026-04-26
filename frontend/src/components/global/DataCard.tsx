import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type LucideIcon, Edit2, Trash2, ChevronDown } from "lucide-react";

// ─── Agent types ────────────────────────────────────────────────────────────

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

// ─── Rental types ────────────────────────────────────────────────────────────

export interface RentalBodyData {
  kind: "rental";
  // Collapsed preview
  startDate: string;
  // Expanded: tenant
  tenantName: string;
  endDate: string;
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

export type CardBodyData = AgentBodyData | RentalBodyData;

// ─── Props ───────────────────────────────────────────────────────────────────

interface DataCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  status?: string | boolean;
  body?: CardBodyData;
  onEdit?: () => void;
  onDelete?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string | boolean }) {
  if (typeof status === "boolean") {
    return (
      <Badge
        variant={status ? "default" : "secondary"}
        className={`text-[10px] px-1.5 py-0 h-4 shrink-0 ${status ? "bg-green-600 hover:bg-green-600" : ""}`}
      >
        {status ? "Active" : "Inactive"}
      </Badge>
    );
  }
  const colours: Record<string, string> = {
    ACTIVE:    "bg-green-600 hover:bg-green-600",
    CANCELLED: "bg-red-600 hover:bg-red-600",
    COMPLETED: "bg-blue-600 hover:bg-blue-600",
  };
  return (
    <Badge className={`text-[10px] px-1.5 py-0 h-4 shrink-0 ${colours[status] || ""}`}>
      {status}
    </Badge>
  );
}

/** A labelled key–value pair used throughout the expanded panels */
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{label}</span>
      <span className="text-xs text-gray-700">{value}</span>
    </div>
  );
}

/** Thin section header inside the expanded panel */
function Section({ title }: { title: string }) {
  return (
    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold pt-2 pb-1 border-b border-gray-100">
      {title}
    </p>
  );
}

function fmt(iso: string) {
  // Formats ISO dates/datetimes to a readable string
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function currency(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(n);
}

// ─── Expanded panels ─────────────────────────────────────────────────────────

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

function RentalExpanded({ data }: { data: RentalBodyData }) {
  return (
    <div className="px-3 pb-3 space-y-2">
      <Section title="Tenant" />
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        <Field label="Tenant"     value={data.tenantName} />
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
        <Field label="Commission %"    value={`${data.rentalCommissionPercent}%`} />
        <Field label="Office Split"    value={`${data.officeSplit}%`} />
        <Field label="Agent Split"     value={`${data.agentSplit}%`} />
        <Field label="Agent PAYE"      value={currency(data.agentPaye)} />
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

// ─── DataCard ────────────────────────────────────────────────────────────────

export default function DataCard({
  title,
  subtitle,
  icon: Icon,
  status,
  body,
  onEdit,
  onDelete,
}: DataCardProps) {
  const [open, setOpen] = useState(false);

  // The single line of "info" shown in the collapsed row
  const infoLabel = body?.kind === "agent"
    ? body.totalRentals !== undefined ? `${body.totalRentals} rentals` : null
    : body?.kind === "rental"
    ? `From ${fmt(body.startDate)}`
    : null;

  return (
    <div className={`group border rounded-lg bg-white transition-all overflow-hidden
      ${open ? "border-blue-400 shadow-sm" : "border-gray-200 hover:border-blue-300 hover:shadow-sm"}`}
    >
      {/* ── Collapsed row ── */}
      <div
        className="flex items-center gap-3 px-3 py-2 cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Icon */}
        <div className={`shrink-0 p-1.5 rounded-md transition-colors
          ${open ? "bg-blue-50" : "bg-gray-100 group-hover:bg-blue-50"}`}
        >
          <Icon className={`w-4 h-4 transition-colors
            ${open ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
          />
        </div>

        {/* Title + subtitle */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate leading-tight">{title}</p>
          <p className="text-xs text-gray-400 truncate leading-tight">{subtitle}</p>
        </div>

        {/* Info chip */}
        {infoLabel && (
          <span className="hidden sm:block shrink-0 text-xs text-gray-400">{infoLabel}</span>
        )}

        {/* Status badge */}
        {status !== undefined && <StatusBadge status={status} />}

        {/* Edit / Delete — visible on row hover */}
        <div className="shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost" size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
          >
            <Edit2 className="w-3 h-3 text-gray-400" />
          </Button>
          <Button
            variant="ghost" size="sm"
            className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-500"
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200
            ${open ? "rotate-180 text-blue-500" : ""}`}
        />
      </div>

      {/* ── Expanded panel ── */}
      <div className={`transition-all duration-200 ease-in-out overflow-hidden
        ${open ? "max-h-150 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="border-t border-gray-100 bg-gray-50/60">
          {body?.kind === "agent"  && <AgentExpanded  data={body} />}
          {body?.kind === "rental" && <RentalExpanded data={body} />}
          {!body && (
            <p className="px-3 py-2 text-xs text-gray-400 italic">No additional details.</p>
          )}
        </div>
      </div>
    </div>
  );
}