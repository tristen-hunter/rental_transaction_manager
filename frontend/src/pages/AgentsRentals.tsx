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
import { toast } from "react-toastify";

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
        if (isMounted) toast.error("No rentals found");
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
      await RentalService.createInstance(rental.id);
      toast.success("Instance Successfully Created!");

    } catch (err) {
      console.error("Error creating instance: ", err);
      toast.error("Instance Could Not Be Created.");
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
      toast.success("Rental Successfully Deleted")
      setRefresh(r => r + 1);
    } catch (err) {
      console.error("Couldn't delete Rental", err)
      toast.error("Rental Couldn't be deleted")
      throw err;
    }
  }

  const [selectedRental, setSelectedRental] = useState<RentalBodyData | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSaveRental = async (rentalId: string, updatedData: RentalUpdateDto) => {
    try {
      // console.log("UPDATED DATA: ", updatedData)
      await RentalService.updateRental(rentalId, updatedData);

      handleSuccess();
      toast.success("Rental Was Successfully Updated.")
      
    } catch (err){
      console.error("Failed to update rental:", err);
      toast.error("Rental Could Not Be Updated.")
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
    <div>
      {/* 1. Sticky Header Section */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-t border-b border-border shadow-sm px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3 max-w-6xl mx-auto">
          
          {/* Left side: Navigation & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Go back"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>
            
            <Breadcrumbs />
          </div>

          {/* Right side: Action / Title */}
          <div className="text-right">
            <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl uppercase">
              {agentName}
            </h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
              Rentals
            </p>
          </div>

        </div>
      </div>
      {agentRentals.length === 0 ? (
        <p>No rentals assigned to this agent.</p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-4 p-4 bg-muted border border-border">
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
          onSuccess={(rentalId, dto) => handleSaveRental(rentalId, dto)}
        />
      )}
    </div>
  );
}