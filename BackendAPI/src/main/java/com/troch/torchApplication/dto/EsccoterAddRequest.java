package com.troch.torchApplication.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.troch.torchApplication.models.Make;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.Column;
import java.io.File;
import java.util.Date;

@Data
@AllArgsConstructor
@Builder
@Setter
@Getter
@NoArgsConstructor
public class EsccoterAddRequest {

    @JsonProperty("make")
    private String make;

    private String modelName;

    private Integer trips;

    private Double cost;
    private Double rating;
    private String image;
    private String fileName;
    private Double maxSpeed;
    private Double maxWeight;
    private Double scooterWeight;
    private Double motorPower;
    private Double maxRange;
    private Boolean waterResistant;
    private String about;

    private double longitude;
    private double latitude;
    private String address;
    private String county;
    private String country;
    private String tripStart;
    private String tripEnd;

    private String contentType;
}
