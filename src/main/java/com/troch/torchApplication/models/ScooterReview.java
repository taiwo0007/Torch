package com.troch.torchApplication.models;


import javax.persistence.*;
import java.util.Date;

@Entity
public class ScooterReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "scooter_id", referencedColumnName = "id")
    private EScooter eScooter;

    @ManyToOne
    @JoinColumn(name = "scooter_reviewer_id", referencedColumnName = "id")
    private User scooter_reviewer;


    private Date reviewDate;

    private String comment;

    private Integer starRating;
}
