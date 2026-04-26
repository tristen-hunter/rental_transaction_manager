import axiosClient from "../context/axiosClient"
import { useEffect, useState } from "react";
import DataCard from "@/components/global/DataCard";
import type { AgentReturnDto } from "../features/agents/agentReturnDto";
import { User2 } from "lucide-react";

export default function Agents() {
  const [agents, setAgents] = useState<AgentReturnDto[]>([]);
  const [loading, setLoading] = useState(true); // Fixed casing (setloading -> setLoading)
  const [error, setError] = useState<string | null>(null); // Explicit type

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

  // Combine your header and your list into one return statement
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Agents Page</h1>
      <div className="grid grid-cols-1 gap-2">
        {agents.map((agent) => (
          <DataCard
            key={agent.id}
            title={agent.fullName}
            subtitle={agent.bankName}
            status={agent.isActive}
            icon={User2}
            body={{
              kind: "agent",
              totalRentals: agent.totalRentals,   // optional
              bankName: agent.bankName,
              accountNumber: agent.accountNumber,
              branchCode: agent.branchCode,
              createdAt: agent.createdAt,
              updatedAt: agent.updatedAt,
            }}
            onEdit={() => console.log("Edit", agent.id)}
            onDelete={() => console.log("Delete", agent.id)}
          />
        ))}
        </div>
    </div>
  );
}