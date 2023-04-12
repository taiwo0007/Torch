package com.troch.torchApplication.controllers;

import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.dto.TripCreateRequest;
import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.Trip;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.repositories.TripRepository;
import com.troch.torchApplication.services.EScooterService;
import com.troch.torchApplication.services.TripService;
import com.troch.torchApplication.services.UserServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequestMapping("/api/trips")
@RestController
public class TripController {

    @Autowired
    TripService tripService;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    EScooterService eScooterService;

    @Autowired
    UserServiceImpl userService;

    Logger logger = LoggerFactory.getLogger(TripController.class);


    @PostMapping("/create-new-trip")
    public Trip createNewTrip(@RequestHeader("Authorization") String jwt,
                              @RequestBody TripCreateRequest tripCreateRequest) throws Exception {

        User user = userService.findUserByEmail(jwtUtil.extractUsernameFromRawToken(jwt));

        Optional<EScooter> eScooter = eScooterService.findEScooter(tripCreateRequest.getEid());


        if(eScooter.isEmpty()){
            throw new Exception("Escooter not found ");
        }


        return tripService.createNewTrip(tripCreateRequest, eScooter.get(), user);


    }

    @GetMapping("/trip-detail/{id}")
    public ResponseEntity<Trip> getTripDetail(@RequestHeader("Authorization") String jwt,
                                        @PathVariable("id") Integer id) throws Exception {
        User user = userService.findUserByEmail(jwtUtil.extractUsernameFromRawToken(jwt));

        Trip retrievedTrip = tripService.findTripByIdCertain(id);

        if(retrievedTrip.getTrip_owner().getHostUser() == user || retrievedTrip.getUser_renter() == user){
            return new ResponseEntity<>(retrievedTrip, HttpStatus.OK);
        }

         return new ResponseEntity<>(HttpStatus.FORBIDDEN);

    }


    @PutMapping("/complete-trip/{id}")
    public ResponseEntity<Trip> completeTrip(@RequestHeader("Authorization") String jwt,
                                              @PathVariable("id") Integer id) throws Exception {
        logger.info("asdfasf", "asfasdf");

        return tripService.updateTrip(true, id, jwt);


    }

    @PutMapping("/cancel-trip/{id}")
    public ResponseEntity<Trip> cancelTrip(@RequestHeader("Authorization") String jwt,
                                             @PathVariable("id") Integer id) throws Exception {

        System.out.println("Cancel trip");
        logger.info("asdfasf", "asfasdf");
        return tripService.updateTrip(false, id, jwt);


    }
}
