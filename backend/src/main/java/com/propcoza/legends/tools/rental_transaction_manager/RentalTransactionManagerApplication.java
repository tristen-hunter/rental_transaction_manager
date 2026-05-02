package com.propcoza.legends.tools.rental_transaction_manager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
public class RentalTransactionManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(RentalTransactionManagerApplication.class, args);
	}

}
