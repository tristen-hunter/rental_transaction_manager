// export enum RentalStatus {
//   ACTIVE = 'ACTIVE',
//   CANCELLED = 'CANCELLED',
//   COMPLETE = 'COMPLETE'
// }

export interface RentalUpdateDto {
  agentId?: string;

  address?: string;
  tenantName?: string;
  paymentDate?: string;

  leasePeriod: number;
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
}