package com.troch.torchApplication;

import com.stripe.Stripe;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.annotation.PostConstruct;

@SpringBootApplication
public class TorchApplication {

	@PostConstruct
	public void setup(){

		Stripe.apiKey = "sk_test_51M5pMwBapNSScoYvdfzlMbuNHXyDI1TXBwOxRJxtkuQjBOZDxbAsUv5326FY9RC04wr9sBlyHQp5FlDgCQKCdx4a00zY9p9JRT";
	}

	public static void main(String[] args) {
		SpringApplication.run(TorchApplication.class, args);
	}

}
