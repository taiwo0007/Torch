package com.troch.torchApplication.repositories;

import com.troch.torchApplication.models.EScooter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface EScooterRepository extends JpaRepository<EScooter, Integer> {

    List<EScooter> findEscootersByHostId(Integer id);

    @Query("SELECT e from EScooter e WHERE (:tripStart IS NULL OR e.tripStart >= :tripStart ) AND (:tripEnd IS NULL OR e.tripEnd <= :tripEnd) AND (:country IS NULL OR e.country LIKE %:country%)")
    List<EScooter> findAllByTripDatesAndLocation(@Param("tripStart") @DateTimeFormat(pattern = "yyyy-MM-dd") Date tripStart,
                                                 @Param("tripEnd") @DateTimeFormat(pattern = "yyyy-MM-dd") Date tripEnd, @Param("country") String country);
}
