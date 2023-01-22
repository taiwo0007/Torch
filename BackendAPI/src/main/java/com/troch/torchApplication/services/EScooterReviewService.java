package com.troch.torchApplication.services;


import com.troch.torchApplication.dto.ScooterReviewRequest;
import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.ScooterReview;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.repositories.EscooterReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class EScooterReviewService {


    @Autowired
    EscooterReviewRepository escooterReviewRepository;

    @Autowired
    EScooterService eScooterService;




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
}
