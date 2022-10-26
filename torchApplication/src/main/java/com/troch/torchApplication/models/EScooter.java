package com.troch.torchApplication.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class EScooter {

    @Id
    private Integer id;

    @ManyToOne
    @JoinColumn(name="user_id", referencedColumnName = "id")
    private User user;

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

    private Date tripStart;
    private Date tripEnd;


    public String getImage(){
        return this.image;
    }





}
