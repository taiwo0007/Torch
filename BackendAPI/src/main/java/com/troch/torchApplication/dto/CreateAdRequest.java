package com.troch.torchApplication.dto;


import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@AllArgsConstructor
@Builder
@Setter
@Getter
@NoArgsConstructor
public class CreateAdRequest {

    private int adDays;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date adDate;

    private Integer escooterId;

    private Integer hostId;

}
