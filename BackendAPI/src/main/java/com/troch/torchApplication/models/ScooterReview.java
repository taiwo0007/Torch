package com.troch.torchApplication.models;


import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.troch.torchApplication.Views.Views;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ScooterReview {

    @Id
    @JsonView(Views.Id.class)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "scooter_id", referencedColumnName = "id")
    @JsonIgnore
    private EScooter eScooter;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "scooter_reviewer_id", referencedColumnName = "id")
    @JsonIdentityReference(alwaysAsId = true)
    private User scooter_reviewer;


    private Date reviewDate;

    private String comment;

    private double starRating;
}
