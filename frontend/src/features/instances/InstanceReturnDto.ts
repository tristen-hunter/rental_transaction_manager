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
  agentPaye: number;

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
  createdAt: string;
  updatedAt: string;
}