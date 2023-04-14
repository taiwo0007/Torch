package com.troch.torchApplication.models;

import com.fasterxml.jackson.annotation.*;
import com.troch.torchApplication.Views.Views;
import lombok.*;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class EScooter {



    @Id
    @JsonView(Views.Id.class)
//    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name="scooter_host_id", referencedColumnName = "id")
    @JsonIdentityReference(alwaysAsId = true)
    private Host host;

    @ManyToOne
    @JoinColumn(name = "make_id", referencedColumnName = "id")
    @JsonIdentityReference(alwaysAsId = true)
    private Make make;

    @Column(name = "model_name")
    private String modelName;
    @Column(name = "trips", columnDefinition = "integer default 0")
    private Integer trips;
    @Column(name = "cost", precision=2, scale=2, columnDefinition = "double default 0.00")
    private Double cost;
    @Column(name = "rating" , columnDefinition = "double default 0.00")
    private Double rating;
    @Column(name = "imageURL")
    private String image;

    private Double maxSpeed;
    private Double maxWeight;
    private Double scooterWeight;
    private Double motorPower;
    private Double maxRange;
    private Boolean waterResistant;

    private Date adDate;
    private int escooterAdDays;

    @Column(length = 1000)
    private String about;

    private Boolean inUse = false;

    private Boolean Active = false;

    private double longitude;
    private double latitude;
    private String address;
    private String county;
    private String country;


    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date tripStart;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date tripEnd;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "eScooter",  fetch = FetchType.EAGER)
    List<ScooterReview> escooterReviews = new ArrayList<>();


    @OneToMany(mappedBy = "eScooterOnTrip", cascade = CascadeType.ALL)
    @JsonIgnore
    List<Trip> escooterTrips = new ArrayList<>();




    public String getImage(){
        return this.image;
    }


    public double getRating(){
        List<ScooterReview> allHostReviews = this.escooterReviews;
        double averageRating = 0.0;

        double one = 0.0, two = 0.0, three = 0.0, four = 0.0, five = 0.0;
        for (ScooterReview scoot : allHostReviews) {
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

            averageRating = (five * 5.0 + four * 4.0 + three * 3.0 + two * 2.0+  one * 1.0) / (five + four + three + two + one);

        }
        return averageRating;
    }




}
