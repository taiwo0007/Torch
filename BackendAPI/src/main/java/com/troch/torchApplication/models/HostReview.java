package com.troch.torchApplication.models;


import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Host_Review")
public class HostReview {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "host_id", referencedColumnName = "id")
    private Host host;

    @ManyToOne
    @JoinColumn(name = "user_reviewer_id", referencedColumnName = "id")
    private User user_reviewer;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date reviewDate;

    private String comment;

    private int starRating;
}
