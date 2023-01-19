package com.troch.torchApplication.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@JsonIgnoreProperties
public class ScooterReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "scooter_id", referencedColumnName = "id")
//    @JsonIgnore
    @JsonManagedReference
    private EScooter eScooter;

    @ManyToOne
    @JoinColumn(name = "scooter_reviewer_id", referencedColumnName = "id")
    @JsonManagedReference
    private User scooter_reviewer;


    private Date reviewDate;

    private String comment;

    private Integer starRating;
}
