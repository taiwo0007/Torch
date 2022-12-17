package com.troch.torchApplication.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.troch.torchApplication.enums.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Host {

    @Id
    private Integer id;


    @OneToOne(mappedBy = "host")
    private User hostUser;

//    @OneToMany(mappedBy = "host", cascade = CascadeType.ALL)
//    @JsonManagedReference
//    List<EScooter> eScooters = new ArrayList<>();

    @OneToMany(mappedBy = "host", cascade = CascadeType.ALL)
    List<HostReview> hostReviews = new ArrayList<>();

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "host", cascade = CascadeType.ALL)
    @Fetch(value = FetchMode.SUBSELECT)
    @JsonManagedReference
    private List<EScooter> hostEScooters = new ArrayList<>();

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "trip_owner", cascade = CascadeType.ALL)
    @Fetch(value = FetchMode.SUBSELECT)
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
        escooterNotInUse = this.hostEScooters.size() - escooterInUseCount;

        scooterUseMap.put("ESCOOTER-IN-USE",escooterInUseCount );
        scooterUseMap.put("ESCOOTER-NOT-IN-USE", escooterNotInUse);
        scooterUseMap.put("EARNED", earned);
        scooterUseMap.put("CANCELLED", cancelledCount);
        scooterUseMap.put("CANCELLED-RECENTLY", cancelledRecentlyCount);

        return scooterUseMap;
    }




}
