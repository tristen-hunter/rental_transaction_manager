export interface AgentReturnDto {
  id: string
  fullName: string;
  email: string;
  bankName: string;
  accountNumber: string;
  branchCode: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string; // ISO 8601 strings are standard for LocalDateTime
  lastModifiedBy: string;
  lastModifiedAt: string;
  totalRentals: number;
}