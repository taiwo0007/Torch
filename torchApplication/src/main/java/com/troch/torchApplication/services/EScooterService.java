package com.troch.torchApplication.services;

import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.repositories.EScooterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EScooterService {

    @Autowired
    EScooterRepository eScooterRepository;


    public List<EScooter> findAllEScooters(){

        return eScooterRepository.findAll();

    }


    public Optional<EScooter> findEScooter(Integer id){


        return eScooterRepository.findById(id);

    }

    public EScooter save(EScooter eScooter){
        return eScooterRepository.save(eScooter);
    }

    public Host findUser(Integer id){


        return eScooterRepository.findById(id).get().getHost();

    }






}
