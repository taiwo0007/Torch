package com.troch.torchApplication.dto;

import lombok.*;

@Data
@AllArgsConstructor
@Builder
@Setter
@Getter
@NoArgsConstructor
public class HostScooterReviewRequest {


   private int host_starRating;
   private String host_comment;

    private int escooter_starRating;

    private String escooter_comment;

    private String tripID;

}
