package com.troch.torchApplication.Services;


import com.troch.torchApplication.Utilities.FileUploadUtil;
import com.troch.torchApplication.Utilities.GCPUtil;
import com.troch.torchApplication.Utilities.JSONConverter;
import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.repositories.EScooterRepository;
import com.troch.torchApplication.services.*;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@SpringBootTest
public class EscooterServiceTest {


    @Mock
    EScooterService eScooterServiceMock;


    @InjectMocks
    EScooterRepository eScooterRepository;

    @InjectMocks
    TripService tripService;

    @InjectMocks
    UserServiceImpl userService;

    @InjectMocks
    FileUploadUtil fileUploadUtil;

    @InjectMocks
    JwtUtil jwtUtil;

    @InjectMocks
    JSONConverter jsonConverter;

    @InjectMocks
    GCPUtil gcpUtil;

    @InjectMocks
    MakeService makeService;

    @InjectMocks
    EScooterReviewService eScooterReviewService;



//    @Test
//    public void findAllByTripDatesAndLocationTest(){
//
//        String tripStart = "2000-10-10";
//        String tripEnd = "2000-11-11";
//        String country = "Ireland";
//
//        List<EScooter> escooterList = new ArrayList<EScooter>();
//        escooterList.add(new EScooter());
//        escooterList.get(0).set
//
//        when(eScooterRepository.findAllByTripDatesAndLocation(any(), any(), anyString()))
//                .thenReturn()
//
//
//
//
//    }




}
