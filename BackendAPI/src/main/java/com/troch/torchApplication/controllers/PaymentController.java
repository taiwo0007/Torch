package com.troch.torchApplication.controllers;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import com.troch.torchApplication.dto.CreatePayment;
import com.troch.torchApplication.dto.CreatePaymentResponse;
import com.troch.torchApplication.dto.PriceIdRequest;
import com.troch.torchApplication.dto.Response;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.services.StripeService;

import com.troch.torchApplication.services.UserServiceImpl;
import io.grpc.LoadBalancer;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
public class PaymentController {


    Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    UserServiceImpl userService;

    @Value("${stripe.keys.public}")
    private String API_PUBLIC_KEY;

    private StripeService stripeService;

    public PaymentController (StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/webhook")
    public HttpStatus webhookFromStripe(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) throws StripeException {


        String endpointSecret = "whsec_d5739ee7ea5d6dd5832275132365e456b5fbbc226f6632c23d8008aedeb61373";

        Event event = null;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            // Invalid signature
            return HttpStatus.BAD_REQUEST;

        }

        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = null;
        if (dataObjectDeserializer.getObject().isPresent()) {
            stripeObject = dataObjectDeserializer.getObject().get();
        } else {

        }


        switch (event.getType()) {


            case "checkout.session.completed":
                Session session = (Session) stripeObject;

                logger.info("CUSTOMER"+session.getCustomerDetails().getEmail());
                logger.info("SUBSCRIPTION ID "+session.getSubscription());
                logger.info("AMOUNT SUBTOTAL "+session.getAmountSubtotal());

                if(!session.getSubscription().isBlank()){

                    User user = userService.findUserByEmail(session.getCustomerDetails().getEmail());
                   if(session.getAmountSubtotal() == 1299){

                       user.setAccountType("Basic");

                   }
                    if(session.getAmountSubtotal() == 2999){
                        user.setAccountType("Advanced");
                    }
                    if(session.getAmountSubtotal() == 3999){
                        user.setAccountType("Pro");
                    }
                    userService.saveUser(user);

                }

                // Payment is successful and the subscription is created.
                // You should provision the subscription and save the customer ID to your database.
                break;
            case "invoice.paid":

                // Continue to provision the subscription as payments continue to be made.
                // Store the status in your database and check when a user accesses your service.
                // This approach helps you avoid hitting rate limits.
                break;
            case "invoice.payment_failed":

                logger.info("failed info", "Custooerm did not pay");
                // The payment failed or the customer does not have a valid payment method.
                // The subscription becomes past_due. Notify your customer and send them to the
                // customer portal to update their payment information.
                break;
            default:
                // System.out.println("Unhandled event type: " + event.getType());
        }

        return HttpStatus.OK;

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

        logger.info("priceId" +priceId);



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


