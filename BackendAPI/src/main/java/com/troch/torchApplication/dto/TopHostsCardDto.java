package com.troch.torchApplication.dto;


import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class TopHostsCardDto {

    private String profileImage;
    private String firstName;
    private String LastNameInitital;
    private double rating;
    private Date joined;
    private boolean isTrusted;
    private int trips;
    private String reviewer_comment;
    private Date reviewer_date;
    private String reviewer_name;

    private Integer host_id;



}
