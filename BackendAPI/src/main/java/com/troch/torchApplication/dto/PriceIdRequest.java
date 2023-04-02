package com.troch.torchApplication.dto;


import lombok.*;

@Data
@AllArgsConstructor
@Builder
@Setter
@Getter
@NoArgsConstructor
public class PriceIdRequest {

    String email;
    private String price_id;
    private String url;
}
