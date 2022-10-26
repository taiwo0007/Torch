package com.troch.torchApplication.models;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Host {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(mappedBy = "host")
    private User host_user;

    @OneToMany(mappedBy = "host", cascade = CascadeType.ALL)
    List<EScooter> eScooters = new ArrayList<>();

    @OneToMany(mappedBy = "host", cascade = CascadeType.ALL)
    List<HostReview> hostReviews = new ArrayList<>();

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "host", cascade = CascadeType.ALL)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<EScooter> hostEScooters = new ArrayList<>();

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "trip_owner", cascade = CascadeType.ALL)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Trip> hostTrips = new ArrayList<>();




}
