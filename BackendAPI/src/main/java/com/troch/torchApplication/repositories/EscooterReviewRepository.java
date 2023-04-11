package com.troch.torchApplication.repositories;


import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.ScooterReview;
import jnr.ffi.annotations.In;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface EscooterReviewRepository extends JpaRepository<ScooterReview, Integer> {

     List<ScooterReview> findScooterReviewsByeScooter_IdOrderByReviewDateDesc(int id);

     @Modifying
     @Query("DELETE FROM ScooterReview s WHERE s.eScooter.id = :id")
     void deleteByEscooterId(@Param("id") Integer id);
     void deleteAllByeScooter(EScooter eScooter);
}
