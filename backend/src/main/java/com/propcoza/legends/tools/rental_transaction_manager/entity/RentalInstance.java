package com.propcoza.legends.tools.rental_transaction_manager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
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
        uniqueConstraints = @UniqueConstraint(columnNames = {"status", "actual_payment_date"})
)
public class RentalInstance {

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

    @Column(name = "rental_commision_percent")
    private double rentalCommissionPercent; // for example 10%

    @Column(name = "office_split")
    private double officeSplit; // office portion as a percentage (usually 30%)

    @Column(name = "agent_split")
    private double agentSplit;

    @Column(name = "agent_paye")
    private double agentPaye;


    // -------------------------------
    //     Monthly Financial Snapshot (Calculated for the user, with manual over ride possible)
    // -------------------------------

    /// = baseRent + all adjustments (such as a deposit or lease fee)
    @Column(name = "total_amount_paid", precision = 19, scale = 2)
    private BigDecimal totalAmountPaid; // totalRentReceived + adjustments

    /// the rent amount paid every month (used to calculate payouts)
    @Column(name = "base_rent", precision = 19, scale = 2)
    private BigDecimal baseRent; // used to calculate comm and landlord portion

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

    @Column(name = "lease_fee_agent_portion")
    private BigDecimal leaseFeeAgentPortion; // 50% to agent
    @Column(name = "lease_fee_office_portion")
    private BigDecimal leaseFeeOfficePortion; // 50% to office


    /// this is manually entered if there is one
    @Column(name = "deposit", precision = 19, scale = 2)
    private BigDecimal deposit; // part of totalAmountPayed (NOT baseRent)

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

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // -------------------------------
    //     Logic & Validation
    // -------------------------------

    @AssertTrue(message = "Commission values inconsistent for this instance")
    public boolean isCommissionValid() {
        if (agentGrossComm == null || payeAmount == null || agentNettComm == null) {
            return true;
        }
        return agentGrossComm.subtract(payeAmount).compareTo(agentNettComm) == 0;
    }

    @AssertTrue(message = "Lease fee portions must sum to total lease fee")
    public boolean isLeaseFeeValid() {
        if (leaseFee == null || leaseFeeAgentPortion == null || leaseFeeOfficePortion == null) {
            return true;
        }
        return leaseFeeAgentPortion.add(leaseFeeOfficePortion).compareTo(leaseFee) == 0;
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