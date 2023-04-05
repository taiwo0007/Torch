package com.troch.torchApplication.repositories;

import com.troch.torchApplication.models.HostReview;
import com.troch.torchApplication.models.ScooterReview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HostReviewRepository extends JpaRepository<HostReview, Integer> {
}
