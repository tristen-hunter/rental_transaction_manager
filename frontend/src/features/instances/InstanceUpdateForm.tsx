import { useState } from "react"
import { X, Calendar, Percent, Calculator, Landmark, BadgeDollarSign } from "lucide-react"
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

type Props = {
    instance: InstanceBodyData
    rental?: RentalReturnDto
    onClose: () => void
    onSuccess: (data: InstanceUpdateDto) => Promise<void> | void
}

const STATUS_OPTIONS = ["DRAFT", "APPROVED", "CANCELLED"]

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
}) => (
    <div className="space-y-1.5">
        <Label>{label}</Label>
        <div className="relative">
            <Input
                type="number"
                value={value}
                onChange={(e) => onChange(field, Number(e.target.value))}
                placeholder="0"
                className="pr-7"
            />
            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">%</span>
        </div>
    </div>
)

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
                className="pl-7"
                value={value}
                onChange={(e) => onChange(field, Number(e.target.value))}
                placeholder="0.00"
            />
        </div>
    </div>
)


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
        status: "DRAFT",
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt
    });

    // Add a local loading state
    const [isSaving, setIsSaving] = useState(false);

    const onSaveClick = async () => {
        console.log("CLICK")
        setIsSaving(true);
        await onSuccess(formData);
        // No need to set false here if the component unmounts on success
    };

    /// This is a generic field updater - keeps all changes in one place
    const handleChange = (field: keyof InstanceUpdateDto, value: string | number) => {
        setFormData((prev) => ({...prev, [field]: value}))
    }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">

            {/* ── Header ── */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Update Billing Instance</h2>
                    <p className="text-sm text-gray-500">
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
                            <Label>Billing Period</Label>
                            <Input
                                value={formData.billingPeriod}
                                onChange={(e) => handleChange("billingPeriod", e.target.value)}
                                placeholder="e.g. 2025-07"
                            />
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
                        <PercentInput label="Office Split (%)" field="officeSplit" value={formData.officeSplit} onChange={handleChange} />
                        <PercentInput label="Agent Split (%)" field="agentSplit" value={formData.agentSplit} onChange={handleChange} />
                        <PercentInput label="Agent PAYE (%)" field="agentPaye" value={formData.agentPaye} onChange={handleChange} />
                    </div>
                </FormSection>

                {/* 3. Calculated Totals (read-only) */}
                <FormSection title="Calculated Totals" subtitle="Derived figures — MUST BE MANUALLY UPDATED" icon={Calculator}>
                    <div className="grid grid-cols-2 gap-4">
                        <CurrencyInput label="Landlord Pay Amount" field="landlordPayAmount" value={formData.landlordPayAmount} onChange={handleChange} />
                        <CurrencyInput label="Base Commission" field="baseComm" value={formData.baseComm} onChange={handleChange} />
                        <CurrencyInput label="VAT" field="vat" value={formData.vat} onChange={handleChange} />
                        <CurrencyInput label="Commission Excl. VAT" field="commExclVat" value={formData.commExclVat} onChange={handleChange} />
                        <CurrencyInput label="Company Commission" field="companyComm" value={formData.companyComm} onChange={handleChange} />
                        <CurrencyInput label="Agent Gross Commission" field="agentGrossComm" value={formData.agentGrossComm} onChange={handleChange} />
                        <CurrencyInput label="PAYE Amount" field="payeAmount" value={formData.payeAmount} onChange={handleChange} />
                        <CurrencyInput label="Agent Nett Commission" field="agentNettComm" value={formData.agentNettComm} onChange={handleChange} />
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

                {/* 5. Audit Trail (read-only) */}
                <FormSection title="Audit Info" subtitle="System timestamps" icon={BadgeDollarSign}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-gray-500">Created At</Label>
                            <div className="flex h-10 w-full items-center rounded-md border border-gray-100 bg-gray-50 px-3 text-sm text-gray-500">
                                {formData.createdAt ? new Date(formData.createdAt).toLocaleString() : "—"}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-gray-500">Updated At</Label>
                            <div className="flex h-10 w-full items-center rounded-md border border-gray-100 bg-gray-50 px-3 text-sm text-gray-500">
                                {formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : "—"}
                            </div>
                        </div>
                    </div>
                </FormSection>

            </div>

            {/* ── Footer ── */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button 
                    onClick={() => {
                                onSaveClick();
                                console.log(formData);

                                onSuccess(formData);
                            }} 
                    className="bg-blue-600 hover:bg-blue-700"
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
  <div className="group border rounded-lg bg-white border-gray-200 transition-all overflow-hidden p-4 hover:border-blue-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="shrink-0 p-1.5 rounded-md bg-gray-100 group-hover:bg-blue-50 transition-colors">
        <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 leading-tight">{title}</p>
        <p className="text-xs text-gray-400 leading-tight">{subtitle}</p>
      </div>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export default InstanceUpdateForm