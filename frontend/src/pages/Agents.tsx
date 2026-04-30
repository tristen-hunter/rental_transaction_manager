import axiosClient from "../context/axiosClient"
import { useEffect, useState } from "react";
import type { AgentReturnDto } from "@/features/agents/AgentReturnDto";
import AgentCreateForm from "@/features/agents/AgentCreateForm";
import { AgentCard } from "@/features/agents/AgentCard";
import { useNavigate } from "react-router-dom";


export default function Agents() {
  const [agents, setAgents] = useState<AgentReturnDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Explicit type
  const [showModal, setShowModal] = useState(false);

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
  }, []);

  if (loading) return <p>Loading Agents...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleNav = (id: AgentReturnDto["id"]) => {
    navigate(`/rentals/agents/${id}`);
  }


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
          onClose={() => setShowModal(false)}
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
              kind: "agent",
              totalRentals: agent.totalRentals,
              bankName: agent.bankName,
              accountNumber: agent.accountNumber,
              branchCode: agent.branchCode,
              createdAt: agent.createdAt,
              updatedAt: agent.updatedAt,
            }}
            onEdit ={() => console.log("EDITING: ", agent.fullName)}
            onDeactivate={() => console.log("DDEACTIVATING: ", agent.fullName)}
            onTitleClick={() => handleNav(agent.id)}
          />
        ))}
        </div>
    </div>
  );
}