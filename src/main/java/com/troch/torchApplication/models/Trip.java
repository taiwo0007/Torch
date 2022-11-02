package com.troch.torchApplication.models;


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
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;


    @ManyToOne
    @JoinColumn(name = "escooter_id", referencedColumnName = "id")
    private EScooter eScooterOnTrip;

    @ManyToOne
    @JoinColumn(name = "user_renter_id", referencedColumnName = "id")
    private User user_renter;

    @ManyToOne
    @JoinColumn(name = "host_id", referencedColumnName = "id")
    private Host trip_owner;

    @DateTimeFormat(
            pattern = "yyyy-MM-dd"
    )
    private Date tripStart;
    @DateTimeFormat(
            pattern = "yyyy-MM-dd"
    )
    private Date tripEnd;

    public Double tripCost;

}
