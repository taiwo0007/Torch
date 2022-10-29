package com.troch.torchApplication.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
public class EScooter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name="scooter_host_id", referencedColumnName = "id")
    private Host host;

    @ManyToOne
    @JoinColumn(name = "make_id", referencedColumnName = "id")
    private Make make;

    @Column(name = "model_name")
    private String modelName;
    @Column(name = "trips")
    private Integer trips;
    @Column(name = "cost")
    private Double cost;
    @Column(name = "rating")
    private Double rating;
    @Column(name = "imageURL")
    private String image;

    private Double maxSpeed;
    private Double maxWeight;
    private Double scooterWeight;
    private Double motorPower;
    private Double maxRange;
    private Boolean waterResistant;
    private String about;



    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date tripStart;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date tripEnd;

    @OneToMany(mappedBy = "eScooter", cascade = CascadeType.ALL)
    List<ScooterReview> escooterReviews = new ArrayList<>();


    @OneToMany(mappedBy = "eScooterOnTrip", cascade = CascadeType.ALL)
    List<Trip> escooterTrips = new ArrayList<>();




    public String getImage(){
        return this.image;
    }







}
