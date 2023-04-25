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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TripService {

    @Autowired
    TripRepository tripRepository;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserServiceImpl userService;

    @Autowired
    EScooterService eScooterService;

    public Optional<Trip> findTripById(int id){

        return tripRepository.findById(id);
    }
    public Trip findTripByIdCertain(int id){

        return tripRepository.findById(id).get();
    }

    public Trip createNewTrip(TripCreateRequest tripCreateRequest,EScooter eScooter, User user) throws ParseException {

        String uniqueString = new SecureRandom().ints(0, 24)
                .mapToObj(i -> Integer.toString(i, 24))
                .map(String::toUpperCase).distinct().limit(12).collect(Collectors.joining())
                .replaceAll("([A-Z0-9]{4})", "$1-").substring(0,14);


        System.out.printf("Create Trip start %s",tripCreateRequest.getTripStart());
        System.out.println();
        System.out.printf("Create Trip end %s",tripCreateRequest.getTripEnd());
        System.out.println();

        for(Trip trip:  eScooter.getEscooterTrips()){

            System.out.printf("Trip start %s",trip.getTripStart());
            System.out.println();
            System.out.printf("Trip end %s",trip.getTripEnd());
            System.out.println();

            System.out.println("Comparisons Trip start");
            System.out.println(trip.getTripStart().compareTo(tripCreateRequest.getTripStart()));
            System.out.println();

            System.out.println("Comparisons Trip End");
            System.out.println(trip.getTripEnd().compareTo(tripCreateRequest.getTripEnd()));
            System.out.println();
        }


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

        eScooter.setTrips(eScooter.getTrips() + 1);
        eScooter.setActive(true);

        eScooterService.save(eScooter);


        List<String> formatString = Arrays.asList(trip.getEScooterOnTrip().getAddress().split(","));
        return tripRepository.save(trip);



    }

    public Trip saveTrip(Trip trip){
        return tripRepository.save(trip);

    }

    public Trip findByFormattedTripId(String trip_id){

        return tripRepository.fingbyFormatedTripId(trip_id);
    }

    public void deleteByEscooterId(Integer id){
        tripRepository.deleteByEscooterId(id);
    }

    public ResponseEntity updateTrip(boolean isComplete, Integer id, String jwt) {

        try{
            User user = userService.findUserByEmail(jwtUtil.extractUsernameFromRawToken(jwt));

            Optional<Trip> retrivedTrip = tripRepository.findById(id);
            if(retrivedTrip.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            if(retrivedTrip.get().getUser_renter() == user || retrivedTrip.get().getTrip_owner().getHostUser() == user){
            }
            else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            if(isComplete){
                retrivedTrip.get().setStatus(TripStatus.COMPLETED);
            }
            else {
                retrivedTrip.get().setStatus(TripStatus.CANCELLED);
            }
            EScooter escooter = retrivedTrip.get().getEScooterOnTrip();
            escooter.setActive(false);
            escooter.setTrips(escooter.getTrips() + 1);
            eScooterService.save(escooter);

            return new ResponseEntity(this.tripRepository.save(retrivedTrip.get()), HttpStatus.ACCEPTED);

        }
        catch (Exception ex){
            return new ResponseEntity<>(new ErrorResponse("An Error has occuRred"), HttpStatus.BAD_REQUEST);
        }



    }
}
