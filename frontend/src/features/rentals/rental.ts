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
  leasePeriod: number;
  status: RentalStatus;

  lastBilledPeriod?: string; // "2026-04-01" - populate from backend
  instanceCount?: number;

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
  lastModifiedBy: string; // LocalDateTime (ISO format)
  lastModifiedAt: string; // LocalDateTime (ISO format)
}