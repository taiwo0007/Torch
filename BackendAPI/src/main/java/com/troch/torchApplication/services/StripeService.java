package com.troch.torchApplication.services;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.Customer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StripeService {


    @Value("${stripe.keys.secret}")
    private String API_SECRET_KEY;

    public StripeService() {
    }


    private String createCustomer(String email, String token) {

        String id = null;

        try {
            Stripe.apiKey = API_SECRET_KEY;

            Map<String, Object> customerParams = new HashMap<>();

            customerParams.put("description", "Customer for " + email);
            customerParams.put("email", email);


            customerParams.put("source", token);

            Customer customer = Customer.create(customerParams);
            id = customer.getId();
        } catch (StripeException e) {
            e.printStackTrace();
        }

        return id;
    }


    public String createCharge(String email, String token, int amount) {


        String id = null;

        try {
            Stripe.apiKey = API_SECRET_KEY;

            Map<String, Object> chargeParams = new HashMap<>();

            chargeParams.put("amount", amount);
            chargeParams.put("currency", "eur");
            chargeParams.put("description", "Charge for" + email);
            chargeParams.put("source", token);


            Charge charge = Charge.create(chargeParams);
            id = charge.getId();
        } catch (StripeException e) {
            e.printStackTrace();
        }

return id;
    }

}

