package com.troch.torchApplication.dto;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
public class CreatePayment {
    @SerializedName("items")
    Object[] items;


    private String paymentMethodId;
    private String email;



}