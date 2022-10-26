package com.troch.torchApplication.repositories;

import com.troch.torchApplication.models.EScooter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EScooterRepository extends JpaRepository<EScooter, Integer> {
}
