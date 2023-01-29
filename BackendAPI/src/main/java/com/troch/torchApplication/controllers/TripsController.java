package com.troch.torchApplication.controllers;


import com.troch.torchApplication.Utilities.ValidateUser;
import com.troch.torchApplication.models.Trip;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.services.TripService;
import com.troch.torchApplication.services.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Optional;

@Controller
@RequestMapping("/trip")
public class TripsController {


    @Autowired
    UserServiceImpl userServiceImpl;

    @Autowired
    TripService tripService;

    @Autowired
    ValidateUser validateUserutil;

    @GetMapping("/trip-detail/{tripId}")
    public String tripDetail(@PathVariable("tripId") Integer tripId, Model model) throws Exception {

        //Validator
        HashMap<String, Object> validatorObj =  validateUserutil.isUserAuthenticated();
        if((Boolean)validatorObj.get("authenticated")){
            model.addAttribute("user",validatorObj.get("currentUserObj"));

        }
        User user = (User)validatorObj.get("currentUserObj");

        if(user == null){
            throw new Exception("User is not logged in");
        }

        Trip trip;
        Optional<Trip> optionalTrip = tripService.findTripById(tripId);

        if(!optionalTrip.isPresent()){
            throw new Exception("No trip with this id found");
        }

        trip = tripService.findTripByIdCertain(tripId);

        if(user != trip.getUser_renter()){
            throw new Exception("You are not the designated User of this trip");
        }

        int days = Math.abs(trip.getTripStart().getDate() - trip.getTripEnd().getDate());

        model.addAttribute("normalCost", trip.getEScooterOnTrip().getCost()*days);
        model.addAttribute("host", trip.getTrip_owner().getHostUser());
        model.addAttribute("escooter", trip.getEScooterOnTrip());
        model.addAttribute("esccoterAddressFormatted", Arrays.asList(trip.getEScooterOnTrip().getAddress().split(",")));
        model.addAttribute("trip", trip);
        model.addAttribute("days", days);

        return "escooter/trip";



    }





}
