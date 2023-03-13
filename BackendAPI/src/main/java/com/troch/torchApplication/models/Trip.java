package com.troch.torchApplication.models;


import com.fasterxml.jackson.annotation.*;
import com.troch.torchApplication.Views.Views;
import com.troch.torchApplication.enums.TripStatus;
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
@JsonIgnoreProperties
public class Trip {

    public static class FullView {};
    public static class IdView {};
    public static class SummaryView {};

    @Id
    @JsonView(Views.Id.class)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @ManyToOne
    @JoinColumn(name = "escooter_id", referencedColumnName = "id")
//    @JsonManagedReference
    @JsonView(IdView.class)
    private EScooter eScooterOnTrip;

    @ManyToOne
    @JoinColumn(name = "user_renter_id", referencedColumnName = "id")
    @JsonManagedReference
    private User user_renter;

    @ManyToOne
    @JoinColumn(name = "host_id", referencedColumnName = "id")
    @JsonManagedReference
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

    private int days = 0;

    @Enumerated(EnumType.STRING)
    public TripStatus status;

}
