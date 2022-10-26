package com.troch.torchApplication.models;


import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    private Date fromDate;
    private Date toDate;

}
