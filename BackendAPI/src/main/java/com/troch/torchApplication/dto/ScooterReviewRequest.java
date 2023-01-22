package com.troch.torchApplication.dto;

import com.troch.torchApplication.models.EScooter;
import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ScooterReviewRequest {

    private String comment;
    private double starRating;
    private Integer eScooterId;
}
