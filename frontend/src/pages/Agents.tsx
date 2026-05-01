import axiosClient from "../context/axiosClient"
import { useEffect, useState } from "react";
import type { AgentReturnDto } from "@/features/agents/AgentReturnDto";
import AgentCreateForm from "@/features/agents/AgentCreateForm";
import { AgentCard, type AgentBodyData } from "@/features/agents/AgentCard";
import { useNavigate } from "react-router-dom";
import AgentUpdateForm from "@/features/agents/AgentUpdateForm";
import type { AgentUpdateDto } from "@/features/agents/AgentUpdateDto";
import { AgentService } from "@/features/agents/AgentService";


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
          // console.log(response.data)

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

  const handleSaveAgent = async (updatedData: AgentUpdateDto) => {
    try {
      await AgentService.updateAgent(updatedData);
      handleSuccess();
    } catch (err) {
      console.error("Failed to update Agent: ", err)
    }
  }


  if (loading) return <p>Loading Agents...</p>;
  if (error) return <p>Error: {error}</p>;
  // Combine header and list into one return statement
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between gap-2 my-4">
        <h1 className="text-3xl font-bold">ALL AGENTS</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded bg-blue-600 text-white">
            New Agent
        </button>

        <AgentCreateForm
          isOpen={showModal}
          onClose={handleSubmit}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-2">
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
            onSuccess={handleSaveAgent}
          />
        )}
    </div>
  );
}