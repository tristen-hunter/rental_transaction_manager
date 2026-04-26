import { useEffect, useState } from "react";
import axiosClient from "../context/axiosClient";
import type { RentalReturnDto, RentalStatus } from "../features/rentals/rental";
import DataCard from "@/components/global/DataCard";
import { Home } from 'lucide-react';
import RentalCreateForm from "@/features/rentals/RentalCreateForm";


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


  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">Rentals</h1>

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
            <DataCard
              key={rental.id}
              title={rental.address}
              subtitle={rental.tenantName}
              status={rental.status}
              icon={Home}
              body={{
                kind: "rental",
                startDate: rental.startDate,
                endDate: rental.endDate,
                tenantName: rental.tenantName,
                landlordName: rental.landlordName,
                landlordBankName: rental.landlordBankName,
                landlordAccNo: rental.landlordAccNo,
                landlordBranch: rental.landlordBranch,
                baseRent: rental.baseRent,
                rentalCommissionPercent: rental.rentalCommissionPercent,
                officeSplit: rental.officeSplit,
                agentSplit: rental.agentSplit,
                agentPaye: rental.agentPaye,
                vatRegistered: rental.vatRegistered,
                createdBy: rental.createdBy,
                createdAt: rental.createdAt,
                updatedAt: rental.updatedAt,
              }}
              onEdit={() => console.log("Edit", rental.id)}
              onDelete={() => console.log("Delete", rental.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}