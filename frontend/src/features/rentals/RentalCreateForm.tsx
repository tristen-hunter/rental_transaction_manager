import React, { useEffect, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
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
import { toast } from 'react-toastify';

interface RentalFormInputs {
  agentId: string;
  address: string;
  tenantName: string;
  paymentDate: string;
  leasePeriod: number;

  landlordName: string;
  landlordBankName: string;
  landlordAccNo: string;
  landlordBranch: string;

  baseRent: number;
  rentalCommissionPercent: number;
  officeSplit: number;
  agentPaye: number;
  vatRegistered: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const RentalCreateForm: React.FC<Props> = ({ isOpen, onClose }) => {
  const [agents, setAgents] = useState<AgentIdNameDto[]>([]);

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<RentalFormInputs>({
    defaultValues: { vatRegistered: true }
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

  const onSubmit: SubmitHandler<RentalFormInputs> = async (data) => {
    const toDecimal = (val: any) => {
      const num = Number(val);
      return isNaN(num) ? 0 : num / 100;
    };

    // 1. Transform percentages to decimals for the backend
    const dto: RentalCreateDto = {
      ...data,
      rentalCommissionPercent: toDecimal(data.rentalCommissionPercent),
      officeSplit: toDecimal(data.officeSplit),
      agentPaye: toDecimal(data.agentPaye),
    };

    // 2. Call the end point, log result, close modal
    try {
      await RentalService.create(dto);
      toast.success("Rental Created Successfully")
      reset();
      onClose();
    } catch (error){
      // 3. Handle errors (e.g., validation errors from Java)
      console.error("Submission failed:", error);
      toast.error("Check your connection or data.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-border">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-muted/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">New Rental Agreement</h2>
            <p className="text-sm text-muted-foreground">Enter lease details to generate financials.</p>
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
                    errors.agentId ? "border-red-500" : "border-border"
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
              
              <div className="space-y-1.5">
                <Label htmlFor="leasePeriod">Lease Period (Months)</Label>
                <Controller
                  name="leasePeriod"
                  control={control}
                  rules={{ required: "Please select a lease period" }}
                  render={({ field }) => (
                    <Select 
                      onValueChange={(val) => field.onChange(Number(val))} 
                      value={field.value?.toString()}
                    >
                      <SelectTrigger id="leasePeriod" className={errors.leasePeriod ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select months..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => i + 1).map((month) => (
                          <SelectItem key={month} value={month.toString()}>
                            {month} {month === 1 ? 'Month' : 'Months'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.leasePeriod && (
                  <p className="text-xs text-red-500">{errors.leasePeriod.message}</p>
                )}
              </div>
            </div>
          </FormSection>

          {/* Section: Financials */}
          <FormSection title="Financial Configuration" subtitle="Rental amounts and splits" icon={Percent}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Base Monthly Rent</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm">R</span>
                  <Input type="number" className="pl-7 no-spinner" {...register("baseRent", { required: true })} placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Commission (%)</Label>
                <Input type="number" className="no-spinner" {...register("rentalCommissionPercent")} placeholder="10" />
              </div>
              <div className="space-y-1.5">
                <Label>Office Split (%)</Label>
                <Input type="number" className="no-spinner" {...register("officeSplit")} placeholder="30" />
              </div>
              <div className="space-y-1.5">
                <Label>Agent PAYE (%)</Label>
                <Input type="number" className="no-spinner" {...register("agentPaye")} placeholder="25" />
              </div>
            </div>
            <div className="flex items-end pb-2 space-x-2">
              <Controller
                  name="vatRegistered"
                  control={control} // Add 'control' from useForm destructuring
                  render={({ field }) => (
                    <Checkbox 
                      id="vatRegistered" 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  )}
                />
                <Label htmlFor="vatRegistered" className="cursor-pointer">
                  Vat Registered
                </Label>
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
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-muted border-t border-gray-100 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} className="bg-primary hover:bg-blue-700">
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

export default RentalCreateForm;