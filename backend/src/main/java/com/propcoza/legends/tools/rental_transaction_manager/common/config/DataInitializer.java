//package com.propcoza.legends.tools.rental_transaction_manager.common.config;
//
//import com.propcoza.legends.tools.rental_transaction_manager.entity.Agent;
//import com.propcoza.legends.tools.rental_transaction_manager.entity.Rental;
//import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalStatus;
//import com.propcoza.legends.tools.rental_transaction_manager.repo.AgentRepo;
//import com.propcoza.legends.tools.rental_transaction_manager.repo.RentalRepo;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//@Configuration
//public class DataInitializer {
//
//    @Bean
//    CommandLineRunner initDatabase(AgentRepo agentRepo, RentalRepo rentalRepo) {
//        return args -> {
//            if (agentRepo.count() > 0) return;
//
//            // 1. Define all Agents
//            List<Agent> agentsToSave = List.of(
//                    createAgent("Sarah Jacobs", "sarah.jacobs@propcoza.co.za", "FNB", "62145897321", "250655"),
//                    createAgent("Michael Petersen", "michael.petersen@propcoza.co.za", "Standard Bank", "45879632145", "051001"),
//                    createAgent("Ayesha Khan", "ayesha.khan@propcoza.co.za", "Absa", "78541236987", "632005"),
//                    createAgent("Daniel Rossouw", "daniel.rossouw@propcoza.co.za", "Nedbank", "96325874125", "198765"),
//                    createAgent("Fatima Daniels", "fatima.daniels@propcoza.co.za", "Capitec", "14785236901", "470010")
//            );
//
//            // 2. Save Agents and capture the MANAGED entities in a Map for easy lookup
//            // This prevents the OptimisticLockingFailure by ensuring we use the DB-synced versions
//            Map<String, Agent> agents = agentRepo.saveAll(agentsToSave)
//                    .stream()
//                    .collect(Collectors.toMap(Agent::getFullName, a -> a));
//
//            // 3. Define and Save Rentals using the managed Agents
//            rentalRepo.saveAll(List.of(
//                    // Sarah (3)
//                    createRental(agents.get("Sarah Jacobs"), "12 Beach Road, Sea Point", "John Smith", "Amanda Naidoo", "FNB", "55874123698", "250655", 18500, 0.10, 0.30, 0.70, true),
//                    createRental(agents.get("Sarah Jacobs"), "44 Kloof Street, Gardens", "Emma Brown", "Chris Hendricks", "Absa", "44789632145", "632005", 14200, 0.10, 0.30, 0.70, true),
//                    createRental(agents.get("Sarah Jacobs"), "7 Main Road, Green Point", "Luke Adams", "Vanessa Jacobs", "Standard Bank", "78965412301", "051001", 21000, 0.12, 0.35, 0.65, true),
//
//                    // Michael (2)
//                    createRental(agents.get("Michael Petersen"), "18 Oak Avenue, Durbanville", "Sophia Miller", "Greg Foster", "Nedbank", "32165498745", "198765", 16500, 0.10, 0.30, 0.70, false),
//                    createRental(agents.get("Michael Petersen"), "92 Pine Crescent, Bellville", "Nathan White", "Tanya Lewis", "Capitec", "74125896300", "470010", 13200, 0.10, 0.25, 0.75, true),
//
//                    // Ayesha (2)
//                    createRental(agents.get("Ayesha Khan"), "30 Church Street, Stellenbosch", "Mia Johnson", "Hassan Patel", "FNB", "96374125800", "250655", 15500, 0.11, 0.30, 0.70, true),
//                    createRental(agents.get("Ayesha Khan"), "11 Andringa Street, Stellenbosch", "Olivia Green", "Jacques Nel", "Standard Bank", "85236974100", "051001", 17800, 0.10, 0.30, 0.70, true),
//
//                    // Daniel (2)
//                    createRental(agents.get("Daniel Rossouw"), "5 Long Street, CBD", "Ethan Hall", "Rebecca Stone", "Absa", "14725836900", "632005", 19800, 0.10, 0.30, 0.70, false),
//                    createRental(agents.get("Daniel Rossouw"), "73 Loop Street, CBD", "Grace Carter", "Simon Williams", "Nedbank", "65498732100", "198765", 14900, 0.10, 0.30, 0.70, true),
//
//                    // Fatima (1)
//                    createRental(agents.get("Fatima Daniels"), "27 Blaauwberg Road, Table View", "Noah Turner", "Lauren Adams", "Capitec", "25836914700", "470010", 17100, 0.10, 0.30, 0.70, true)
//            ));
//
//            System.out.println("🚀 Database Seeded: 5 Agents and 10 Rentals created successfully.");
//        };
//    }
//
//    private Agent createAgent(String name, String email, String bank, String acc, String branch) {
//        Agent a = new Agent();
//        // If your Entity has @GeneratedValue(strategy = GenerationType.UUID),
//        // DO NOT set the ID manually. If it doesn't, uncomment the line below:
//        // a.setId(java.util.UUID.randomUUID());
//        a.setFullName(name);
//        a.setEmail(email);
//        a.setBankName(bank);
//        a.setAccountNumber(acc);
//        a.setBranchCode(branch);
//        a.setIsActive(true);
//        a.setCreatedAt(LocalDateTime.now());
//        a.setUpdatedAt(LocalDateTime.now());
//        return a;
//    }
//
//    private Rental createRental(Agent agent, String address, String tenant, String landlord,
//                                String lBank, String lAcc, String lBranch, double baseRent,
//                                double comm, double offSplit, double agSplit, boolean vat) {
//        Rental r = new Rental();
//        // Assuming @GeneratedValue for Rental ID as well
//        r.setAgent(agent);
//        r.setAddress(address);
//        r.setTenantName(tenant);
//        r.setLandlordName(landlord);
//        r.setLandlordBankName(lBank);
//        r.setLandlordAccNo(lAcc);
//        r.setLandlordBranch(lBranch);
//        r.setPaymentDate(LocalDate.of(2026, 4, 1));
//        r.setStartDate(LocalDate.of(2026, 4, 1));
//        r.setAutoRenew(true);
//        r.setStatus(RentalStatus.ACTIVE);
//        r.setBaseRent(BigDecimal.valueOf(baseRent));
//        r.setRentalCommissionPercent(comm);
//        r.setOfficeSplit(offSplit);
//        r.setAgentSplit(agSplit);
//        r.setAgentPaye(0.18);
//        r.setVatRegistered(vat);
//        r.setCreatedBy("system");
//        r.setCreatedAt(LocalDateTime.now());
//        r.setUpdatedAt(LocalDateTime.now());
//        return r;
//    }
//}