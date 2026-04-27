import axiosClient from "@/context/axiosClient";
import { InstanceCard, type InstanceBodyData } from "@/features/instances/InstanceCard";
import { type InstanceReturnDto, type InstanceStatus } from "@/features/instances/InstanceReturnDto";
import { type RentalReturnDto } from "@/features/rentals/rental";
import { useEffect, useState } from "react";

export default function Pending() {
  const [instances, setInstances] = useState<InstanceReturnDto[]>([]);
  const [activeRentals, setActiveRentals] = useState<RentalReturnDto[]>([])
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<InstanceStatus>("DRAFT");

  useEffect(() => {
    setLoading(true);

    axiosClient.get<InstanceReturnDto[]>("/instances", {
      params: { status: status }
    })
    .then((res) => {
      setInstances(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [status]);

  /// Get ALL active rentals (for address and meta data)
  useEffect(() => {
    axiosClient.get<RentalReturnDto[]>("/rentals", {
      params: { status: "ACTIVE"}
    })
    .then((res) => {
      setActiveRentals(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
  }, [status])

  /// Builds a dict map: O(1)
  const rentalMap = new Map(
    activeRentals.map((rental) => [rental.id, rental])
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">PENDING APPROVAL</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2 my-4">
        {(["APPROVED", "DRAFT", "CANCELLED"] as InstanceStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded ${status === s ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading {status} instances...</p>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {instances.map((instance) => {
            const rental = rentalMap.get(instance.rentalId);
            return (
              <InstanceCard
                key={instance.id}
                instance={instance}
                address={rental?.address ?? "No Address Found"} // Add rental data here
                agentName={rental?.agentName ?? "No Agent Found"} // Add rental data here
                status={instance.status}

                onEdit={(data: InstanceBodyData) => console.log("Edit", data.id)}
                onSetStatus={(data: InstanceBodyData) => console.log("Set Status", data.id)}
                onDelete={(data: InstanceBodyData) => console.log("Delete", data.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}