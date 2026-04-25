export type RentalStatus = "ACTIVE" | "CANCELLED" | "COMPLETED";

export interface RentalReturnDto {
  // -------------------------------
  // Identity
  // -------------------------------
  id: string; // UUID

  // -------------------------------
  // Agent Summary (flattened)
  // -------------------------------
  agentId: string; // UUID
  agentName: string;

  // -------------------------------
  // Meta Data
  // -------------------------------
  address: string;
  tenantName: string;
  paymentDate: string; // LocalDate (ISO format: yyyy-MM-dd)

  // -------------------------------
  // Recurring Rental Fields
  // -------------------------------
  startDate: string; // LocalDate
  endDate: string; // LocalDate
  autoRenew: boolean;
  status: RentalStatus;

  // -------------------------------
  // Landlord Info
  // -------------------------------
  landlordName: string;
  landlordBankName: string;
  landlordAccNo: string;
  landlordBranch: string;

  // -------------------------------
  // Commission Inputs
  // (returned so the UI can pre-fill edit forms)
  // -------------------------------
  baseRent: number; // BigDecimal
  rentalCommissionPercent: number;
  officeSplit: number;
  agentSplit: number;
  agentPaye: number;
  vatRegistered: boolean;

  // -------------------------------
  // Audit
  // -------------------------------
  createdBy: string;
  createdAt: string; // LocalDateTime (ISO format)
  updatedAt: string; // LocalDateTime (ISO format)
}