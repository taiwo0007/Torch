package com.troch.torchApplication.dto;


import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class TripCreateRequest {
    private Date tripStart;
    private Date tripEnd;
    private int tripDays;
    private double tripCost;
    private Integer eid;
}
