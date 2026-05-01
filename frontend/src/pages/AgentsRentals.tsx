import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AgentService } from "@/features/agents/AgentService";
import type { RentalReturnDto } from "@/features/rentals/rental";
import { RentalCard, type RentalBodyData } from "@/features/rentals/RentalCard";
import { RentalService } from "@/features/rentals/RentalService";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/global/BreadCrumbs";

export default function AgentsRentals() {
  const { agentId } = useParams<{ agentId: string }>(); // Matches :agentId in App.tsx
  const [agentRentals, setAgentRentals] = useState<RentalReturnDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  const agentName = location.state?.agentName || "Agent";


  useEffect(() => {
    // Prevent execution if agentId is missing
    if (!agentId) return;

    let isMounted = true;
    setLoading(true);

    const loadRentals = async () => {
      try {
        const res = await AgentService.fetchAgentsRentals(agentId);
        if (isMounted) {
          setAgentRentals(res);
        }
      } catch (err) {
        console.error("Failed to find Rentals");
        // Only alert if the component is still active
        if (isMounted) alert("No rentals found");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRentals();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [agentId]);

  if (loading) return <div>Loading rentals...</div>;

  const handleCreateInstance = async (rental: RentalBodyData) => {
    try {
      const res = await RentalService.createInstance(rental.id);

      console.log(res)

      alert("Instance created successfully!")
    } catch (err) {
      console.error("Error creating instance: ", err);
      alert("Failed to create instance.");
    }
  }

  const handleNav = (rental: RentalReturnDto) => {
    navigate(`/instances/rentals/${rental.id}`, {
      state: { 
        agentName: location.state?.agentName,
        rentalAddress: rental.address 
      }
    });
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="text-blue-600 hover:cursor-pointer flex items-center"
        >
          <ArrowLeft size={20} />
        </button>
        
        <Breadcrumbs />
      </div>
      <div className="text-xl font-bold mb-4 uppercase">{agentName} - RENTALS</div>
      {agentRentals.length === 0 ? (
        <p>No rentals assigned to this agent.</p>
      ) : (
        <div className="grid grid-cols-1 gap-2">
        {agentRentals.map((rental) => (
          <RentalCard
            key={rental.id}
            rental={rental}
            address={rental.address}
            agentName={rental.agentName}
            status={rental.status}
            onEdit={() => console.log("Edit", rental.address)}
            onDelete={(data) => console.log("Delete", data.tenantName)}
            onSetStatus={(data) => console.log("Update Status", data.tenantName)}
            onCreateInstance={handleCreateInstance}
            onTitleClick={() => handleNav(rental)}
          />
        ))}
        </div>
      )}
    </div>
  );
}