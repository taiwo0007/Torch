package com.troch.torchApplication.services;

import com.troch.torchApplication.models.Trip;
import com.troch.torchApplication.repositories.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TripService {

    @Autowired
    TripRepository tripRepository;

    public Trip saveTrip(Trip trip){
        return tripRepository.save(trip);

    }

    public Optional<Trip> findTripById(int id){

        return tripRepository.findById(id);
    }
    public Trip findTripByIdCertain(int id){

        return tripRepository.findById(id).get();
    }
}
