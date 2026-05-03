package com.propcoza.legends.tools.rental_transaction_manager.entity;

import com.propcoza.legends.tools.rental_transaction_manager.common.config.Auditable;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(
        name = "rental_instances",
        uniqueConstraints = @UniqueConstraint(columnNames = {"rental_id", "billing_period"})
)
public class RentalInstance extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    /**
     * The Master Rental record this instance belongs to.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rental_id", nullable = false)
    private Rental rental;

    /**
     * The specific month and year this payslip/instance represents.
     * Usually the first day of the month (e.g., 2026-05-01).
     */
    @Column(name = "billing_period", nullable = false)
    private LocalDate billingPeriod;

    /**
     * The date the actual payment was processed for this specific month.
     */
    @Column(name = "actual_payment_date")
    private LocalDate actualPaymentDate;

    // -------------------------------
    //     Commission ratio Percentages
    // -------------------------------
    // Note: We duplicate these from the Master so that changes to the Master
    // in the future don't change past payslips.

    @Min(value = 0, message = "Commission cannot be negative")
    @Max(value = 1, message = "Commission cannot exceed 100%")
    @Column(name = "rental_commission_percent", precision = 5, scale = 4)
    private BigDecimal rentalCommissionPercent; // for example 10%

    @Column(name = "office_split", precision = 5, scale = 4)
    private BigDecimal officeSplit; // office portion as a percentage (usually 30%)

    @Column(name = "agent_split", precision = 5, scale = 4)
    private BigDecimal agentSplit;

    @Column(name = "agent_paye", precision = 5, scale = 4)
    private BigDecimal agentPaye;


    // -------------------------------
    //     Monthly Financial Snapshot (Calculated for the user, with manual override possible)
    // -------------------------------

    /// = baseRent + all adjustments (such as a deposit or lease fee)
    @Column(name = "total_amount_paid", precision = 19, scale = 2)
    private BigDecimal totalAmountPaid; // totalRentReceived + adjustments

    /// the rent amount paid every month (used to calculate payouts)
    @NotNull(message = "Base rent is required")
    @PositiveOrZero(message = "Base rent cannot be negative")
    @Column(name = "base_rent", precision = 19, scale = 2, nullable = false)
    private BigDecimal baseRent;

    /// = baseRent - comm (10% + VAT, usually)
    @Column(name = "landlord_pay_amount", precision = 19, scale = 2)
    private BigDecimal landlordPayAmount;

    /// = baseRent * (comm structure (usually 10% + VAT))
    @Column(name = "total_comm", precision = 19, scale = 2)
    private BigDecimal baseComm; // commission + VAT

    /// = baseComm - (baseComm / 1.15)
    @Column(name = "vat", precision = 19, scale = 2)
    private BigDecimal vat; // sometimes not included based on seller profile

    /// = baseComm - VAT
    @Column(name = "comm_excl_vat", precision = 19, scale = 2)
    private BigDecimal commExclVat; // if VAT = 0; then baseComm == commExclVat

    /// = commExclVat * officeSplit
    @Column(name = "company_comm", precision = 19, scale = 2)
    private BigDecimal companyComm;

    /// = commExclVat * (1-officeSplit)
    @Column(name = "agent_gross_comm", precision = 19, scale = 2)
    private BigDecimal agentGrossComm;

    /// = agentGrossComm * agentPaye
    @Column(name = "paye_amount", precision = 19, scale = 2)
    private BigDecimal payeAmount;

    /// agentGrossComm - payeAmount
    @Column(name = "agent_nett_comm", precision = 19, scale = 2)
    private BigDecimal agentNettComm;

    ///  manually entered by Fatima (split 50/50)
    @Column(name = "lease_fee", precision = 19, scale = 2)
    private BigDecimal leaseFee; // manually entered by Fatima

    @Column(name = "lease_fee_agent_portion", precision = 19, scale = 2)
    private BigDecimal leaseFeeAgentPortion;

    @Column(name = "lease_fee_office_portion", precision = 19, scale = 2)
    private BigDecimal leaseFeeOfficePortion;

    @PositiveOrZero(message = "Deposit cannot be negative")
    @Column(name = "deposit", precision = 19, scale = 2)
    private BigDecimal deposit;
    // -------------------------------
    //     Instance Specific Data
    // -------------------------------

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InstanceStatus status = InstanceStatus.DRAFT;

    /**
     * Monthly adjustments (e.g., one-off repairs or bonuses)
     * should ideally be linked here instead of the Master.
     */
    @OneToMany(mappedBy = "rentalInstance", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Adjustment> adjustments = new ArrayList<>();

    @OneToMany(mappedBy = "rentalInstance", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Note> notes = new ArrayList<>();

    // -------------------------------
    //     Logic & Validation
    // -------------------------------

    @AssertTrue(message = "Lease fee portions must sum to total lease fee")
    public boolean isLeaseFeeValid() {
        if (leaseFee == null || leaseFeeAgentPortion == null || leaseFeeOfficePortion == null) {
            return true;
        }
        return leaseFeeAgentPortion.add(leaseFeeOfficePortion).compareTo(leaseFee) == 0;
    }

    @AssertTrue(message = "Commission excl. VAT must equal the sum of agent gross commission and company commission")
    public boolean isCompanyAndAgentCommValid() {
        if (commExclVat == null || agentGrossComm == null || companyComm == null) {
            return true;
        }
        return commExclVat.compareTo(agentGrossComm.add(companyComm)) == 0;
    }

    @AssertTrue(message = "Base commission must equal commission excl. VAT plus VAT")
    public boolean isBaseCommValid() {
        if (baseComm == null || commExclVat == null || vat == null) {
            return true;
        }
        return baseComm.compareTo(commExclVat.add(vat)) == 0;
    }

    @AssertTrue(message = "Agent gross commission must equal agent nett commission plus PAYE amount")
    public boolean isAgentNettCommValid() {
        if (agentGrossComm == null || agentNettComm == null || payeAmount == null) {
            return true;
        }
        return agentGrossComm.compareTo(agentNettComm.add(payeAmount)) == 0;
    }

    @AssertTrue(message = "Base rent must equal the landlord payout plus base commission")
    public boolean isBaseRentValid() {
        if (baseRent == null || landlordPayAmount == null || baseComm == null) {
            return true;
        }
        return baseRent.compareTo(landlordPayAmount.add(baseComm)) == 0;
    }


    // Helper methods
    public void addAdjustment(Adjustment adj) {
        adjustments.add(adj);
        adj.setRentalInstance(this);
    }

    public void addNote(Note note) {
        notes.add(note);
        note.setRentalInstance(this);
    }
}