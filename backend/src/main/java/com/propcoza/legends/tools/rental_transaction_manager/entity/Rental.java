package com.propcoza.legends.tools.rental_transaction_manager.entity;

import com.propcoza.legends.tools.rental_transaction_manager.common.config.Auditable;
import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "rentals")
public class Rental extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    /**
     * This establishes the FK relationship with the agents table.
     * The entity is passed because we are using an ORM
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private Agent agent;

    // -------------------------------
    //    Meta Data for the Rental
    // -------------------------------
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
    private LocalDate startDate; // This is set to the initial payment data

    @Column(name = "end_date")
    private LocalDate endDate; // This is set to the last RentalInstance payment date

    /**
     * This bool is to determine which instances must be created by the cron job
     * Can only be manually deactivated
     */
    @Column(name = "auto_renew", nullable = false)
    private Boolean autoRenew = true;

    /**
     * Here we can visually represent the MASTER templates use case
     * ACTIVE - name suggests
     * CANCELLED - this rental was specifically canceled due to something (Admin will explain)
     * COMPLETE - this rental reached the end of it's contract
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RentalStatus status = RentalStatus.ACTIVE;

    // -------------------------------
    //     Landlord Info
    // -------------------------------
    @Column(name = "landlord_name")
    private String landlordName;

    @Column(name = "landlord_bank_name")
    private String landlordBankName;

    @Column(name = "landlord_acc_no")
    private String landlordAccNo;

    @Column(name = "landlord_branch")
    private String landlordBranch;

    // -------------------------------
    //     Commission Data
    // -------------------------------
    // NOTE: this data is entered by Fatima and used to calculate the financials.
    //       warnings must be given if they don't meet certain criteria

    /// the rent amount paid every month (used to calculate payouts)
    @Column(name = "base_rent", precision = 19, scale = 2)
    private BigDecimal baseRent; // used to calculate comm and landlord portion

    @Column(name = "rental_commission_percent", precision = 5, scale = 4)
    private BigDecimal rentalCommissionPercent; // for example 0.1

    @Column(name = "office_split", precision = 5, scale = 4)
    private BigDecimal officeSplit; // office portion as a decimal, 0.3 (usually 30%)

    @Column(name = "agent_split", precision = 5, scale = 4)
    private BigDecimal agentSplit; // 1 - officeSplit

    @Column(name = "agent_paye", precision = 5, scale = 4)
    private BigDecimal agentPaye;

    @Column(name = "vat_registered")
    private Boolean vatRegistered = true;


    // Inside Rental.java
    @OneToMany(mappedBy = "rental", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RentalInstance> instances = new ArrayList<>();


    /// run when values are entered to ensure they add up to 1 (100%)
    @AssertTrue(message = "Office Split and Agent split must add up to 100%")
    public boolean isOfficeSplitValid() {
        if (officeSplit == null || agentSplit == null) {
            return true; // let @NotNull handle null validation
        }

        BigDecimal total = officeSplit.add(agentSplit);
        return total.compareTo(BigDecimal.ONE) == 0;
    }
}