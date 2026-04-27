import axiosClient from "@/context/axiosClient";
import { type InstanceReturnDto } from "@/features/instances/InstanceReturnDto";
import { useEffect, useState } from "react";

export default function Pending() {
  const [instances, setInstances] = useState<InstanceReturnDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [status] = useState("DRAFT")
  // const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    axiosClient.get<InstanceReturnDto[]>("/instances", {
      params: { status: status}
    })
    .then((res) => {
      console.log(res.data)
      setInstances(res.data);

      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });

  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold">Pending Page</h1>
      {loading ? (
      <p>Loading Instances...</p>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {instances.map((instance) => (
            instance.baseRent
          ))}
        </div>
      )}
    </div>
  );
}