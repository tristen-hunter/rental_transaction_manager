export interface InstanceUpdateDto {
    /// Metadata
    id: string;
    rentalId: string;
    billingPeriod: string;
    actualPaymentDate: string;

    /// Input numbers
    rentalCommissionPercent: number;
    officeSplit: number;
    agentSplit: number;
    agentPaye: number;
    totalAmountPaid: number;
    baseRent: number;

    /// Calculated totals
    landlordPayAmount: number;
    baseComm: number;
    vat: number;
    commExclVat: number;
    companyComm: number;
    agentGrossComm: number;
    payeAmount: number;
    agentNettComm: number;

    /// Once off
    leaseFee: number;
    leaseFeeAgentPortion: number;
    leaseFeeOfficePortion: number;
    deposit: number;

    /// Logging & sorting
    status: string;
    createdAt: string;
    updatedAt: string;
}