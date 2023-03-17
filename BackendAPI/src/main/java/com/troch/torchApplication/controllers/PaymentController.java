package com.troch.torchApplication.controllers;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import com.troch.torchApplication.dto.CreatePayment;
import com.troch.torchApplication.dto.CreatePaymentResponse;
import com.troch.torchApplication.dto.PriceIdRequest;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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


    @PostMapping("/create-subscription")
    public ResponseEntity createSubscription() throws StripeException {

        Stripe.apiKey = "sk_test_51M5pMwBapNSScoYvdfzlMbuNHXyDI1TXBwOxRJxtkuQjBOZDxbAsUv5326FY9RC04wr9sBlyHQp5FlDgCQKCdx4a00zY9p9JRT";


        ArrayList<Object> items = new ArrayList<>();
        Map<String, Object> item1 = new HashMap<>();
        item1.put(
                "price",
                "price_1Mlhx9BapNSScoYvu765T22Y"
        );
        items.add(item1);
        Map<String, Object> params = new HashMap<>();
        params.put("customer", "cus_4QFOF3xrvBT2nU");
        params.put("items", items);

        Subscription subscription =
                Subscription.create(params);

        logger.info("subscription info"+subscription);

        return new ResponseEntity(HttpStatus.ACCEPTED);

    }

    @PostMapping("/create-checkout-session")
    public String createCheckoutSession(@RequestBody PriceIdRequest priceIdRequest ) throws StripeException {

        Stripe.apiKey = "sk_test_51M5pMwBapNSScoYvdfzlMbuNHXyDI1TXBwOxRJxtkuQjBOZDxbAsUv5326FY9RC04wr9sBlyHQp5FlDgCQKCdx4a00zY9p9JRT";

        // The price ID passed from the client
//   String priceId = request.queryParams("priceId");
        String priceId = priceIdRequest.getPrice_id();

        logger.info("url" +priceIdRequest.getUrl());

        SessionCreateParams params = new SessionCreateParams.Builder()
                .setSuccessUrl(priceIdRequest.getUrl())
                .setCancelUrl(priceIdRequest.getUrl())
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .addLineItem(new SessionCreateParams.LineItem.Builder()
                        // For metered billing, do not pass quantity
                        .setQuantity(1L)
                        .setPrice(priceId)
                        .build()
                )
                .build();



        return Session.create(params).toJson();



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

        logger.info(""+paymentIntent.getClientSecret());

        return new CreatePaymentResponse(paymentIntent.getClientSecret());
    }
}


