package com.troch.torchApplication.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class VerifyRequest {

    private String url;
    private String firstName;
    private String lastName;
    private int phoneNumber;
    private String about;
    private String location;
    private String gender;
    private String profilePicture;

    private String fileName;

    private String image;
    private String contentType;
}
