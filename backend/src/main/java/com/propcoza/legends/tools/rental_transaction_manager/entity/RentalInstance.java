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
@Table(name = "rental_instances")
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
    //     Monthly Financial Snapshot
    // -------------------------------
    // Note: We duplicate these from the Master so that changes to the Master
    // in the future don't change past payslips.

    @Column(name = "total_rent_received", precision = 19, scale = 2)
    private BigDecimal totalRentReceived;

    @Column(name = "company_comm", precision = 19, scale = 2)
    private BigDecimal companyComm;

    @Column(name = "agent_gross_comm", precision = 19, scale = 2)
    private BigDecimal agentGrossComm;

    @Column(name = "paye_amount", precision = 19, scale = 2)
    private BigDecimal payeAmount;

    @Column(name = "agent_nett_comm", precision = 19, scale = 2)
    private BigDecimal agentNettComm;

    @Column(name = "landlord_pay_amount", precision = 19, scale = 2)
    private BigDecimal landlordPayAmount;

    @Column(name = "vat", precision = 19, scale = 2)
    private BigDecimal vat;

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
    public Boolean isCommissionValid() {
        if (agentGrossComm == null || payeAmount == null || agentNettComm == null) {
            return true;
        }
        return agentGrossComm.subtract(payeAmount).compareTo(agentNettComm) == 0;
    }
}