import axiosClient from "../api/axiosClient"
import { useEffect, useState } from "react";
import type { AgentReturnDto } from "../types/agentReturnDto";

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
    <div>
      <h1 className="text-3xl font-bold">Agents Page</h1>
      <h2>Agents List</h2>
      <ul>
        {agents.map((agent) => (
          <li key={agent.id}>{agent.fullName}</li>
        ))}
      </ul>
    </div>
  );
}