package com.troch.torchApplication.services;


import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.HostReview;
import com.troch.torchApplication.repositories.HostReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HostReviewService {


    @Autowired
    HostReviewRepository hostReviewRepository;


    public HostReview save(HostReview hostReview){

        return hostReviewRepository.save(hostReview);

    }

    public List<HostReview> findAllByHost(Host host){

        return hostReviewRepository.findAllByHost(host);

    }

}
