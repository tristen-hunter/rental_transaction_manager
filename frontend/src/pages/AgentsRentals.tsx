import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AgentService } from "@/features/agents/AgentService";
import type { RentalReturnDto } from "@/features/rentals/rental";
import { RentalCard, type RentalBodyData } from "@/features/rentals/RentalCard";
import { RentalService } from "@/features/rentals/RentalService";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/global/BreadCrumbs";
import RentalUpdateForm from "@/features/rentals/RentalUpdateForm";
import type { RentalUpdateDto } from "@/features/rentals/RentalUpdateDto";

export default function AgentsRentals() {
  const { agentId } = useParams<{ agentId: string }>(); // Matches :agentId in App.tsx
  const [agentRentals, setAgentRentals] = useState<RentalReturnDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  const [refresh, setRefresh] = useState(0);

  const agentName = location.state?.agentName || "Agent";


  /**
   * Fetches all Agent rentals, based on agentId
   */
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
  }, [agentId, refresh]);


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

  const handleDelete = async (rentalId: string) => {
    try {
      await RentalService.deleteRental(rentalId);
    } catch (err) {
      console.error("Couldn't delete Rental", err)
      throw err;
    }
    
  }

  const [selectedRental, setSelectedRental] = useState<RentalBodyData | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSaveRental = async (updatedData: RentalUpdateDto) => {
    try {
      // console.log("UPDATED DATA: ", updatedData)
      await RentalService.updateRental(updatedData);
      handleSuccess();
    } catch (err){
      console.error("Failed to update rental:", err);
    }
  }

  const handleEdit = (rental: RentalBodyData) => {
    setSelectedRental(rental);
    setIsEditOpen(true);
  }

  const handleClose = () => {
    setIsEditOpen(false);
    setSelectedRental(null);
  }

  const handleSuccess = () => {
    setRefresh(r => r + 1);
    handleClose();
  }


  if (loading) return <div>Loading rentals...</div>;

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
        <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {agentRentals.map((rental) => (
            <RentalCard
              key={rental.id}
              rental={rental}
              address={rental.address}
              agentName={"R " + rental.baseRent}
              status={rental.status}
              onEdit={() => handleEdit(rental)}
              onDelete={() => handleDelete(rental.id)}
              onSetStatus={(data) => console.log("Update Status", data.tenantName)}
              onCreateInstance={handleCreateInstance}
              onTitleClick={() => handleNav(rental)}
            />
        ))}
        </div>
      )}
      {isEditOpen && selectedRental && (
        <RentalUpdateForm 
          rental={selectedRental}
          onClose={handleClose}
          onSuccess={handleSaveRental}
        />
      )}
    </div>
  );
}