import { useEffect, useState } from "react";
import axiosClient from "../context/axiosClient";
import type { RentalReturnDto, RentalStatus } from "../features/rentals/rental";
import RentalCreateForm from "@/features/rentals/RentalCreateForm";
import { RentalCard, type RentalBodyData } from "@/features/rentals/RentalCard";
import { RentalService } from "@/features/rentals/RentalService";
import { useNavigate } from "react-router-dom";
import type { RentalUpdateDto } from "@/features/rentals/RentalUpdateDto";
import RentalUpdateForm from "@/features/rentals/RentalUpdateForm";


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
      const res = await RentalService.createInstance(rental.id);

      console.log(res)

      alert("Instance created successfully!")
    } catch (err) {
      console.error("Error creating instance: ", err);
      alert("Failed to create instance.");
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

  const handleSaveRental = async (updatedData: RentalUpdateDto) => {
    try {
      // console.log("UPDATED DATA: ", updatedData)
      await RentalService.updateRental(updatedData);
      handleSuccess();
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
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">RENTALS - {status}</h1>

      {/* Filter Buttons */}
      <div className="flex justify-between">
        <div className="flex gap-2 my-4">
        {(["ACTIVE", "CANCELLED", "COMPLETED"] as RentalStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded ${status === s ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {s}
          </button>
        ))}
        </div>
        <div className="flex gap-2 my-4">
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded bg-blue-600 text-white">
              New Rental
          </button>

          <RentalCreateForm 
            isOpen={showModal} 
            onClose={handleSubmit} 
          />
        </div>
      </div>

      {loading ? (
        <p>Loading {status} rentals...</p>
        ) : (
          <div className="grid grid-cols-1 gap-2">
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
            onSuccess={handleSaveRental}
          />
        )}
    </div>
  );
}