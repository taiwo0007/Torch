package com.troch.torchApplication.services;

import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.repositories.HostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HostService {


    @Autowired
    HostRepository hostRepository;



    public Host save(Host host){
        return hostRepository.save(host);
    }

    public Host findHostByUser(User user){

        return hostRepository.findByHostUser(user);
    }
}
