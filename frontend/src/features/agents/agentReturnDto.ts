export interface AgentReturnDto {
  id: string; // UUIDs are handled as strings in TS
  fullName: string;
  email: string;
  bankName: string;
  accountNumber: string;
  branchCode: string;
  isActive: boolean;
  createdAt: string; // ISO 8601 strings are standard for LocalDateTime
  updatedAt: string;
  totalRentals: number;
}