export type InstanceStatus = "APPROVED" | "CANCELLED" | "DRAFT";


export interface InstanceReturnDto {
  id: string;
  rentalId: string;
  billingPeriod: string;
  actualPaymentDate: string;

  // -------------------------------
  //     Commission Percentages
  // -------------------------------

  rentalCommissionPercent: number;
  officeSplit: number;
  agentSplit: number;
  agentPaye: number;
  vatRegistered: boolean;

  // -------------------------------
  //     Financial Snapshot
  // -------------------------------

  baseRent: number;
  totalAmountPaid: number;
  landlordPayAmount: number;
  baseComm: number;
  vat: number;
  commExclVat: number;
  companyComm: number;
  agentGrossComm: number;
  payeAmount: number;
  agentNettComm: number;

  // -------------------------------
  //     Lease Fee
  // -------------------------------

  leaseFee: number;
  leaseFeeAgentPortion: number;
  leaseFeeOfficePortion: number;

  // -------------------------------
  //     Optional Manual Entries
  // -------------------------------

  deposit: number;

  // -------------------------------
  //     Instance Metadata
  // -------------------------------

  status: string;
  createdBy: string;
  createdAt: string; // LocalDateTime (ISO format)
  lastModifiedBy: string; // LocalDateTime (ISO format)
  lastModifiedAt: string; // LocalDateTime (ISO format)
}