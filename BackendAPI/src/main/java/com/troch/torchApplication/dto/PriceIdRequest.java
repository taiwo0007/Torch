package com.troch.torchApplication.dto;


import lombok.*;

@Data
@AllArgsConstructor
@Builder
@Setter
@Getter
@NoArgsConstructor
public class PriceIdRequest {

    private String price_id;
    private String url;
}
