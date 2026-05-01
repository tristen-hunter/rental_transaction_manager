import { Breadcrumbs } from "@/components/global/BreadCrumbs";
import axiosClient from "@/context/axiosClient";
import { InstanceCard, type InstanceBodyData } from "@/features/instances/InstanceCard";
import { type InstanceReturnDto } from "@/features/instances/InstanceReturnDto";
import { InstanceService } from "@/features/instances/InstanceService";
import type { InstanceUpdateDto } from "@/features/instances/InstanceUpdateDto";
import InstanceUpdateForm from "@/features/instances/InstanceUpdateForm";
import type { RentalReturnDto } from "@/features/rentals/rental";
import { RentalService } from "@/features/rentals/RentalService";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"

export default function RentalsInstances() {
    const { rentalId } = useParams<({ rentalId: string })>(); 
    const [rentalsInstances, setRentalsInstances] = useState<InstanceReturnDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeRentals, setActiveRentals] = useState<RentalReturnDto[]>([]);
    const [refresh, setRefresh] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    const rentalAddress = location.state?.rentalAddress || "Rental";

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
    }, [rentalId, refresh])

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

    const [selectedInstance, setSelectedInstance] = useState<InstanceBodyData | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleEdit = (instance: InstanceBodyData) => {
        setSelectedInstance(instance);
        setIsEditOpen(true);
    }

    const handleClose = () => {
        setIsEditOpen(false);
        setSelectedInstance(null);
    };

    const handleSuccess=() => {
      console.log()
      setRefresh(r => r + 1);
      handleClose();
    }

    /** Handles API Call */
  const handleSaveInstance = async (updatedData: InstanceUpdateDto) => {
    try {
        await InstanceService.updateInstance(updatedData);
        handleSuccess();
    } catch (err) {
        console.error("Failed to update instance:", err);
    }
  }

  if (loading) return <div>Instances Loading...</div>

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
      <div className="text-xl font-bold mb-4 uppercase">{rentalAddress} - INSTANCES</div>
      {rentalsInstances.length === 0 ? (
          <p>No instances belong to this rental</p>
      ): (
        <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {rentalsInstances.map((instance) => {
            const rental = rentalMap.get(instance.rentalId);
            return (
              <InstanceCard
                key={instance.id}
                instance={instance}
                address={rental?.address ?? "No Address Found"} // Add rental data here
                agentName={"Payment Data: " + rental?.paymentDate || "none found"} // Add rental data here
                status={instance.status}

                onEdit={() => handleEdit(instance)}
                onSetStatus={(data: InstanceBodyData) => console.log("Set Status", data.id)}
                onDelete={(data: InstanceBodyData) => console.log("Delete", data.id)}
              />
            );
          })}
        </div>
      )}

      {isEditOpen && selectedInstance && (
        <InstanceUpdateForm
          instance={selectedInstance}
          rental={rentalMap.get(selectedInstance.rentalId)}
          onClose={handleClose}
          onSuccess={handleSaveInstance}
        />
      )}

    </div>
  )
}