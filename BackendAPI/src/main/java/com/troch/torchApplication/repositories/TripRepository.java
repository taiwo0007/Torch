package com.troch.torchApplication.repositories;

import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Integer> {

    @Query("SELECT t from Trip t WHERE :trip_id = t.tripId")
    Trip fingbyFormatedTripId(@Param("trip_id") String trip_id);

    @Modifying
    @Query("DELETE FROM Trip t WHERE t.eScooterOnTrip.id = :id")
    void deleteByEscooterId(@Param("id") Integer id);


}
