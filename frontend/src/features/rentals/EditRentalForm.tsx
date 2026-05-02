import { useEffect, useState } from "react";
import axiosClient from "@/context/axiosClient";
import type { RentalCreateDto } from "@/features/rentals/RentalCreateDto";

interface EditRentalFormProps {
  rentalId: string;
  initialData: RentalCreateDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditRentalForm({
  rentalId,
  initialData,
  onClose,
  onSuccess,
}: EditRentalFormProps) {
  const [formData, setFormData] = useState<RentalCreateDto>({
    agentId: "",
    address: "",
    tenantName: "",
    paymentDate: "",
    autoRenew: false,
    endDate: null,

    landlordName: "",
    landlordBankName: "",
    landlordAccNo: "",
    landlordBranch: "",

    baseRent: 0,
    rentalCommissionPercent: 0,
    officeSplit: 0,
    agentPaye: 0,

    vatRegistered: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axiosClient.put(
        `/rentals/${rentalId}`,
        formData
      );

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update rental", error);
    }
  };

  return (
    <div className="p-4 bg-card rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        Edit Rental
      </h2>

      <input
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        className="border p-2 w-full mb-2"
      />

      <input
        name="tenantName"
        value={formData.tenantName}
        onChange={handleChange}
        placeholder="Tenant Name"
        className="border p-2 w-full mb-2"
      />

      <button
        onClick={handleSubmit}
        className="bg-primary text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>

      <button
        onClick={onClose}
        className="ml-2 px-4 py-2 rounded border"
      >
        Cancel
      </button>
    </div>
  );
}