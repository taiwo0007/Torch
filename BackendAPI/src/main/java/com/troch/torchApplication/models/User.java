package com.troch.torchApplication.models;


import com.fasterxml.jackson.annotation.*;
import com.troch.torchApplication.Views.Views;
import com.troch.torchApplication.enums.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.bytebuddy.dynamic.loading.InjectionClassLoader;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.json.JSONPropertyIgnore;

import javax.persistence.*;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Table(name = "user", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class User {

    @Id
    @JsonView(Views.Id.class)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    private Integer id;
    @Column(name = "firstName")
    private String firstName;
    @Column(name = "lastName")
    private String lastName;

    @Column(name = "joined", nullable = false, updatable = false)
    private Date joined;

    private String email;

    @JsonIgnore
    @Column(name = "password")
    private String password;
    @Column(name = "rating")
    private Double rating = 0.0;

    private boolean isTorchTrusted;
    private Integer phoneNumber;

    private String about;
    private String location;
    private String postCode;
    private String country;
    private String state;
    private String accountType;

    @Column(name = "profilePicture")
    private String profilePicture;

    private Integer userTrips = 0;

    @JsonBackReference
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
    @JsonIdentityReference(alwaysAsId = true)
    private Host host;

    @OneToMany(mappedBy = "user_reviewer", cascade = CascadeType.ALL)
//    @JsonBackReference
//    @JsonIgnore
    List<HostReview> hostReviews = new ArrayList<>();

    @OneToMany(mappedBy = "scooter_reviewer", cascade = CascadeType.ALL)
    @JsonBackReference
    List<ScooterReview> scooterReviews = new ArrayList<>();

    @OneToMany(mappedBy = "user_renter", cascade = CascadeType.ALL)
//    @JsonBackReference
    List<Trip> renterTrips = new ArrayList<>();

    private Boolean isVerified = false;

    private Boolean isHost;

    public double getRating() {
        List<HostReview> allHostReviews = this.hostReviews;
        double averageRating = 0.0;

        int one = 0, two = 0, three = 0, four = 0, five = 0;
        for (HostReview scoot : allHostReviews) {
            if (scoot.getStarRating() == 1) {
                one++;
            }
            if (scoot.getStarRating() == 2) {
                two++;
            }
            if (scoot.getStarRating() == 3) {
                three++;
            }
            if (scoot.getStarRating() == 4) {
                four++;
            }
            if (scoot.getStarRating() == 5) {
                five++;
            }

            averageRating = (five * 5 + four * 4 + three * 3 + two * 2 + one * 1) / (five + four + three + two + one);

        }
        return averageRating;
    }
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
        inUseDetailsMap.put("CANCELLED_RECENTLY", cancelledRecentlyCount);

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
