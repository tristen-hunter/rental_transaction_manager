import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { type LucideIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";


interface DataCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  onTitleClick?: () => void;
  status?: {
    label: string;
    colorClassName: string;
  };
  infoLabel?: string | null;
  actions: React.ReactNode; // Handle buttons here
  children: React.ReactNode; // Handle the specific Expanded view here
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusBadge({ label, colorClassName }: { label: string; colorClassName: string }) {
  return (
    <Badge className={`text-[10px] px-1.5 py-0 h-4 shrink-0 ${colorClassName}`}>
      {label}
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

export function OverflowMenu({ children }: { children: React.ReactNode }) {
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


// ─── DataCard ────────────────────────────────────────────────────────────────

export default function DataCard({
  title,
  subtitle,
  icon: Icon,
  onTitleClick,
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
          {/* Inner wrapper that only spans the width of the text */}
          <div 
            className="w-fit cursor-pointer group/title"
            onClick={(e) => {
              if (onTitleClick) {
                e.stopPropagation();
                onTitleClick();
              }
            }}
          >
            <p className={`text-sm font-semibold text-gray-800 truncate leading-tight transition-all duration-200
              group-hover/title:text-blue-800 
              hover:underline decoration-blue-400
              group-hover/title:[text-shadow:0_0_8px_rgba(30,64,175,0.3)]`}
            >
              {title}
            </p>
            <p className="text-xs text-gray-400 truncate leading-tight">
              {subtitle}
            </p>
          </div>
        </div>

        {infoLabel && (
          <span className="hidden sm:block shrink-0 text-xs text-gray-400">{infoLabel}</span>
        )}

        {status && (
          <StatusBadge 
            label={status.label} 
            colorClassName={status.colorClassName} 
          />
        )}

        {/* Actions Slot: Logic is handled by the parent */}
        <div className="shrink-0 flex gap-1 opacity-100 transition-opacity">
          {actions}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200
            ${open ? "rotate-180 text-blue-500" : ""}`}
        />
      </div>

      <div className={`transition-all duration-300 ease-in-out overflow-hidden
        ${open ? "max-h-250 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="border-t border-gray-100 bg-gray-50/60">
          {children}
        </div>
      </div>
    </div>
  );
}