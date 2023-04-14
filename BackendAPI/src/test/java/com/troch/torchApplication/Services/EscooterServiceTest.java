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
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@SpringBootTest
public class EscooterServiceTest {


    @Mock
    EScooterService eScooterService;


    @InjectMocks
    EScooterRepository eScooterRepository;





    @Test
    public void deleteEscooterTestReturnsTrue(){

        Integer escooterId  = 3;

        EScooter eScooter = EScooter.builder().id(3).build();

        when(eScooterRepository.findById(escooterId)).thenReturn(Optional.ofNullable(eScooter));



    }




}
