package com.troch.torchApplication.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class TripCreateRequest {
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date tripStart;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date tripEnd;
    private int tripDays;
    private double tripCost;
    private Integer eid;
}
