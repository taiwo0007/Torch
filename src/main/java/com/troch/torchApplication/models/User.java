package com.troch.torchApplication.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.troch.torchApplication.enums.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.bytebuddy.dynamic.loading.InjectionClassLoader;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "firstName")
    private String firstName;
    @Column(name = "lastName")
    private String lastName;

    private String email;
    @Column(name = "password")
    private String password;
    @Column(name = "rating")
    private Double rating = 0.0;

    private Integer phoneNumber;
    private String postCode;
    private String country;
    private String state;
    private String accountType;

    @Column(name = "profilePicture")
    private String profilePicture;

    private Integer userTrips = 0;

    @LazyCollection(LazyCollectionOption.FALSE)
    @ManyToMany( cascade = CascadeType.ALL)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(
                    name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(
                    name = "role_id", referencedColumnName = "id"))
    private Collection<Role> roles;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "host_id", referencedColumnName = "id")
    @JsonBackReference
    private Host host;

    @OneToMany(mappedBy = "user_reviewer", cascade = CascadeType.ALL)
    @JsonManagedReference
    List<HostReview> hostReviews = new ArrayList<>();

    @OneToMany(mappedBy = "scooter_reviewer", cascade = CascadeType.ALL)
    @JsonManagedReference
    List<ScooterReview> scooterReviews = new ArrayList<>();

    @OneToMany(mappedBy = "user_renter", cascade = CascadeType.ALL)
    @JsonBackReference
    List<Trip> renterTrips = new ArrayList<>();

    private Boolean isVerified = false;

    public User(String firstName, String lastName, String email, String password, Collection<Role> roles){
        this.firstName= firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }
    public String getProfile(){

        return this.profilePicture;
    }

    public HashMap<String, Integer> getUserTripDetails(){

        Calendar cal = Calendar.getInstance();
        HashMap<String, Integer> inUseDetailsMap = new HashMap<>();

        int inUseCount = 0;
        int notInUseCount = 0;
        int cancelledCount = 0;
        int cancelledRecentlyCount = 0;

        for (Trip trip: this.renterTrips) {

            if(trip.status == TripStatus.ACTIVE){
                inUseCount++;
            }
            if(trip.status == TripStatus.COMPLETED){
                notInUseCount++;
            }
            if(trip.status == TripStatus.CANCELLED){
                cancelledCount++;
                if(Math.abs(trip.getTripEnd().getDate() - Calendar.getInstance().getTime().getDate()) < 7){

                    cancelledRecentlyCount++;
                }

            }

        }
        inUseDetailsMap.put("ACTIVE", inUseCount);
        inUseDetailsMap.put("COMPLETED", notInUseCount);
        inUseDetailsMap.put("CANCELLED", cancelledCount);
        inUseDetailsMap.put("CANCELLED-RECENTLY", cancelledRecentlyCount);

        return inUseDetailsMap;
    }

        public int getLastTripDaysLeft(){

        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, 1988);
        cal.set(Calendar.MONTH, Calendar.JANUARY);
        cal.set(Calendar.DAY_OF_MONTH, 1);

        Trip recentTrip = new Trip();
        recentTrip.setTripEnd(cal.getTime());

        if(this.renterTrips.size() == 0){
            return 0;
        }

        for (Trip trip: this.renterTrips) {
            if(trip.status == TripStatus.ACTIVE){
                if (trip.getTripEnd().compareTo(recentTrip.getTripEnd()) > 0){
                    recentTrip = trip;
                }
            }
        }

        return Math.abs(Calendar.getInstance().getTime().getDate() - recentTrip.getTripEnd().getDate());

    }


}
