import { useEffect, useState } from "react";
import axiosClient from "../context/axiosClient";
import type { RentalReturnDto, RentalStatus } from "../features/rentals/rental";
import RentalCreateForm from "@/features/rentals/RentalCreateForm";
import { RentalCard, type RentalBodyData } from "@/features/rentals/RentalCard";
import { RentalService } from "@/features/rentals/RentalService";
import { useNavigate } from "react-router-dom";
import type { RentalUpdateDto } from "@/features/rentals/RentalUpdateDto";
import RentalUpdateForm from "@/features/rentals/RentalUpdateForm";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";


export default function Rentals() {
  const [rentals, setRentals] = useState<RentalReturnDto[]>([]);
  const [status, setStatus] = useState<RentalStatus>("ACTIVE") // default
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);


  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    /**
     * axiosClient.get(url, {params: {key: value} })
     * RESULT: /rentals?status=ACTIVE
     * RUNS: whenever status updates
     */
    axiosClient.get<RentalReturnDto[]>("/rentals", {
      params: { status: status}
    })
    .then((res) => {
      setRentals(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [status, refresh]) 

  /// Creates individual instances as DRAFT
  const handleCreateInstance = async (rental: RentalBodyData) => {
    try {
      await RentalService.createInstance(rental.id);

      toast.success("Instance Successfully Created!")
    } catch (err) {
      console.error("Error creating instance: ", err);
      toast.error("Instance Could Not Be Created.")
    }
  }

  /// Navigation for title clicks
  const handleNav = (rental: RentalReturnDto) => {
    navigate(`/instances/rentals/${rental.id}`, {
      state: { rentalAddress: rental.address }
    })
  }

  /**
   * For handling editing
   */
  const [selectedRental, setSelectedRental] = useState<RentalBodyData | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

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

  const handleSaveRental = async (rentalId: string, updatedData: RentalUpdateDto) => {
    try {
      await RentalService.updateRental(rentalId, updatedData);

      handleSuccess();
      toast.success
    } catch (err){
      console.error("Failed to update rental:", err);
    }
  }

  const handleSubmit = () => {
    setShowModal(false);
    setRefresh(r => r+1)
  }


  const handleDelete = async (rentalId: string) => {
    try {
      await RentalService.deleteRental(rentalId);
    } catch (err) {
      console.error("Couldn't delete Rental", err)
      throw err;
    }
    
  }


  return (
    <div className="mx-auto">
      {/* 1. Sticky Header Section */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-t border-b border-border shadow-sm mb-6 px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3 max-w-6xl mx-auto">
          
          {/* Left side: Heading & Subheading */}
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl uppercase">
              Rentals - {status.toLowerCase()}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage, filter, and create rental agreements
            </p>
          </div>

          {/* Right side: Action Button */}
          <button 
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>New Rental</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Tabs Section (Max-width aligns with the header above) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-wrap gap-2">
          {(["ACTIVE", "CANCELLED", "COMPLETED"] as RentalStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                status === s 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Modal Form (Kept out of layout flow) */}
      <RentalCreateForm 
        isOpen={showModal} 
        onClose={handleSubmit} 
      />

      {loading ? (
        <p>Loading {status} rentals...</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 max-w-6xl mx-auto">
            {rentals.map((rental) => (
              <RentalCard
                key={rental.id}
                rental={rental}               // Pass the whole object for the expanded view
                address={rental.address}       // Title
                agentName={rental.agentName}   // Subtitle
                status={rental.status}         // Wrapper will map this to the colored badge
                onTitleClick={() => handleNav(rental)}
                // Connect the specific actions
                onEdit={() => handleEdit(rental)}
                onDelete={() => handleDelete(rental.id)}
                onSetStatus={(data) => console.log("Update Status", data.tenantName)}
                onCreateInstance={handleCreateInstance}
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