// export enum RentalStatus {
//   ACTIVE = 'ACTIVE',
//   CANCELLED = 'CANCELLED',
//   COMPLETE = 'COMPLETE'
// }

export interface RentalUpdateDto {
  id?: string;
  agentId?: string;
  address?: string;
  tenantName?: string;
  paymentDate?: string;
  startDate?: string;
  endDate?: string | null;
  autoRenew: boolean;
  status: string;
  landlordName?: string;
  landlordBankName?: string;
  landlordAccNo?: string;
  landlordBranch?: string;
  baseRent?: number;
  rentalCommissionPercent: number;
  officeSplit: number;
  agentSplit: number;
  agentPaye: number;
  vatRegistered: boolean;
  lastModifiedAT?: string;
  lastModifiedBy?: string;
}