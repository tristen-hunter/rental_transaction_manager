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
@Table(name = "rentals")
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    // Establishing the Foreign Key relationship to the Agent entity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private Agent agent;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String address;

    @Column(name = "tenant_name")
    private String tenantName;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    // -------------------------------
    //    Recurring Rental Fields
    // -------------------------------

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate; // This is set to the last RentalInstance payment date

    @Column(name = "auto_renew", nullable = false)
    private Boolean autoRenew = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RentalStatus status = RentalStatus.ACTIVE;

    // -------------------------------
    //     Financial Data
    // -------------------------------

    @Column(name = "total_rent_received", precision = 19, scale = 2)
    private BigDecimal totalRentReceived;

    @Column(name = "landlord_name")
    private String landlordName;

    @Column(name = "landlord_bank_name")
    private String landlordBankName;

    @Column(name = "landlord_acc_no")
    private String landlordAccNo;

    @Column(name = "landlord_branch")
    private String landlordBranch;

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
    //     Logging Data
    // -------------------------------

    @Column(name = "created_by")
    private String createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    /**
     * Ensures startDate is always synchronized with paymentDate
     * before the record is created.
     */
    @PrePersist
    protected void onCreate() {
        if (this.startDate == null) {
            this.startDate = this.paymentDate;
        }

        // Ensure initial financial calculations aren't null if preferred
        if (this.totalRentReceived == null) {
            this.totalRentReceived = BigDecimal.ZERO;
        }
    }


    // When a rental is deleted all data that was related to it must be deleted as well (notes and adjustments)
    @OneToMany(mappedBy = "rental", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Adjustment> adjustments = new ArrayList<>();

    @OneToMany(mappedBy = "rental", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Note> notes = new ArrayList<>();

    public void addAdjustment(Adjustment adjustment) {
        adjustments.add(adjustment);
        adjustment.setRental(this);
    }
    // validates if *Gross Comm = nett + paye*
    @AssertTrue(message = "Commission values inconsistent")
    public Boolean isCommissionValid(){
        if (agentGrossComm == null || payeAmount == null || agentNettComm == null) {
            return true; // handled by @NotNull
        }
        return agentGrossComm.subtract(payeAmount).compareTo(agentNettComm) == 0;
    }
}