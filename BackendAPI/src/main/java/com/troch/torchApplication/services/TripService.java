package com.troch.torchApplication.services;

import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.dto.ErrorResponse;
import com.troch.torchApplication.dto.TripCreateRequest;
import com.troch.torchApplication.enums.TripStatus;
import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.Trip;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.repositories.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TripService {

    @Autowired
    TripRepository tripRepository;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserServiceImpl userService;

    public Optional<Trip> findTripById(int id){

        return tripRepository.findById(id);
    }
    public Trip findTripByIdCertain(int id){

        return tripRepository.findById(id).get();
    }

    public Trip createNewTrip(TripCreateRequest tripCreateRequest,EScooter eScooter, User user) {

        String uniqueString = new SecureRandom().ints(0, 24)
                .mapToObj(i -> Integer.toString(i, 24))
                .map(String::toUpperCase).distinct().limit(12).collect(Collectors.joining())
                .replaceAll("([A-Z0-9]{4})", "$1-").substring(0,14);


        Trip trip = new Trip();

        //Activate the trip
        trip.setStatus(TripStatus.ACTIVE);
        trip.setTripId(uniqueString);
        trip.setTrip_owner(eScooter.getHost());
        trip.setTripCost(tripCreateRequest.getTripCost());
        trip.setEScooterOnTrip(eScooter);
        trip.setTripStart(tripCreateRequest.getTripStart());
        trip.setTripEnd(tripCreateRequest.getTripEnd());
        trip.setUser_renter(user);
        trip.setDays(tripCreateRequest.getTripDays());

        List<String> formatString = Arrays.asList(trip.getEScooterOnTrip().getAddress().split(","));

        return tripRepository.save(trip);

    }

    public Trip saveTrip(Trip trip){
        return tripRepository.save(trip);

    }

    public ResponseEntity completeTrip(Integer id, String jwt) {

        try{
            User user = userService.findUserByEmail(jwtUtil.extractUsernameFromRawToken(jwt));

            Optional<Trip> retrivedTrip = tripRepository.findById(id);
            if(retrivedTrip.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            if(retrivedTrip.get().getUser_renter() != user){
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            retrivedTrip.get().setStatus(TripStatus.COMPLETED);

            return new ResponseEntity(this.tripRepository.save(retrivedTrip.get()), HttpStatus.ACCEPTED);

        }
        catch (Exception ex){
            return new ResponseEntity<>(new ErrorResponse("An Error has occuRred"), HttpStatus.BAD_REQUEST);
        }



    }
}
