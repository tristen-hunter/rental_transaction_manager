import React, { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { X, Building2, Wallet, Calendar, Percent } from 'lucide-react';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RentalService } from './RentalService';
import type { RentalCreateDto } from './RentalCreateDto';
import type { AgentIdNameDto } from '../agents/AgentIdNameDto';
import { AgentService } from '../agents/AgentService';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface RentalFormInputs {
  agentId: string;
  address: string;
  tenantName: string;
  paymentDate: string;
  autoRenew: boolean;
  endDate?: string;
  landlordName: string;
  landlordBankName: string;
  landlordAccNo: string;
  landlordBranch: string;
  baseRent: number;
  rentalCommissionPercent: number;
  officeSplit: number;
  agentPaye: number;
  vatRegistered: boolean;
  createdBy: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const RentalCreateForm: React.FC<Props> = ({ isOpen, onClose }) => {
  const [agents, setAgents] = useState<AgentIdNameDto[]>([]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RentalFormInputs>({
    defaultValues: { autoRenew: true, vatRegistered: true }
  });

  useEffect(() => {
    if (isOpen) {
      const fetchAgents = async () => {
        try {
          const data = await AgentService.fetchAgentNamesAndIds();
          setAgents(data);
        } catch (error) {
          console.error("Failed to load agents", error);
        }
      };
      fetchAgents();
    }
  }, [isOpen])

  const watchAutoRenew = watch("autoRenew");
  const watchVat = watch("vatRegistered");

  const onSubmit: SubmitHandler<RentalFormInputs> = async (data) => {
    // 1. Transform percentages to decimals for the backend
    const dto: RentalCreateDto = {
      ...data,
      endDate: data.autoRenew ? null : data.endDate,
      rentalCommissionPercent: Number(data.rentalCommissionPercent) / 100,
      officeSplit: Number(data.officeSplit) / 100,
      agentPaye: Number(data.agentPaye) / 100,
    };

    // 2. Call the end point, log result, close modal
    try {
      const result = await RentalService.create(dto);
      console.log("Success:", result);

      onClose();

    } catch (error){
      // 3. Handle errors (e.g., validation errors from Java)
      console.error("Submission failed:", error);
      alert("Check your connection or data.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">New Rental Agreement</h2>
            <p className="text-sm text-gray-500">Enter lease details to generate financials.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section: Property & Tenant */}
          <FormSection title="Property Details" subtitle="Location and primary contacts" icon={Building2}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label>Property Address</Label>
                <Input {...register("address", { required: true })} placeholder="123 Legend Lane..." className={errors.address ? "border-red-500" : ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="agentId">Assign Agent</Label>
                <select
                  id="agentId"
                  {...register("agentId", { required: "Agent selection is required" })}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.agentId ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <option value="">Select an Agent...</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.fullName}
                    </option>
                  ))}
                </select>
                {errors.agentId && <p className="text-xs text-red-500">Selection required</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Tenant Name</Label>
                <Input {...register("tenantName", { required: true })} placeholder="John Doe" />
              </div>
            </div>
          </FormSection>

          {/* Section: Lease Terms */}
          <FormSection title="Lease Terms" subtitle="Dates and renewal settings" icon={Calendar}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Payment Date</Label>
                <Input type="date" {...register("paymentDate", { required: true })} />
              </div>
              <div className="flex items-end pb-2 space-x-2">
                <Checkbox 
                  id="autoRenew" 
                  checked={watchAutoRenew}
                  onCheckedChange={(checked) => setValue("autoRenew", checked as boolean)} 
                />
                <Label htmlFor="autoRenew" className="cursor-pointer">Auto-Renew Contract</Label>
              </div>
              {!watchAutoRenew && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                  <Label>End Date</Label>
                  <Input type="date" {...register("endDate")} />
                </div>
              )}
            </div>
          </FormSection>

          {/* Section: Financials */}
          <FormSection title="Financial Configuration" subtitle="Rental amounts and splits" icon={Percent}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Base Monthly Rent</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm">R</span>
                  <Input type="number" className="pl-7" {...register("baseRent", { required: true })} placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Commission (%)</Label>
                <Input type="number" {...register("rentalCommissionPercent")} placeholder="10" />
              </div>
              <div className="space-y-1.5">
                <Label>Office Split (%)</Label>
                <Input type="number" {...register("officeSplit")} placeholder="30" />
              </div>
              <div className="space-y-1.5">
                <Label>Agent PAYE (%)</Label>
                <Input type="number" {...register("agentPaye")} placeholder="25" />
              </div>
            </div>
            <div className="flex items-end pb-2 space-x-2">
                <Checkbox 
                  id="vatRegistered" 
                  checked={watchVat} // This ensures the UI matches the 'true' default
                  onCheckedChange={(checked) => setValue("vatRegistered", !!checked)} 
                />
                <Label htmlFor="vatRegistered" className="cursor-pointer">Vat Registered</Label>
              </div>
          </FormSection>

          {/* Section: Landlord Banking */}
          <FormSection title="Payout Information" subtitle="Landlord banking details" icon={Wallet}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label>Landlord Full Name</Label>
                <Input {...register("landlordName")} placeholder="Landlord Name" />
              </div>

              {/* Updated Bank Name Dropdown */}
              <div className="space-y-1.5">
                <Label>Bank Name</Label>
                <Select onValueChange={(val) => setValue("landlordBankName", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Absa", "Capitec", "FNB", "Nedbank", "Standard Bank", "TymeBank", "Discovery Bank", "Investec", "Other"].map(bank => (
                      <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Account Number</Label>
                <Input {...register("landlordAccNo")} placeholder="Account Number" />
              </div>

              <div className="col-span-2 md:col-span-1 space-y-1.5">
                <Label>Branch Code</Label>
                <Input {...register("landlordBranch")} placeholder="Branch Code" />
              </div>
            </div>
          </FormSection>

          <div className="pt-4 border-t border-gray-100">
             <Label>Created By</Label>
             <Input {...register("createdBy")} placeholder="Staff name" className="mt-1" />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} className="bg-blue-600 hover:bg-blue-700">
            Finalise Rental
          </Button>
        </div>
      </div>
    </div>
  );
};

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

export default RentalCreateForm;