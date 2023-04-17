package com.troch.torchApplication.repositories;

import com.troch.torchApplication.models.EScooter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface EScooterRepository extends JpaRepository<EScooter, Integer> {

    List<EScooter> findEscootersByHostId(Integer id);

    void deleteById(Integer id);

    @Modifying
    @Query("DELETE FROM EScooter WHERE id = :id")
    void deleteByEscooterId(@Param("id") Integer id);


    @Query("SELECT e from EScooter e WHERE (:tripStart IS NULL OR e.tripStart >= :tripStart ) AND (:tripEnd IS NULL OR e.tripEnd <= :tripEnd) AND (:country IS NULL OR e.country LIKE %:country%)")
    List<EScooter> findAllByTripDatesAndLocation(@Param("tripStart") @DateTimeFormat(pattern = "yyyy-MM-dd") Date tripStart,
                                                 @Param("tripEnd") @DateTimeFormat(pattern = "yyyy-MM-dd") Date tripEnd, @Param("country") String country);

    @Query("SELECT e FROM EScooter e WHERE e.adDate >= :adDate AND e.adDate <= :todayDate")
    List<EScooter> findAllEscooterAds(@Param("adDate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date adDate,
                                      @Param("todayDate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date todayDate);

    //Within 15 kilometers
    @Query("SELECT e FROM EScooter e WHERE (:tripStart IS NULL OR e.tripStart <= :tripStart ) AND (:tripEnd IS NULL OR e.tripEnd >= :tripEnd) AND ( 6371 * acos( cos( radians(:latitude) ) * cos( radians( e.latitude ) ) * cos( radians( e.longitude ) - radians(:longitude) ) + sin( radians(:latitude) ) * sin(radians(e.latitude)) ) ) <= 15")
    List<EScooter> findEscooterByCordsAndDate(@Param("tripStart") @DateTimeFormat(pattern = "yyyy-MM-dd") Date tripStart,
                                              @Param("tripEnd") @DateTimeFormat(pattern = "yyyy-MM-dd") Date tripEnd,
            @Param("longitude") Double longitude, @Param("latitude") Double latitude);

}
