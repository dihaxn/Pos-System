package com.lloms.outletservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableMongoAuditing
@EnableTransactionManagement
public class OutletServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(OutletServiceApplication.class, args);
	}
}