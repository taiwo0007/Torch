package com.troch.torchApplication.services;


import com.troch.torchApplication.dto.HostScooterReviewRequest;
import com.troch.torchApplication.dto.ScooterReviewRequest;
import com.troch.torchApplication.models.*;
import com.troch.torchApplication.repositories.EscooterReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class EScooterReviewService {


    @Autowired
    EscooterReviewRepository escooterReviewRepository;

    @Autowired
    EScooterService eScooterService;

    @Autowired
    TripService tripService;

    @Autowired
    HostService hostService;

    @Autowired
    UserServiceImpl userService;


    @Autowired
    HostReviewService hostReviewService;

    public ScooterReview save(ScooterReview escooterReview){
        return escooterReviewRepository.save(escooterReview);
    }

    public ScooterReview saveCustom(User user, ScooterReviewRequest scooterReviewRequest) throws Exception {

        ScooterReview scooterReview = new ScooterReview();
        Optional<EScooter> eScooter = eScooterService.findEScooter(scooterReviewRequest.getEScooterId());

        if(eScooter.isEmpty()){
            throw new Exception("Escooter Not found");
        }
        scooterReview.setEScooter(eScooter.get());
        scooterReview.setScooter_reviewer(user);
        scooterReview.setComment(scooterReviewRequest.getComment());
        scooterReview.setStarRating(scooterReviewRequest.getStarRating());
        scooterReview.setReviewDate(new Date());
        return escooterReviewRepository.save(scooterReview);
    }

    public List<ScooterReview> findAllReviewsByScooter(Integer id){

        return escooterReviewRepository.findScooterReviewsByeScooter_IdOrderByReviewDateDesc(id);
    }

    public ResponseEntity saveReviews(HostScooterReviewRequest hostScooterReviewRequest, String email) {

        Trip trip = tripService.findByFormattedTripId(hostScooterReviewRequest.getTripID());
        User user = userService.findUserByEmail(email);
        HostReview hostReview = new HostReview();
        Host host = trip.getTrip_owner();

        ScooterReview scooterReview = new ScooterReview();
        scooterReview.setEScooter(trip.getEScooterOnTrip());
        scooterReview.setReviewDate(new Date());
        scooterReview.setScooter_reviewer(user);
        scooterReview.setComment(hostScooterReviewRequest.getEscooter_comment());
        scooterReview.setStarRating(hostScooterReviewRequest.getEscooter_starRating());

        hostReview.setUser_reviewer(user);
        hostReview.setHost(host);
        hostReview.setComment(hostScooterReviewRequest.getHost_comment());
        hostReview.setStarRating(hostScooterReviewRequest.getHost_starRating());
        hostReview.setReviewDate(new Date());

        escooterReviewRepository.save(scooterReview);
        hostReviewService.save(hostReview);

        return new ResponseEntity(HttpStatus.CREATED);
    }


    void deleteEscooterReview(EScooter eScooter){
        escooterReviewRepository.deleteAllByeScooter(eScooter);
    }

    @Transactional
  public   void deleteByEscooterId(Integer id){
        escooterReviewRepository.deleteByEscooterId(id);
    }
}
