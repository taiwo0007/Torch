package com.troch.torchApplication.controllers;

import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.services.EScooterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/escooter")
public class EScooterController {


    Logger logger = LoggerFactory.getLogger(EScooterController.class);

    @Autowired
    EScooterService eScooterService;


    @GetMapping("/findescooters")
    private ResponseEntity<List<EScooter>> findEscooterByParams(@RequestParam String tripStart,
                                                                @RequestParam String tripEnd,
                                                                @RequestParam String location) throws ParseException {


        List<EScooter> eScooterList = eScooterService.findAllByTripDatesAndLocation(tripStart, tripEnd, location);

        logger.info("Esccoters returned from query" +
                "TripStart:"+tripStart
                +"TripEnd: " +tripEnd
                +"Locatioin: "+location
                +"Escooters: " +eScooterList);

        if (eScooterList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }


        return new ResponseEntity<>(eScooterList, HttpStatus.OK);


    }
}
