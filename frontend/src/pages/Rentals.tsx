import { useEffect, useState } from "react";
import axiosClient from "../context/axiosClient";
import type { RentalReturnDto, RentalStatus } from "../features/rentals/rental";

export default function Rentals() {
  const [rentals, setRentals] = useState<RentalReturnDto[]>([]);
  const [status, setStatus] = useState<RentalStatus>("ACTIVE") // default
  const [loading, setLoading] = useState(false);

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
    <div className="p-4">
      <h1 className="text-2xl font-bold">Rentals</h1>

      {/* Filter Buttons */}
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

      {loading ? (
        <p>Loading {status} rentals...</p>
      ) : (
        <ul>
          {rentals.map((rental) => (
            <li key={rental.id} className="border-b py-2">
              {rental.address} - <strong>{rental.status}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}