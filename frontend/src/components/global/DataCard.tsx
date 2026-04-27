import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { type LucideIcon, ChevronDown } from "lucide-react";


// export type CardBodyData = AgentBodyData | RentalBodyData;

interface DataCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  status?: string | boolean;
  infoLabel?: string | null;
  actions: React.ReactNode; // Handle buttons here
  children: React.ReactNode; // Handle the specific Expanded view here
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
export function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{label}</span>
      <span className="text-xs text-gray-700">{value}</span>
    </div>
  );
}

/** Thin section header inside the expanded panel */
export function Section({ title }: { title: string }) {
  return (
    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold pt-2 pb-1 border-b border-gray-100">
      {title}
    </p>
  );
}

export function fmt(iso: string) {
  // Formats ISO dates/datetimes to a readable string
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export function currency(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(n);
}




// ─── DataCard ────────────────────────────────────────────────────────────────

export default function DataCard({
  title,
  subtitle,
  icon: Icon,
  status,
  infoLabel,
  actions,
  children,
}: DataCardProps) {
  const [open, setOpen] = useState(false);

return (
    <div className={`group border rounded-lg bg-white transition-all overflow-hidden
      ${open ? "border-blue-400 shadow-sm" : "border-gray-200 hover:border-blue-300 hover:shadow-sm"}`}
    >
      <div
        className="flex items-center gap-3 px-3 py-2 cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
      >
        <div className={`shrink-0 p-1.5 rounded-md transition-colors
          ${open ? "bg-blue-50" : "bg-gray-100 group-hover:bg-blue-50"}`}
        >
          <Icon className={`w-4 h-4 transition-colors
            ${open ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate leading-tight">{title}</p>
          <p className="text-xs text-gray-400 truncate leading-tight">{subtitle}</p>
        </div>

        {infoLabel && (
          <span className="hidden sm:block shrink-0 text-xs text-gray-400">{infoLabel}</span>
        )}

        {status !== undefined && <StatusBadge status={status} />}

        {/* Actions Slot: Logic is handled by the parent */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200
            ${open ? "rotate-180 text-blue-500" : ""}`}
        />
        <div className="shrink-0 flex gap-1 opacity-100 transition-opacity">
          {actions}
        </div>
      </div>

      <div className={`transition-all duration-200 ease-in-out overflow-hidden
        ${open ? "max-h-125 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="border-t border-gray-100 bg-gray-50/60">
          {children}
        </div>
      </div>
    </div>
  );
}