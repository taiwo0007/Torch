package com.troch.torchApplication.services;

import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.repositories.HostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

    public Optional<Host> findById(int id){

        return hostRepository.findById(id);
    }

//    public List<EScooter> findEscootersByHost(Host host){
//
//        hostRepository.fin
//    }
}
