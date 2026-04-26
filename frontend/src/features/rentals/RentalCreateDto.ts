export interface RentalCreateDto {
    agentId: string;
    address: string;
    tenantName: string;
    paymentDate: string; // yyyy-MM-dd
    autoRenew: boolean;
    endDate?: string | null;

    landlordName: string;
    landlordBankName: string;
    landlordAccNo: string;
    landlordBranch: string;

    baseRent: number;
    rentalCommissionPercent: number;
    officeSplit: number;
    agentPaye: number;

    vatRegistered: boolean;
    createdBy: string;
}