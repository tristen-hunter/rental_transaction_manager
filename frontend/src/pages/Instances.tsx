import axiosClient from "@/context/axiosClient";
import { InstanceCard, type InstanceBodyData } from "@/features/instances/InstanceCard";
import { type InstanceReturnDto, type InstanceStatus } from "@/features/instances/InstanceReturnDto";
import { InstanceService } from "@/features/instances/InstanceService";
import type { InstanceUpdateDto } from "@/features/instances/InstanceUpdateDto";
import InstanceUpdateForm from "@/features/instances/InstanceUpdateForm";
import { type RentalReturnDto } from "@/features/rentals/rental";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function Instances() {
  const [instances, setInstances] = useState<InstanceReturnDto[]>([]);
  const [activeRentals, setActiveRentals] = useState<RentalReturnDto[]>([])
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<InstanceStatus>("DRAFT");
  const [refresh, setRefresh] = useState(0);

  /// Gets all instances by status
  useEffect(() => {
    setLoading(true);

    axiosClient.get<InstanceReturnDto[]>("/instances", {
      params: { status: status }
    })
    .then((res) => {
      setInstances(res.data);
      // console.log(res.data);  // FOR CHECKING THE RETURN DATA FROM THE DB
      
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [status, refresh]);

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


  /**
   * States used to toggle the edit form
   */
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
    setRefresh(r => r + 1);
    handleClose();
  }

  /** Handles API Call */
  const handleSaveInstance = async (instanceId: string, updatedData: InstanceUpdateDto) => {
    try {
      console.log(updatedData)
      await InstanceService.updateInstance(instanceId, updatedData);

      handleSuccess();
      toast.success("Instance Successfully Updated!")
    } catch (err) {
      console.error("Failed to update instance:", err);
      toast.error("Instance Could Not Be Updated.")
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

  const handleBulkGenerate = async () => {
    try {
        await InstanceService.bulkGenerateForActiveRentals();
        setRefresh(r => r + 1);
    } catch (err) {
        toast.error("Bulk generation failed");
    }
  };


  const groupedInstances = useMemo(() => {
    // 1. First, enrich instances with data from the rentalMap
    const enrichedInstances = instances.map(instance => {
      const rental = rentalMap.get(instance.rentalId);
      return {
        ...instance,
        // Use fallback strings so the grouping doesn't break if a rental isn't found
        address: rental?.address ?? "Unknown Address",
        agentName: rental?.agentName ?? "Unassigned Agent"
      };
    });
    // 2. Now run the reduce logic on the enriched data
    return enrichedInstances.reduce((acc, instance) => {
      const date = new Date(instance.billingPeriod);
      const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });

      if (!acc[monthKey]) acc[monthKey] = {};
      if (!acc[monthKey][instance.agentName]) acc[monthKey][instance.agentName] = [];

      acc[monthKey][instance.agentName].push(instance);
      
      return acc;
    }, {} as Record<string, Record<string, any[]>>);
  }, [instances, activeRentals]);

  if (loading) return <div>Instances Loading...</div>

  return (
    <div className="mx-auto">
      {/* 1. Sticky Header Section */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-t border-b border-border shadow-sm mb-6 px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3 max-w-6xl mx-auto">
          
          {/* Left side: Heading & Subheading */}
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl uppercase">
              Instances - {status.toLowerCase()}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage, filter, and track instance statuses
            </p>
          </div>

          {/* Right side: Empty or reserved space since there's no action button */}
        </div>
      </div>

      {/* 2. Filter Buttons Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-wrap gap-2">
          {(["APPROVED", "DRAFT", "CANCELLED"] as InstanceStatus[]).map((s) => (
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
          <button onClick={handleBulkGenerate}>Bulk generate Instances</button>
        </div>
      </div>

      {loading ? (
        <p>Loading {status} instances...</p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-12">
          {/* 1. Sort the months chronologically (Newest Month at the top) */}
          {Object.keys(groupedInstances)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map((month) => {
              const agents = groupedInstances[month];

              return (
                <div key={month} className="space-y-6">
                  {/* Level 1: Month Heading (Billing Period) */}
                  <h2 className="text-lg font-bold border-b pb-2 text-foreground uppercase tracking-widest">
                    {month}
                  </h2>

                  {/* Level 2: Group by Agent Name within that Month */}
                  {Object.entries(agents).map(([agentName, agentInstances]) => (
                    <div key={agentName} className="pl-4 border-l-2 border-accent/20 space-y-3">
                      <h3 className="text-sm font-semibold text-primary/80 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        Agent: {agentName}
                      </h3>

                      {/* Level 3: The Instance Cards */}
                      <div className="grid grid-cols-1 gap-3">
                        {agentInstances.map((instance) => (
                          <InstanceCard
                            key={instance.id}
                            instance={instance}
                            // These fields come from the 'enriched' data in your useMemo
                            address={instance.address ?? "No Address Found"} 
                            agentName={instance.agentName ?? "No Agent Found"}
                            status={instance.status}
                            
                            onEdit={() => handleEdit(instance)}
                            onSetStatus={(data) => console.log("Set Status", data.id)}
                            onDelete={() => handleDelete(instance.id)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
        </div>
      )}

      {isEditOpen && selectedInstance && (
        <InstanceUpdateForm
          instance={selectedInstance}
          rental={rentalMap.get(selectedInstance.rentalId)}
          onClose={handleClose}
          onSuccess={(id, dto) => handleSaveInstance(id, dto)}
        />
      )}
    </div>
  );
}