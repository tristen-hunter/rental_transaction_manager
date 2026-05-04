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
import { toast } from "react-toastify";

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

          if(isMounted) toast.error("No Instances Found");
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

        toast.success("Instance Successfully Updated!")
    } catch (err) {
        toast.error("Instance Could Not Be Updated.")
        
        console.error("Failed to update instance:", err);
    }
  }

  const handleDelete = async (instanceId: string) => {
    try {
      await InstanceService.deleteInstance(instanceId);
      setRefresh(r => r + 1);
      toast.success("Instance Successfully Deleted!")
    } catch (error) {
      toast.error("Instance Could Not Be Deleted.")
      throw error;
    }
  }

  if (loading) return <div>Instances Loading...</div>

  return (
    <div>
      {/* 1. Sticky Header Section */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-t border-b border-border shadow-sm mb-6 px-4 sm:px-6">
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
              {rentalAddress}
            </h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
              Instances
            </p>
          </div>

        </div>
      </div>
      {rentalsInstances.length === 0 ? (
          <p>No instances belong to this rental</p>
      ): (
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-4 p-4 bg-muted rounded-lg border border-border">
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
                onDelete={() => handleDelete(instance.id)}
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