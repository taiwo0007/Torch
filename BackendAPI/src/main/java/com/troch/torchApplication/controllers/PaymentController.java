package com.troch.torchApplication.controllers;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import com.troch.torchApplication.dto.CreatePayment;
import com.troch.torchApplication.dto.CreatePaymentResponse;
import com.troch.torchApplication.dto.Response;
import com.troch.torchApplication.services.StripeService;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;



import com.stripe.model.PaymentIntent;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;


@RestController
public class PaymentController {


    Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Value("${stripe.keys.public}")
    private String API_PUBLIC_KEY;

    private StripeService stripeService;

    public PaymentController (StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/create-payment-intent")
    public CreatePaymentResponse createPaymentIntent(@RequestBody String responseb, CreatePayment createPayment) throws StripeException {

        JSONObject json = new JSONObject(responseb);
        double cost = json.getDouble("cost");

        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .setAmount((long) cost * 100L)

                        .setCurrency("eur")
                        .setAutomaticPaymentMethods(
                                PaymentIntentCreateParams.AutomaticPaymentMethods
                                        .builder()
                                        .setEnabled(true)
                                        .build()
                        )
                        .build();

        long amount = (long) cost * 100L;
        // Create a PaymentIntent with the order amount and currency
        PaymentIntent paymentIntent = PaymentIntent.create(params);

        return new CreatePaymentResponse(paymentIntent.getClientSecret());
    }
}


