import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, User, Building2, ToggleLeft, ToggleRight } from "lucide-react"
import type { AgentBodyData } from "./AgentCard"
import type { AgentUpdateDto } from "./AgentUpdateDto"

type Props = {
  agent: AgentBodyData
  onClose: () => void
  onSuccess: (data: AgentUpdateDto) => Promise<void> | void
}

const AgentUpdateForm = ({ agent, onClose, onSuccess }: Props) => {
    const [formData, setFormData] = useState<AgentUpdateDto>({
        ...agent
    })

    const [isSaving, setIsSaving] = useState(false);

    const onSaveClick = async () => {
        setIsSaving(true);

        await onSuccess(formData)
    }

    const handleChange = (field: keyof AgentUpdateDto, value: string | boolean) => {
        setFormData((prev) => ({...prev, [field]: value}))
    }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">

          {/* ── Header ── */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                  <h2 className="text-xl font-bold text-gray-900">Update Agent Profile</h2>
                  <p className="text-sm text-gray-500">{formData.fullName ?? "Agent"}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="w-5 h-5" />
              </Button>
          </div>

          {/* ── Scrollable Body ── */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* 1. Personal Info */}
              <FormSection title="Personal Details" subtitle="Agent's name and contact information" icon={User}>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                          <Label>Full Name</Label>
                          <Input
                              value={formData.fullName ?? ""}
                              onChange={(e) => handleChange("fullName", e.target.value)}
                              placeholder="e.g. Jane Smith"
                          />
                      </div>
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                          <Label>Email Address</Label>
                          <Input
                              type="email"
                              value={formData.email ?? ""}
                              onChange={(e) => handleChange("email", e.target.value)}
                              placeholder="e.g. jane@agency.co.za"
                          />
                      </div>
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center justify-between pt-1 px-1">
                      <div>
                          <p className="text-sm font-medium text-gray-700">Agent Status</p>
                          <p className="text-xs text-gray-400">Toggle to activate or deactivate this agent</p>
                      </div>
                      <button
                          type="button"
                          onClick={() => handleChange("isActive", !formData.isActive)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                              formData.isActive
                                  ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                  : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                          }`}
                      >
                          {formData.isActive ? (
                              <><ToggleRight className="w-4 h-4" /> Active</>
                          ) : (
                              <><ToggleLeft className="w-4 h-4" /> Inactive</>
                          )}
                      </button>
                  </div>
              </FormSection>

              {/* 2. Banking Details */}
              <FormSection title="Banking Details" subtitle="Agent's payment and banking information" icon={Building2}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <Label>Bank Name</Label>
                      <Input
                          value={formData.bankName ?? ""}
                          onChange={(e) => handleChange("bankName", e.target.value)}
                          placeholder="e.g. FNB"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <Label>Branch Code</Label>
                      <Input
                          value={formData.branchCode ?? ""}
                          onChange={(e) => handleChange("branchCode", e.target.value)}
                          placeholder="e.g. 250655"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <Label>Account Number</Label>
                      <Input
                          value={formData.accountNumber ?? ""}
                          onChange={(e) => handleChange("accountNumber", e.target.value)}
                          placeholder="e.g. 62012345678"
                      />
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

export default AgentUpdateForm