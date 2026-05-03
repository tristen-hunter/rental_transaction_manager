import axiosClient from "../context/axiosClient"
import { useEffect, useState } from "react";
import type { AgentReturnDto } from "@/features/agents/AgentReturnDto";
import AgentCreateForm from "@/features/agents/AgentCreateForm";
import { AgentCard, type AgentBodyData } from "@/features/agents/AgentCard";
import { useNavigate } from "react-router-dom";
import AgentUpdateForm from "@/features/agents/AgentUpdateForm";
import type { AgentUpdateDto } from "@/features/agents/AgentUpdateDto";
import { AgentService } from "@/features/agents/AgentService";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";


export default function Agents() {
  const [agents, setAgents] = useState<AgentReturnDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Explicit type
  const [showModal, setShowModal] = useState(false);

  const [refresh, setRefresh] = useState(0);

  const navigate = useNavigate();

  /**
   * Runs on mount
   * GET request 
   */
  useEffect(() => {
    // It's cleaner to use a flag to prevent state updates on unmounted components
    let isMounted = true;

    axiosClient.get<AgentReturnDto[]>("/agents")
      .then((response) => {
        if (isMounted) {
          console.log(response.data)

          setAgents(response.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          // Access the message so React can render it
          setError(err.message || "An unexpected error occurred");
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [refresh]);


  const handleNav = (agent: AgentReturnDto) => {
    navigate(`/rentals/agents/${agent.id}`, {
      state: { agentName: agent.fullName }
    });
  }

  const handleSubmit = () => {
    setShowModal(false);
    setRefresh(r => r+1)
  }


  const [selectedAgent, setSelectedAgent] = useState<AgentBodyData | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (agent: AgentBodyData) => {
    setSelectedAgent(agent)
    setIsEditOpen(true);
  }

  const handleClose = () => {
    setIsEditOpen(false);
    setSelectedAgent(null);
  }
  
  const handleSuccess = () => {
    setRefresh(r => r + 1);
    handleClose();
  }

  const handleSaveAgent = async (agentId: string, updatedData: AgentUpdateDto) => {
    try {
      await AgentService.updateAgent(agentId, updatedData);
      handleSuccess();
      toast.success("Agent Successfully Saved")
    } catch (err) {
      console.error("Failed to update Agent: ", err)
      toast.error("Agent Could Not be Updated.")
    }
  }


  if (loading) return <p>Loading Agents...</p>;
  if (error) return <p>Error: {error}</p>;
  // Combine header and list into one return statement
  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-t border-b border-border shadow-sm mb-6 px-4 sm:px-6">
        {/* FIX: Changed max-w-6xl to max-w-5xl to make it narrower and match the content perfectly */}
        <div className="flex items-center justify-between gap-4 py-2.5 max-w-6xl mx-auto">
          {/* Left side: Heading & Subheading */}
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:2xl">
              ALL AGENTS
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage and view all registered agents
            </p>
          </div>

          {/* Right side: Primary Action Button */}
          <Button 
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>New Agent</span>
          </Button>
        </div>
      </div>
      
      <AgentCreateForm
        isOpen={showModal}
        onClose={handleSubmit}
      />

      <div className="grid grid-cols-1 gap-2 max-w-5xl mx-auto">

        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            name={agent.fullName}
            email={agent.email}
            isActive={agent.isActive}
            // Pass the whole agent object for the expanded view & logic
            agent={{
              id: agent.id,
              fullName: agent.fullName,
              email: agent.email,
              isActive: agent.isActive,
              bankName: agent.bankName,
              accountNumber: agent.accountNumber,
              branchCode: agent.branchCode,
              createdBy: agent.createdBy,
              createdAt: agent.createdAt,
              lastModifiedBy: agent.lastModifiedBy,
              lastModifiedAt: agent.lastModifiedAt,
              kind: "agent",
            }}
            onEdit ={handleEdit}
            onDeactivate={() => console.log("DDEACTIVATING: ", agent.fullName)}
            onTitleClick={() => handleNav(agent)}
          />
        ))}
        </div>
        {isEditOpen && selectedAgent && (
          <AgentUpdateForm 
            agent={selectedAgent}
            onClose={handleClose}
            onSuccess={(id, data) => handleSaveAgent(id, data)}
          />
        )}
    </div>
  );
}