package com.troch.torchApplication.repositories;

import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.HostReview;
import com.troch.torchApplication.models.ScooterReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HostReviewRepository extends JpaRepository<HostReview, Integer> {

    public List<HostReview> findAllByHost(Host host);
}
