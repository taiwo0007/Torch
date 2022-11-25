package com.troch.torchApplication.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @ManyToOne
    @JoinColumn(name = "escooter_id", referencedColumnName = "id")
    @JsonBackReference
    private EScooter eScooterOnTrip;

    @ManyToOne
    @JoinColumn(name = "user_renter_id", referencedColumnName = "id")
    @JsonBackReference
    private User user_renter;

    @ManyToOne
    @JoinColumn(name = "host_id", referencedColumnName = "id")
    @JsonBackReference
    private Host trip_owner;

    @DateTimeFormat(
            pattern = "yyyy-MM-dd"
    )
    private Date tripStart;
    @DateTimeFormat(
            pattern = "yyyy-MM-dd"
    )
    private Date tripEnd;

    private String tripId;

    public Double tripCost;

}
