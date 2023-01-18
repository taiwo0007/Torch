package com.troch.torchApplication.forms;

import com.troch.torchApplication.models.Make;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.Entity;
import java.util.Date;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Component
public class EScooterForm {

    private Make make;
    private String modelName;
    private Double cost;
    private MultipartFile scooterImage;
    private Double maxSpeed;
    private Double maxWeight;
    private Double scooterWeight;
    private Double motorPower;
    private Double maxRange;
    private Boolean waterResistant;
    private String about;
    private String country;
    private MultipartFile image;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date tripStart;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date tripEnd;


}
