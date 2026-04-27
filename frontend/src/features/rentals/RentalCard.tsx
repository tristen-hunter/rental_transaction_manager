import { currency, Field, fmt, Section } from "@/components/global/DataCard";

export interface RentalBodyData {
  kind: "rental";
  // Collapsed preview
  startDate: string;
  // Expanded: tenant
  tenantName: string;
  endDate: string;
  // Expanded: landlord
  landlordName: string;
  landlordBankName: string;
  landlordAccNo: string;
  landlordBranch: string;
  // Expanded: commission
  baseRent: number;
  rentalCommissionPercent: number;
  officeSplit: number;
  agentSplit: number;
  agentPaye: number;
  vatRegistered: boolean;
  // Expanded: logging
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

function RentalExpanded({ data }: { data: RentalBodyData }) {
  return (
    <div className="px-3 pb-3 space-y-2">
      <Section title="TENANT INFO" />
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        <Field label="name"     value={data.tenantName} />
        <Field label="Start Date" value={fmt(data.startDate)} />
        <Field label="End Date"   value={fmt(data.endDate)} />
      </div>

      <Section title="Landlord" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <Field label="Name"        value={data.landlordName} />
        <Field label="Bank"        value={data.landlordBankName} />
        <Field label="Account No." value={data.landlordAccNo} />
        <Field label="Branch"      value={data.landlordBranch} />
      </div>

      <Section title="Commission Breakdown" />
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        <Field label="Base Rent"       value={currency(data.baseRent)} />
        <Field label="Commission %"    value={`${data.rentalCommissionPercent*100}%`} />
        <Field label="Office Split"    value={`${data.officeSplit*100}%`} />
        <Field label="Agent Split"     value={`${data.agentSplit*100}%`} />
        <Field label="Agent PAYE"      value={`${data.agentPaye*100}%`} />
        <Field label="VAT Registered"  value={data.vatRegistered ? "Yes" : "No"} />
      </div>

      <Section title="Log" />
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        <Field label="Created By" value={data.createdBy} />
        <Field label="Created"    value={fmt(data.createdAt)} />
        <Field label="Updated"    value={fmt(data.updatedAt)} />
      </div>
    </div>
  );
}