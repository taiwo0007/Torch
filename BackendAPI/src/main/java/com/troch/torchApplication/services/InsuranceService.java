package com.troch.torchApplication.services;

import com.troch.torchApplication.models.Insurance;
import com.troch.torchApplication.repositories.InsuranceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InsuranceService {

    @Autowired
    InsuranceRepository insuranceRepository;

    public List<Insurance> findAllInsurance(){
        return insuranceRepository.findAll();
    }

    public Optional<Insurance> findById(Integer id){
        return insuranceRepository.findById(id);
    }


}
