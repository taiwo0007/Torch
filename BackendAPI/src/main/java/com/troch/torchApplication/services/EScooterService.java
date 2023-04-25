package com.troch.torchApplication.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.troch.torchApplication.Utilities.FileUploadUtil;
import com.troch.torchApplication.Utilities.GCPUtil;
import com.troch.torchApplication.Utilities.JSONConverter;
import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.dto.ErrorResponse;
import com.troch.torchApplication.dto.EsccoterAddRequest;
import com.troch.torchApplication.dto.EscooterAddResponse;
import com.troch.torchApplication.dto.Response;
import com.troch.torchApplication.models.*;
import com.troch.torchApplication.repositories.EScooterRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import javax.transaction.Transactional;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.awt.*;
import java.io.*;
import java.nio.file.*;
import java.util.List;

@Service
public class EScooterService {

    @Autowired
    EScooterRepository eScooterRepository;

    @Autowired
    TripService tripService;

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

    @Autowired
    MakeService makeService;

    @Autowired
    EScooterReviewService eScooterReviewService;

    Logger logger = LoggerFactory.getLogger(EScooterService.class);


    public List<EScooter> findAllEScooters() {
        return eScooterRepository.findAll();
    }

    public List<EScooter> findAllEscootersByHost(Integer id) {
        return eScooterRepository.findEscootersByHostId(id);
    }


    public Optional<EScooter> findEScooter(Integer id) {
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

        try {
            URL url = new URL("https://api.geoapify.com/v1/geocode/search?text=" + esccoterAddRequest.getCountry().replaceAll(" ", "%20") + "&apiKey=0d1f31ae91154c4c8f9d6002deb16ca3");
            http = (HttpURLConnection) url.openConnection();
            http.setRequestProperty("Accept", "application/json");
            json = jsonConverter.getJson(url);
        } catch (Exception ex) {
            throw new IOException();
        }

        JsonNode featuresKey = json.get("features").get(0);
        JsonNode propertiesKey = featuresKey.get("properties");
        JsonNode longitudeKey = propertiesKey.get("lon");
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

        Date tripStartDate = null;
        Date tripEndDate = null;
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

            tripStartDate = formatter.parse(esccoterAddRequest.getTripStart().toString());

            tripEndDate = formatter.parse(esccoterAddRequest.getTripEnd().toString());


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
        eScooter.setTripStart(tripStartDate);
        eScooter.setTripEnd(tripEndDate);
        eScooter.setMotorPower(esccoterAddRequest.getMotorPower());
        eScooter.setMaxRange(esccoterAddRequest.getMaxRange());
        eScooter.setMaxWeight(esccoterAddRequest.getMaxWeight());
        eScooter.setScooterWeight(esccoterAddRequest.getScooterWeight());
        eScooter.setMaxSpeed(esccoterAddRequest.getMaxSpeed());
        eScooter.setHost(user.getHost());
        eScooter.setModelName(esccoterAddRequest.getModelName());
        eScooter.setMake(makeService.findMakeByMakeString(esccoterAddRequest.getMake()));
        eScooter.setTrips(0);
        eScooter.setRating(0.0);

        return eScooterRepository.save(eScooter);

    }


    public EScooter save(EScooter eScooter) {
        return eScooterRepository.save(eScooter);
    }

    public List<EScooter> findAllByTripDatesAndLocation(String tripStart, String tripEnd, String country) throws ParseException, IOException {


        Date tripStartDate = null;
        Date tripEndDate = null;
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

        logger.info("locationName" + country);

        if (!tripStart.isEmpty()) {
            tripStartDate = formatter.parse(tripStart);
        }
        if (!tripEnd.isEmpty()) {
            tripEndDate = formatter.parse(tripEnd);
        }

        JsonNode json;
        HttpURLConnection http;
        if (!country.isEmpty()) {
            try {
                URL url = new URL("https://api.geoapify.com/v1/geocode/search?text=" + country.replaceAll(" ", "%20") + "&apiKey=0d1f31ae91154c4c8f9d6002deb16ca3");
                http = (HttpURLConnection) url.openConnection();
                http.setRequestProperty("Accept", "application/json");
                json = jsonConverter.getJson(url);

                JsonNode featuresKey = json.get("features").get(0);
                JsonNode propertiesKey = featuresKey.get("properties");
                JsonNode longitudeKey = propertiesKey.get("lon");
                JsonNode latitudeKey = propertiesKey.get("lat");

                double longitudeFormatted = longitudeKey.asDouble();
                double latitudeFormatted = latitudeKey.asDouble();

                logger.info("long" + longitudeFormatted);
                logger.info("lat" + latitudeFormatted);

                return eScooterRepository.findEscooterByCordsAndDate(tripStartDate, tripEndDate, longitudeFormatted, latitudeFormatted);
            } catch (Exception ex) {

                //if error getting right country name
                ex.printStackTrace();
            }
        }

        return eScooterRepository.findAllByTripDatesAndLocation(tripStartDate, tripEndDate, country);
    }


    public List<EScooter> findAllEscooterAds() throws ParseException {

        //today 30 00:00:00
        //
        //30  -> 59    -> 1
        //29  -> 2
        //28  -> 3


        DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

        Date today = new Date();

        Date todayWithZeroTime = formatter.parse(formatter.format(today));

        //By Today's date subtract three days potential ad days
        long DAY_IN_MS = 1000 * 60 * 60 * 24;


        //QUERY 2 DAYS AGO AND TODAY'S DATE
        List<EScooter> eScootersEligible = eScooterRepository.findAllEscooterAds(new Date(todayWithZeroTime.getTime() - (2 * DAY_IN_MS)), todayWithZeroTime
        );

        Date zeroDaysAgo = new Date(todayWithZeroTime.getTime());
        Date twoDaysAgo = new Date(todayWithZeroTime.getTime() - (2 * DAY_IN_MS));
        Date oneDayAgo = new Date(todayWithZeroTime.getTime() - (1 * DAY_IN_MS));
        Date tommorow = new Date(todayWithZeroTime.getTime() + (1 * DAY_IN_MS));

        List<EScooter> adList = new ArrayList<>();

        logger.info("twodays" + twoDaysAgo);
        logger.info("onedayAgo" + oneDayAgo);
        logger.info("tommorow" + tommorow);

        //check if ads are eligible for today
        for (EScooter e : eScootersEligible) {

            if (e.getAdDate().before(tommorow) && e.getAdDate().compareTo(zeroDaysAgo) == 0) {
                adList.add(e);
            }
            if (e.getAdDate().compareTo(oneDayAgo) == 0 && e.getEscooterAdDays() >= 2) {

                adList.add(e);
            }

            if (e.getAdDate().compareTo(twoDaysAgo) == 0 && e.getEscooterAdDays() >= 3) {
                adList.add(e);
            }

        }


        return adList;
    }


    @Transactional
    public Boolean deleteEscooter(Integer id, String email) {

        Optional<EScooter> eScooter = eScooterRepository.findById(id);
        if (eScooter.isEmpty()) {
            return false;
        }

        logger.info("ingo" + email + "escooter email" + eScooter.get().getHost().getHostUser().getEmail(), "info rmail" + email + "escooter email" + eScooter.get().getHost().getHostUser().getEmail());
        if (!eScooter.get().getHost().getHostUser().getEmail().equals(email)) {
            return false;
        }


        tripService.deleteByEscooterId(id);
        eScooterReviewService.deleteByEscooterId(id);
        eScooterRepository.deleteByEscooterId(id);

        return true;
    }
}
