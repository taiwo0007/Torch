package com.troch.torchApplication.models;


import com.fasterxml.jackson.annotation.*;
import com.troch.torchApplication.Views.Views;
import com.troch.torchApplication.enums.TripStatus;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.*;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
public class Host {

    @Id
    @JsonView(Views.Id.class)
    private Integer id;

    @Column(name = "total_ad_days", columnDefinition = "integer default 0")
    private Integer totalAdDays = 0;


    @OneToOne(mappedBy = "host", fetch = FetchType.EAGER)
//    @JsonIdentityReference(alwaysAsId = true)
//    @JsonBackReference
    private User hostUser;

//    @OneToMany(mappedBy = "host", cascade = CascadeType.ALL)
//    @JsonManagedReference
//    List<EScooter> eScooters = new ArrayList<>();

    @OneToMany(mappedBy = "host", cascade = CascadeType.ALL)
    @JsonBackReference
    @JsonIgnore
    List<HostReview> hostReviews = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "host", cascade = CascadeType.ALL)
//    @Fetch(value = FetchMode.SUBSELECT)
//    @Fetch(value = FetchMode.JOIN)
    //    @JsonIdentityReference(alwaysAsId = true)
    @JsonIgnore
    private List<EScooter> hostEScooters = new ArrayList<>();

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "trip_owner", cascade = CascadeType.ALL)
    @Fetch(value = FetchMode.SUBSELECT)
    @JsonBackReference
    @JsonIgnore
    private List<Trip> hostTrips = new ArrayList<>();

    public HashMap<String, Object> getScooterUseDetail(){

        int escooterInUseCount = 0;
        int escooterNotInUse = 0;
        double earned = 0.0;
        int cancelledCount = 0;
        int cancelledRecentlyCount = 0;
        HashMap<String, Object> scooterUseMap = new HashMap<>();

        for(Trip trip: this.hostTrips){

            if(trip.getStatus() == TripStatus.ACTIVE){

                escooterInUseCount++;
            }
            if(trip.getStatus() == TripStatus.CANCELLED){

                cancelledCount++;
                if(Math.abs(trip.getTripEnd().getDate() - Calendar.getInstance().getTime().getDate()) < 7){

                    cancelledRecentlyCount++;
                }
            }

            earned += trip.getTripCost();

        }
//        escooterNotInUse = this.hostEScooters.size() - escooterInUseCount;

        scooterUseMap.put("ESCOOTER_IN_USE",escooterInUseCount );
        scooterUseMap.put("ESCOOTER_NOT_IN_USE", escooterNotInUse);
        scooterUseMap.put("EARNED", earned);
        scooterUseMap.put("CANCELLED", cancelledCount);
        scooterUseMap.put("CANCELLED_RECENTLY", cancelledRecentlyCount);

        return scooterUseMap;
    }


    @ManyToOne(fetch = FetchType.EAGER)
    private Insurance insurance;

    private Date insuranced_date;




}
