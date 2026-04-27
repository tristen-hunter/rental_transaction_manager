import { useEffect, useState } from "react";
import axiosClient from "../context/axiosClient";
import type { RentalReturnDto, RentalStatus } from "../features/rentals/rental";
import RentalCreateForm from "@/features/rentals/RentalCreateForm";
import { RentalCard, type RentalBodyData } from "@/features/rentals/RentalCard";
import { RentalService } from "@/features/rentals/RentalService";


export default function Rentals() {
  const [rentals, setRentals] = useState<RentalReturnDto[]>([]);
  const [status, setStatus] = useState<RentalStatus>("ACTIVE") // default
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
  }, [status]) 

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
            onClose={() => setShowModal(false)} 
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
                
                // Connect the specific actions
                onEdit={() => console.log("Edit", rental.address)}
                onDelete={(data) => console.log("Delete", data.tenantName)}
                onSetStatus={(data) => console.log("Update Status", data.tenantName)}
                onCreateInstance={handleCreateInstance}
              />
            ))}
          </div>
        )}
    </div>
  );
}