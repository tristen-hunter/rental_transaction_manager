import { useState } from "react"
import { X, Calendar, Percent, Calculator, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import type { RentalReturnDto } from "../rentals/rental"
import type { InstanceBodyData } from "./InstanceCard"
import type { InstanceUpdateDto } from "./InstanceUpdateDto"
import { BILLING_PERIODS, STATUS_OPTIONS } from "@/components/common/CommonLists"

type Props = {
    instance: InstanceBodyData
    rental?: RentalReturnDto
    onClose: () => void
    onSuccess: (instanceId: string, data: InstanceUpdateDto) => Promise<void> | void
}

/** <------------- HELPER FUNCTIONS -------------------------------------------------- */

const PercentInput = ({
    label,
    field,
    value,
    onChange,
}: {
    label: string
    field: keyof InstanceUpdateDto
    value: number
    onChange: (field: keyof InstanceUpdateDto, value: number) => void
}) => {
  const displayValue = value * 100;

  return (
    <div className="space-y-1.5">
        <Label>{label}</Label>
        <div className="relative">
            <Input
                type="number"
                value={displayValue === 0 ? "" : displayValue}
                onChange={(e) => {
                  const rawValue = e.target.value;
                  const numericValue = rawValue === "" ? 0 : Number(rawValue) / 100;
                  onChange(field, numericValue)
                }}
                placeholder="0"
                className="pr-7 no-spinner"
            />
            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">%</span>
        </div>
    </div>
  )
}

const CurrencyInput = ({
    label,
    field,
    value,
    onChange,
}: {
    label: string
    field: keyof InstanceUpdateDto
    value: number
    onChange: (field: keyof InstanceUpdateDto, value: number) => void
}) => (
    <div className="space-y-1.5">
        <Label>{label}</Label>
        <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">R</span>
            <Input
                type="number"
                className="pl-7 no-spinner"
                value={value}
                onChange={(e) => onChange(field, Number(e.target.value))}
                placeholder="0.00"
            />
        </div>
    </div>
)

const ReadOnlyCurrencyDisplay = ({
    label,
    value,
}: {
    label: string;
    value: number;
}) => (
    <div className="space-y-1.5 opacity-85">
      <Label className="text-muted-foreground">{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-2.5 text-gray-400 text-sm">R</span>
        <Input
          type="text"
          className="pl-7 bg-muted border-gray-100 text-foreground font-medium cursor-not-allowed select-none"
          value={value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          disabled
          readOnly
        />
      </div>
    </div>
);

/**
 * Safely converts a decimal currency amount to cents.
 */
// const toCents = (amount: number): number => Math.round(amount * 100);

/**
 * Safely converts cents back to a standard decimal number.
 */
const toDecimals = (cents: number): number => cents / 100;

export function calculateFinancialTotals(inputs: {
  baseRent: number;
  totalAmountPaid: number;
  rentalCommissionPercent: number; // e.g., 0.085 for 8.5%
  officeSplit: number;              // e.g., 0.30 for 30%
  agentPaye: number;                // e.g., 0.25 for 25%
  vatRegistered: boolean;
}) {
  const { 
    baseRent, 
    rentalCommissionPercent, 
    officeSplit, 
    agentPaye, 
    vatRegistered,
  } = inputs;

  // --- STEP 1: Convert base values to cents or direct multipliers ---
  const baseRentCents = Math.round(baseRent * 100);
  const rawCommCents = Math.round(baseRentCents * rentalCommissionPercent);

  // Math perfectly aligns with the backend without needing UI toggles
  const baseCommCents = vatRegistered ? Math.round(rawCommCents * 1.15) : rawCommCents;
  const commExclVatCents = vatRegistered ? rawCommCents : baseCommCents;
  const vatCents = baseCommCents - commExclVatCents;

  // --- STEP 3: Split the Net (Excl VAT) Amount ---
  // Java: agentGrossComm = commExclVat - (commExclVat * officeSplit)
  const officePortionCents = Math.round(commExclVatCents * officeSplit);
  const agentGrossCommCents = commExclVatCents - officePortionCents;
  const companyCommCents = commExclVatCents - agentGrossCommCents;

  // --- STEP 4: Calculate Tax and Net Agent Commission ---
  const payeAmountCents = Math.round(agentGrossCommCents * agentPaye);
  const agentNettCommCents = agentGrossCommCents - payeAmountCents;

  // --- STEP 5: Landlord Pay Amount ---
  // Java: landlordPayAmount = baseRent - baseComm
  const landlordPayAmountCents = baseRentCents - baseCommCents;

  // --- STEP 6: Return the values as safe decimal numbers ---
  return {
    landlordPayAmount: toDecimals(landlordPayAmountCents),
    baseComm: toDecimals(baseCommCents),
    vat: toDecimals(vatCents),
    commExclVat: toDecimals(commExclVatCents),
    companyComm: toDecimals(companyCommCents),
    agentGrossComm: toDecimals(agentGrossCommCents),
    payeAmount: toDecimals(payeAmountCents),
    agentNettComm: toDecimals(agentNettCommCents),
  };
}

/**
 * the Instance Prop is define as the InstanceBodyData of my cards, however it is restructured and sent as an Update DTO.
 */
// --- Main Component ----------------------------------------------------------
const InstanceUpdateForm = ({ instance, rental, onClose, onSuccess }: Props) => {
    const [formData, setFormData] = useState<InstanceUpdateDto>({
        id: instance.id,
        rentalId: instance.rentalId,
        billingPeriod: instance.billingPeriod,
        actualPaymentDate: instance.actualPaymentDate,
        rentalCommissionPercent: instance.rentalCommissionPercent,
        officeSplit: instance.officeSplit,
        agentSplit: instance.agentSplit,
        agentPaye: instance.agentPaye,
        totalAmountPaid: instance.totalAmountPaid,
        baseRent: instance.baseRent,
        vatRegistered: instance.vatRegistered,
        landlordPayAmount: instance.landlordPayAmount,
        baseComm: instance.baseComm,
        vat: instance.vat,
        commExclVat: instance.commExclVat,
        companyComm: instance.companyComm,
        agentGrossComm: instance.agentGrossComm,
        payeAmount: instance.payeAmount,
        agentNettComm: instance.agentNettComm,
        leaseFee: instance.leaseFee,
        leaseFeeAgentPortion: instance.leaseFeeAgentPortion,
        leaseFeeOfficePortion: instance.leaseFeeOfficePortion,
        deposit: instance.deposit,
        status: instance.status
    });

    // Add a local loading state
    const [isSaving, setIsSaving] = useState(false);

    const computedTotals = calculateFinancialTotals({
      baseRent: Number(formData.baseRent || 0),
      totalAmountPaid: Number(formData.totalAmountPaid || 0),
      rentalCommissionPercent: Number(formData.rentalCommissionPercent || 0),
      officeSplit: Number(formData.officeSplit || 0),
      agentPaye: Number(formData.agentPaye || 0),
      vatRegistered: Boolean(formData.vatRegistered)
    });

    const onSaveClick = async () => {
        setIsSaving(true);
        // Merge the latest calculated totals directly into the submitted data
        const finalData: InstanceUpdateDto = {
          ...formData,
          landlordPayAmount: computedTotals.landlordPayAmount,
          baseComm: computedTotals.baseComm,
          vat: computedTotals.vat,
          commExclVat: computedTotals.commExclVat,
          companyComm: computedTotals.companyComm,
          agentGrossComm: computedTotals.agentGrossComm,
          payeAmount: computedTotals.payeAmount,
          agentNettComm: computedTotals.agentNettComm,
        };
        
        await onSuccess(instance.id, finalData);
        // No need to set false here if the component unmounts on success
    };

    /// This is a generic field updater - keeps all changes in one place
    const handleChange = (field: keyof InstanceUpdateDto, value: string | number) => {
        setFormData((prev) => ({...prev, [field]: value}))
    }

    const handleSplitChange = (field: "officeSplit" | "agentSplit", value: number) => {
      // 1. Value arrives as a decimal (e.g., 0.3 for 30%). 
      // Keep it bounded between 0.0 (0%) and 1.0 (100%).
      const boundedValue = Math.min(1, Math.max(0, value));
      
      // 2. The other field gets the remaining percentage
      const remainingValue = parseFloat((1 - boundedValue).toFixed(4)); 
      const otherField = field === "officeSplit" ? "agentSplit" : "officeSplit";

      setFormData((prev) => ({
          ...prev,
          [field]: boundedValue,
          [otherField]: remainingValue,
      }));
    };

    /// Helper components for billing period
    // 1. Extract the current year from the existing billingPeriod, fallback to current year
    const currentYear = formData.billingPeriod 
      ? formData.billingPeriod.split("-")[0] 
      : new Date().getFullYear().toString();

    // 2. Extract the current month value to set as the dropdown's active selection
    const currentMonthValue = formData.billingPeriod
      ? formData.billingPeriod.split("-")[1]
      : String(new Date().getMonth() + 1).padStart(2, "0");

    // 3. Handle changing the month while keeping the year intact
    const handleMonthChange = (monthValue: string) => {
      const formattedDate = `${currentYear}-${monthValue}-01`;
      handleChange("billingPeriod", formattedDate);
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-border">

          {/* ── Header ── */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-muted/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Update Billing Instance</h2>
              <p className="text-sm text-muted-foreground">
                  Period: <span className="font-medium text-gray-700">{formData.billingPeriod}</span>
                  {rental && (
                      <> &mdash; {rental.address}: ({rental?.agentName})</>
                  )}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5" />
            </Button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* 1. Metadata */}
          <FormSection title="Billing Metadata" subtitle="Period and payment tracking" icon={Calendar}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Billing Month</Label>
                <Select
                  value={currentMonthValue}
                  onValueChange={(val) => handleMonthChange(val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {BILLING_PERIODS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Actual Payment Date</Label>
                <Input
                  type="date"
                  value={formData.actualPaymentDate}
                  onChange={(e) => handleChange("actualPaymentDate", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => handleChange("status", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FormSection>

            {/* 2. Input Financials */}
            <FormSection title="Financial Inputs" subtitle="Editable rent, splits and percentages" icon={Percent}>
              <div className="grid grid-cols-2 gap-4">
                <CurrencyInput label="Base Rent" field="baseRent" value={formData.baseRent} onChange={handleChange} />
                <CurrencyInput label="Total Amount Paid" field="totalAmountPaid" value={formData.totalAmountPaid} onChange={handleChange} />
                <PercentInput label="Commission (%)" field="rentalCommissionPercent" value={formData.rentalCommissionPercent} onChange={handleChange} />
                <PercentInput label="Office Split (%)" field="officeSplit" value={formData.officeSplit} onChange={(_, val) => handleSplitChange("officeSplit", val)} />
                <PercentInput label="Agent Split (%)" field="agentSplit" value={formData.agentSplit} onChange={(_, val) => handleSplitChange("agentSplit", val)} />
                <PercentInput label="Agent PAYE (%)" field="agentPaye" value={formData.agentPaye} onChange={handleChange} />
              </div>
            </FormSection>

            {/* 3. Calculated Totals (read-only) */}
            <FormSection 
              title="Calculated Totals (read-only)" 
              subtitle="Derived figures — Automatically updated" 
              icon={Calculator}
            >
              <div className="grid grid-cols-2 gap-4">
                <ReadOnlyCurrencyDisplay 
                  label="Landlord Pay Amount" 
                  value={computedTotals.landlordPayAmount} 
                />
                <ReadOnlyCurrencyDisplay 
                  label="Base Commission" 
                  value={computedTotals.baseComm} 
                />
                <ReadOnlyCurrencyDisplay 
                  label="VAT" 
                  value={computedTotals.vat} 
                />
                <ReadOnlyCurrencyDisplay 
                  label="Commission Excl. VAT" 
                  value={computedTotals.commExclVat} 
                />
                <ReadOnlyCurrencyDisplay 
                  label="Company Commission" 
                  value={computedTotals.companyComm} 
                />
                <ReadOnlyCurrencyDisplay 
                  label="Agent Gross Commission" 
                  value={computedTotals.agentGrossComm} 
                />
                <ReadOnlyCurrencyDisplay 
                  label="PAYE Amount" 
                  value={computedTotals.payeAmount} 
                />
                <ReadOnlyCurrencyDisplay 
                  label="Agent Nett Commission" 
                  value={computedTotals.agentNettComm} 
                />
              </div>
            </FormSection>

            {/* 4. Once-off Fees */}
            <FormSection title="Once-off Amounts" subtitle="Lease fees and deposit" icon={Landmark}>
              <div className="grid grid-cols-2 gap-4">
                <CurrencyInput label="Lease Fee" field="leaseFee" value={formData.leaseFee} onChange={handleChange} />
                <CurrencyInput label="Deposit" field="deposit" value={formData.deposit} onChange={handleChange} />
                <CurrencyInput label="Lease Fee — Agent Portion" field="leaseFeeAgentPortion" value={formData.leaseFeeAgentPortion} onChange={handleChange} />
                <CurrencyInput label="Lease Fee — Office Portion" field="leaseFeeOfficePortion" value={formData.leaseFeeOfficePortion} onChange={handleChange} />
              </div>
            </FormSection>
{/* 
            5. Audit Trail (read-only)
            <FormSection title="Audit Info" subtitle="System timestamps" icon={BadgeDollarSign}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground">Created At</Label>
                  <div className="flex h-10 w-full items-center rounded-md border border-gray-100 bg-muted px-3 text-sm text-muted-foreground">
                    {formData.createdAt ? new Date(formData.createdAt).toLocaleString() : "—"}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground">Updated At</Label>
                  <div className="flex h-10 w-full items-center rounded-md border border-gray-100 bg-muted px-3 text-sm text-muted-foreground">
                    {formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : "—"}
                  </div>
                </div>
              </div>
            </FormSection> */}

        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 bg-muted border-t border-gray-100 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={onSaveClick} 
            className="bg-primary hover:bg-blue-700"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

      </div>
    </div>
    )
}

// Helper Component to maintain your design standards
const FormSection = ({ title, subtitle, icon: Icon, children }: {
    title: string
    subtitle: string
    icon: React.ElementType
    children: React.ReactNode
}) => (
  <div className="group border rounded-lg bg-card border-border transition-all overflow-hidden p-4 hover:border-accent">
    <div className="flex items-center gap-3 mb-4">
      <div className="shrink-0 p-1.5 rounded-md bg-gray-100 group-hover:bg-accent/10 transition-colors">
        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
        <p className="text-xs text-gray-400 leading-tight">{subtitle}</p>
      </div>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export default InstanceUpdateForm