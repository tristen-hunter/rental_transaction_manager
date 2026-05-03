import { Label } from "@/components/ui/label"
import type { RentalBodyData } from "./RentalCard"
import type { RentalUpdateDto } from "./RentalUpdateDto"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Calendar, Percent, Wallet } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BANKS } from "@/components/common/CommonLists"
import { Checkbox } from "@/components/ui/checkbox"

type Props = {
  rental: RentalBodyData
  onClose: () => void
  onSuccess: (rentalId: string, data: RentalUpdateDto) => Promise<void> | void
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
}) => {
    // 1. Convert the stored decimal (e.g., 0.1) to display value (e.g., 10)
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
                        onChange(field, numericValue);
                    }}
                    placeholder="0"
                    className="pr-7 no-spinner"
                />
                <span className="absolute right-3 top-2.5 text-gray-400 text-sm">%</span>
            </div>
        </div>
    );
};

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
                className="pl-7 no-spinner"
                value={value}
                onChange={(e) => onChange(field, Number(e.target.value))}
                placeholder="0.00"
            />
        </div>
    </div>
)

const RentalUpdateForm = ({ rental, onClose, onSuccess}: Props) => {
    const [formData, setFormData] = useState<RentalUpdateDto>({
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
    });

    const [isSaving, setIsSaving] = useState(false);

    const onSaveClick = async () => {
      // console.log("FORM DATA: ", formData)
      setIsSaving(true);
      await onSuccess(rental.id, formData);
      // No need to set false here if the component unmounts on success
    };

    const handleChange = (field: keyof RentalUpdateDto, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    };

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-border">
                
                {/* ── Header ── */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-muted/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Update Rental Contract</h2>
                        <p className="text-sm text-muted-foreground">{formData.address}</p>
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

                    {/* 2. Financial Logic (Percentages & Splits) */}
                    <FormSection title="Commission Structure" subtitle="Percentages for office and agent splits" icon={Percent}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <CurrencyInput label="Base Rent" field="baseRent" value={formData.baseRent ?? 0} onChange={handleChange} />
                            <PercentInput label="Comm (%)" field="rentalCommissionPercent" value={formData.rentalCommissionPercent} onChange={handleChange} />
                            <PercentInput 
                                label="Office Split (%)" 
                                field="officeSplit" 
                                value={formData.officeSplit} 
                                onChange={(_, val) => handleSplitChange("officeSplit", val)} 
                            />
                            <PercentInput 
                                label="Agent Split (%)" 
                                field="agentSplit" 
                                value={formData.agentSplit} 
                                onChange={(_, val) => handleSplitChange("agentSplit", val)} 
                            />
                            <PercentInput label="Agent PAYE (%)" field="agentPaye" value={formData.agentPaye} onChange={handleChange} />
                        </div>
                        <div className="flex items-end pb-2 space-x-2">
                            <Checkbox 
                                id="vatRegistered" 
                                checked={!!formData.vatRegistered} 
                                onCheckedChange={(checked) => handleChange("vatRegistered", !!checked)} 
                            />
                            <Label htmlFor="vatRegistered" className="cursor-pointer select-none">
                                Vat Registered
                            </Label>
                        </div>
                    </FormSection>

                    {/* 3. Audit Info (Read-Only Style) */}
                    {/* <FormSection title="Audit Trail" subtitle="System tracking" icon={BadgeDollarSign}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-gray-400">Created At</Label>
                                <div className="flex h-10 w-full items-center rounded-md border border-gray-100 bg-muted px-3 text-sm text-gray-400">
                                    {formData.createdAt ? new Date(formData.createdAt).toLocaleString() : "—"}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-gray-400">Last Updated</Label>
                                <div className="flex h-10 w-full items-center rounded-md border border-gray-100 bg-muted px-3 text-sm text-gray-400">
                                    {formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : "—"}
                                </div>
                            </div>
                        </div>
                    </FormSection> */}

                    {/* 3. Landlord Payout Information (New Edit Section) */}
                    <FormSection title="Payout Information" subtitle="Landlord banking details" icon={Wallet}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-1.5">
                                <Label>Landlord Full Name</Label>
                                <Input 
                                    value={formData.landlordName ?? ""} 
                                    onChange={(e) => handleChange("landlordName", e.target.value)} 
                                    placeholder="Landlord Name" 
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label>Bank Name</Label>
                                <Select 
                                    value={formData.landlordBankName ?? ""} 
                                    onValueChange={(val) => handleChange("landlordBankName", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a bank" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BANKS.map(bank => (
                                            <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label>Account Number</Label>
                                <Input 
                                    value={formData.landlordAccNo ?? ""} 
                                    onChange={(e) => handleChange("landlordAccNo", e.target.value)} 
                                    placeholder="Account Number" 
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1 space-y-1.5">
                                <Label>Branch Code</Label>
                                <Input 
                                    value={formData.landlordBranch ?? ""} 
                                    onChange={(e) => handleChange("landlordBranch", e.target.value)} 
                                    placeholder="Branch Code" 
                                />
                            </div>
                        </div>
                    </FormSection>
                </div>

                {/* ── Footer ── */}
                <div className="px-6 py-4 bg-muted border-t border-gray-100 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button 
                        onClick={onSaveClick} 
                        className="bg-primary hover:bg-blue-700 text-white min-w-30"
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

export default RentalUpdateForm