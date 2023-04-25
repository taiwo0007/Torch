package com.troch.torchApplication.services;

import com.troch.torchApplication.models.Make;
import com.troch.torchApplication.repositories.MakeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MakeService {

    @Autowired
    MakeRepository makeRepository;
    public List<Make> findAllMake() {
       return makeRepository.findAll();
    }

    public Make findMakeByMakeString(String makeName){
        return  makeRepository.findMakeByName(makeName);
    }


}