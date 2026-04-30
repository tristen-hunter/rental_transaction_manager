import axiosClient from "@/context/axiosClient";
import { InstanceCard, type InstanceBodyData } from "@/features/instances/InstanceCard";
import { type InstanceReturnDto } from "@/features/instances/InstanceReturnDto";
import type { RentalReturnDto } from "@/features/rentals/rental";
import { RentalService } from "@/features/rentals/RentalService";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

export default function RentalsInstances() {
    const { rentalId } = useParams<({ rentalId: string })>(); 
    const [rentalsInstances, setRentalsInstances] = useState<InstanceReturnDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeRentals, setActiveRentals] = useState<RentalReturnDto[]>([]);

    const navigate = useNavigate();

    /**
     * Fetches Instances and saves them to rentalInstances
     * Runs when rentalId is updated
     */
    useEffect(() => {
        if (!rentalId) return;

        let isMounted = true;
        setLoading(true);

        const loadInstances = async () => {
            try {
                const response = await RentalService.fetchRentalsInstances(rentalId);
                if (isMounted) {
                    setRentalsInstances(response);
                }
            } catch (err) {
                console.error("Failed to find Instances");

                if(isMounted) alert("No Instances Found");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadInstances();

        return () => {
            isMounted = false;
        }
    }, [rentalId])

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
  }, [])

  /// Builds a dict map: O(1)
  const rentalMap = new Map(
    activeRentals.map((rental) => [rental.id, rental])
  );

    if (loading) return <div>Instances Loading...</div>

    return (
        <div className="max-w-6xl mx-auto">
            <button onClick={() => navigate(-1)} className="text-blue-600 mb-4 hover:cursor-pointer">
                <ArrowLeft />
            </button>
            <div className="text-xl font-bold mb-4">RENTALS INSTANCES</div>
            {rentalsInstances.length === 0 ? (
                <p>No instances belong to this rental</p>
            ): (
                <div className="grid grid-cols-1 gap-2">
                    {rentalsInstances.map((instance) => {
                        const rental = rentalMap.get(instance.rentalId);
                        return (
                            <InstanceCard
                                key={instance.id}
                                instance={instance}
                                address={rental?.address ?? "No Address Found"} // Add rental data here
                                agentName={rental?.agentName ?? "No Agent Found"} // Add rental data here
                                status={instance.status}
                
                                onEdit={() => console.log("I AM NOT FINISHED!")}
                                onSetStatus={(data: InstanceBodyData) => console.log("Set Status", data.id)}
                                onDelete={(data: InstanceBodyData) => console.log("Delete", data.id)}
                            />
                        )
                })}
                </div>
            )}
        </div>
    )
}