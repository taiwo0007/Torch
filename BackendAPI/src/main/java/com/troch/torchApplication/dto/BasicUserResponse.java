package com.troch.torchApplication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class BasicUserResponse {


    private String firstName;

    private String lastName;

    private String country;

    private String profilePicture;

    private Integer host;
    private Integer userId;
}
