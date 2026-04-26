import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { X, UserPlus, Mail, Landmark, ShieldCheck } from 'lucide-react';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AgentService } from './agentService';

interface AgentFormInputs {
  fullName: string;
  email: string;
  bankName: string;
  accountNumber: string;
  branchCode: string;
  isActive: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AgentCreateForm: React.FC<Props> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AgentFormInputs>({
    defaultValues: {
      isActive: true,
      bankName: ""
    }
  });

  const watchIsActive = watch("isActive");

  /**
   * @param data AgentCreatDto
   *  POST '/api/agents'
   */
  const onSubmit: SubmitHandler<AgentFormInputs> = async (data) => {
    try {
      // 1. Call the backend
      const result = await AgentService.create(data);
      
      // 2. Give user feedback (consider Shadcn Toast)
      console.log("Success:", result);
      alert("Agent Created Successfully!"); 

      // 3. Close the modal
      onClose();

    } catch (error){
      // 4. Handle errors (e.g., validation errors from Java)
      console.error("Submission failed:", error);
      alert("Check your connection or data.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-gray-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Register New Agent</h2>
            <p className="text-sm text-gray-500">Create a profile for a new rental agent.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          
          {/* Section 1: Identity */}
          <FormSection title="Agent Identity" subtitle="Basic profile information" icon={UserPlus}>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input 
                    id="fullName"
                    className="pl-9" 
                    {...register("fullName")} 
                    placeholder="e.g. Sipho Nkosi" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input 
                    id="email"
                    type="email" 
                    className="pl-9" 
                    {...register("email")} 
                    placeholder="agent@propcoza.com" 
                  />
                </div>
              </div>
            </div>
          </FormSection>

          {/* Section 2: Banking */}
          <FormSection title="Bank Details" subtitle="Required for commission payouts" icon={Landmark}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label>Bank Name</Label>
                <Select onValueChange={(val) => setValue("bankName", val)}>
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
                <Input {...register("accountNumber")} placeholder="123456789" />
              </div>

              <div className="space-y-1.5">
                <Label>Branch Code</Label>
                <Input {...register("branchCode")} placeholder="632005" />
              </div>
            </div>
          </FormSection>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/30">
            <div className="flex items-center gap-3">
              <ShieldCheck className={`w-5 h-5 ${watchIsActive ? "text-green-500" : "text-gray-400"}`} />
              <div>
                <p className="text-sm font-medium text-gray-800">Account Status</p>
                <p className="text-xs text-gray-500">{watchIsActive ? "Agent is active and can process rentals" : "Agent is currently disabled"}</p>
              </div>
            </div>
            <Switch 
              checked={watchIsActive} 
              onCheckedChange={(checked) => setValue("isActive", checked)} 
            />
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} className="bg-blue-600 hover:bg-blue-700 shadow-md">
            Create Agent
          </Button>
        </div>
      </div>
    </div>
  );
};

// Reusable Section Wrapper to match design
const FormSection = ({ title, subtitle, icon: Icon, children }: any) => (
  <div className="group border rounded-lg bg-white border-gray-200 transition-all p-4 hover:border-blue-300 hover:shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className="shrink-0 p-1.5 rounded-md bg-gray-100 group-hover:bg-blue-50 transition-colors">
        <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 leading-tight">{title}</p>
        <p className="text-xs text-gray-400 leading-tight">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

export default AgentCreateForm;