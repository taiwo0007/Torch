package com.troch.torchApplication.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticationResponse {

    private String authToken;
    private Date expiresAt;
    private String email;
    private Boolean isHost;
    private Boolean isVerified;
    private Integer hostID;

    private String accountType;




}
