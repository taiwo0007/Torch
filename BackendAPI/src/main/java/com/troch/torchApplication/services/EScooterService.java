package com.troch.torchApplication.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.troch.torchApplication.Utilities.FileUploadUtil;
import com.troch.torchApplication.Utilities.GCPUtil;
import com.troch.torchApplication.Utilities.JSONConverter;
import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.dto.EsccoterAddRequest;
import com.troch.torchApplication.dto.EscooterAddResponse;
import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.repositories.EScooterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import javax.transaction.Transactional;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.awt.*;
import java.io.*;
import java.nio.file.*;
import java.util.Base64;

@Service
public class EScooterService {

    @Autowired
    EScooterRepository eScooterRepository;

    @Autowired
    UserServiceImpl userService;

    @Autowired
    FileUploadUtil fileUploadUtil;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    JSONConverter jsonConverter;

    @Autowired
    GCPUtil gcpUtil;

    public List<EScooter> findAllEScooters(){
        return eScooterRepository.findAll();
    }

    public List<EScooter> findAllEscootersByHost(Integer id){
        return eScooterRepository.findEscootersByHostId(id);
    }


    public Optional<EScooter> findEScooter(Integer id){
        return eScooterRepository.findById(id);
    }

    @Transactional
    public EScooter addEscooterFromForm(EsccoterAddRequest esccoterAddRequest, String jwt) throws Exception {

        Path filePath = fileUploadUtil.writeBase64FileToSystem(esccoterAddRequest.getImage(),
                esccoterAddRequest.getFileName());

        String gcpPublicImageUrlgcpUtil = gcpUtil.uploadObject(filePath, esccoterAddRequest.getContentType());

        User user = userService.findUserByEmail(jwtUtil.extractUsernameFromRawToken(jwt));
        JsonNode json;
        HttpURLConnection http;

        try{
            URL url = new URL("https://api.geoapify.com/v1/geocode/search?text="+esccoterAddRequest.getCountry().replaceAll(" ", "%20")+"&apiKey=0d1f31ae91154c4c8f9d6002deb16ca3");
            http = (HttpURLConnection)url.openConnection();
            http.setRequestProperty("Accept", "application/json");
            json = jsonConverter.getJson(url);
        }
        catch (Exception ex){
            throw new IOException();
        }

        JsonNode featuresKey  = json.get("features").get(0);
        JsonNode propertiesKey  = featuresKey.get("properties");
        JsonNode longitudeKey  = propertiesKey.get("lon");
        JsonNode latitudeKey = propertiesKey.get("lat");
        JsonNode countryKey = propertiesKey.get("country");
        JsonNode countyKey = propertiesKey.get("city");

        double longitudeFormatted = longitudeKey.asDouble();
        double latitudeFormatted = latitudeKey.asDouble();
        String addressFormatted = propertiesKey.get("formatted").asText();
        String countryFormatted = countryKey.asText();
        String countyFormated = countyKey.asText();

        http.disconnect();

        EScooter eScooter = new EScooter();

        //Api Service handler
        eScooter.setLatitude(latitudeFormatted);
        eScooter.setLongitude(longitudeFormatted);
        eScooter.setAddress(addressFormatted);
        eScooter.setCountry(countryFormatted);
        eScooter.setCounty(countyFormated);

        //Form handler
        eScooter.setAbout(esccoterAddRequest.getAbout());
        eScooter.setCost(esccoterAddRequest.getCost());
        eScooter.setScooterWeight(esccoterAddRequest.getScooterWeight());
        eScooter.setImage(gcpPublicImageUrlgcpUtil);
        eScooter.setWaterResistant(esccoterAddRequest.getWaterResistant());
        eScooter.setTripStart(esccoterAddRequest.getTripStart());
        eScooter.setTripEnd(esccoterAddRequest.getTripEnd());
        eScooter.setMotorPower(esccoterAddRequest.getMotorPower());
        eScooter.setMaxRange(esccoterAddRequest.getMaxRange());
        eScooter.setMaxWeight(esccoterAddRequest.getMaxWeight());
        eScooter.setScooterWeight(esccoterAddRequest.getScooterWeight());
        eScooter.setMaxSpeed(esccoterAddRequest.getMaxSpeed());
        eScooter.setHost(user.getHost());
        eScooter.setModelName(esccoterAddRequest.getModelName());
//        eScooter.setMake(esccoterAddRequest.getMake());
        eScooter.setTrips(0);

        return eScooterRepository.save(eScooter);

    }



    public EScooter save(EScooter eScooter){
        return eScooterRepository.save(eScooter);
    }

    public List<EScooter> findAllByTripDatesAndLocation(String tripStart, String tripEnd, String country) throws ParseException {

        Date tripStartDate = null;
        Date tripEndDate = null;
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

        if(!tripStart.isEmpty()){
             tripStartDate = formatter.parse(tripStart);
        }
        if(!tripEnd.isEmpty()){
             tripEndDate = formatter.parse(tripEnd);
        }
        return eScooterRepository.findAllByTripDatesAndLocation(tripStartDate, tripEndDate, country);
    }






}
