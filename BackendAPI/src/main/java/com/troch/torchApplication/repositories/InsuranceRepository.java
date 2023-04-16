package com.troch.torchApplication.repositories;

import com.troch.torchApplication.models.Insurance;
import com.troch.torchApplication.models.ScooterReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsuranceRepository extends JpaRepository<Insurance, Integer> {


}
