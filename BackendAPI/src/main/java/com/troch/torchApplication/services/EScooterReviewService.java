package com.troch.torchApplication.services;


import com.troch.torchApplication.models.ScooterReview;
import com.troch.torchApplication.repositories.EscooterReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EScooterReviewService {


    @Autowired
    EscooterReviewRepository escooterReviewRepository;




    public ScooterReview save(ScooterReview escooterReview){

        return escooterReviewRepository.save(escooterReview);


    }

    public List<ScooterReview> findAllReviewsByScooter(Integer id){

        return escooterReviewRepository.findScooterReviewsByeScooter_IdOrderByReviewDateDesc(id);
    }
}
