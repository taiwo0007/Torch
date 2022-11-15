package com.troch.torchApplication.repositories;


import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.ScooterReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EscooterReviewRepository extends JpaRepository<ScooterReview, Integer> {

     List<ScooterReview> findScooterReviewsByeScooter_IdOrderByReviewDateAsc(int id);
}
