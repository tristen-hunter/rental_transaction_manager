import { Label } from "@/components/ui/label"
import type { RentalBodyData } from "./RentalCard"
import type { RentalUpdateDto } from "./RentalUpdateDto"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Calendar, Percent, BadgeDollarSign } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
  rental: RentalBodyData
  onClose: () => void
  onSuccess: (data: RentalUpdateDto) => Promise<void> | void
}

const STATUS_OPTIONS = ["ACTIVE", "CANCELLED", "COMPLETED"]

/** <------------- HELPER FUNCTIONS -------------------------------------------------- */

const PercentInput = ({
    label,
    field,
    value,
    onChange,
}: {
    label: string
    field: keyof RentalUpdateDto
    value: number
    onChange: (field: keyof RentalUpdateDto, value: number) => void
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
    field: keyof RentalUpdateDto
    value: number
    onChange: (field: keyof RentalUpdateDto, value: number) => void
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

const RentalUpdateForm = ({ rental, onClose, onSuccess}: Props) => {
    const [formData, setFormData] = useState<RentalUpdateDto>({
      id: rental.id,
      agentId: rental.agentId,
      address: rental.address,
      tenantName: rental.tenantName,
      paymentDate: rental.paymentDate,
      startDate: rental.startDate,
      endDate: rental.endDate,
      autoRenew: rental.autoRenew,
      status: rental.status,
      landlordName: rental.landlordName,
      landlordBankName: rental.landlordBankName,
      landlordAccNo: rental.landlordAccNo,
      landlordBranch: rental.landlordBranch,
      baseRent: rental.baseRent,
      rentalCommissionPercent: rental.rentalCommissionPercent,
      officeSplit: rental.officeSplit,
      agentSplit: rental.agentSplit,
      agentPaye: rental.agentPaye,
      vatRegistered: rental.vatRegistered,
      createdBy: rental.createdBy,
      createdAt: rental.createdAt,
      updatedAt: rental.updatedAt
    });

    const [isSaving, setIsSaving] = useState(false);

    const onSaveClick = async () => {
      setIsSaving(true);
      await onSuccess(formData);
      // No need to set false here if the component unmounts on success
    };

    const handleChange = (field: keyof RentalUpdateDto, value: string | number) => {
        setFormData((prev) => ({...prev, [field]: value}))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
                
                {/* ── Header ── */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Update Rental Contract</h2>
                        <p className="text-sm text-gray-500">{formData.address}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* ── Scrollable Body ── */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* 1. Contract Metadata */}
                    <FormSection title="Lease Details" subtitle="Primary contract dates and status" icon={Calendar}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Tenant Name</Label>
                                <Input 
                                    value={formData.tenantName ?? ""} 
                                    onChange={(e) => handleChange("tenantName", e.target.value)} 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(val) => handleChange("status", val)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </FormSection>

                    {/* 2. Financial Logic (Percentages & Splits)[cite: 2] */}
                    <FormSection title="Commission Structure" subtitle="Percentages for office and agent splits" icon={Percent}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <CurrencyInput label="Base Rent" field="baseRent" value={formData.baseRent ?? 0} onChange={handleChange} />
                            <PercentInput label="Comm (%)" field="rentalCommissionPercent" value={formData.rentalCommissionPercent} onChange={handleChange} />
                            <PercentInput label="Office Split (%)" field="officeSplit" value={formData.officeSplit} onChange={handleChange} />
                            <PercentInput label="Agent Split (%)" field="agentSplit" value={formData.agentSplit} onChange={handleChange} />
                            <PercentInput label="Agent PAYE (%)" field="agentPaye" value={formData.agentPaye} onChange={handleChange} />
                        </div>
                    </FormSection>

                    {/* 3. Audit Info (Read-Only Style)[cite: 2] */}
                    <FormSection title="Audit Trail" subtitle="System tracking" icon={BadgeDollarSign}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-gray-400">Created At</Label>
                                <div className="flex h-10 w-full items-center rounded-md border border-gray-100 bg-gray-50 px-3 text-sm text-gray-400">
                                    {formData.createdAt ? new Date(formData.createdAt).toLocaleString() : "—"}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-gray-400">Last Updated</Label>
                                <div className="flex h-10 w-full items-center rounded-md border border-gray-100 bg-gray-50 px-3 text-sm text-gray-400">
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
                        onClick={onSaveClick} 
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-30"
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
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

export default RentalUpdateForm