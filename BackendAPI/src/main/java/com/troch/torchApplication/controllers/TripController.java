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

        if(retrievedTrip.getTrip_owner().getHostUser() != user
                || retrievedTrip.getUser_renter() != user){
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(retrievedTrip, HttpStatus.OK);
    }


}
