package com.troch.torchApplication;

import com.stripe.Stripe;
import com.troch.torchApplication.config.SwaggerConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import javax.annotation.PostConstruct;

@SpringBootApplication
@EnableAsync
@Import(SwaggerConfiguration.class)
@EnableSwagger2
public class TorchApplication {

	@PostConstruct
	public void setup(){

		Stripe.apiKey = "sk_test_51M5pMwBapNSScoYvdfzlMbuNHXyDI1TXBwOxRJxtkuQjBOZDxbAsUv5326FY9RC04wr9sBlyHQp5FlDgCQKCdx4a00zY9p9JRT";
	}




	public static void main(String[] args) {
		SpringApplication.run(TorchApplication.class, args);
	}

}
