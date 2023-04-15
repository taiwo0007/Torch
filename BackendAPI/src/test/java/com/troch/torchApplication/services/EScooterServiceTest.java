package com.troch.torchApplication.services;

import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.repositories.EScooterRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class EScooterServiceTest {

    @InjectMocks
    private EScooterService eScooterService;


    @Mock
    private EScooterRepository eScooterRepository;

    @Mock
    private TripService tripService;

    @Mock
    EScooterReviewService eScooterReviewService;


    @Test
    public void deleteEscooterTestReturnsTrueTest(){

        //Arrange
        Integer escooterId  = 3;
        String email = "test@gmail.com";
        User user = User.builder().id(1).email(email).build();
        Host host = Host.builder().id(4).hostUser(user).build();

        EScooter eScooter = EScooter.builder().id(3).host(host).build();

        when(eScooterRepository.findById(escooterId)).thenReturn(Optional.ofNullable(eScooter));

        doNothing().when(tripService).deleteByEscooterId(escooterId);
        doNothing().when(eScooterReviewService).deleteByEscooterId(escooterId);
        doNothing().when(eScooterRepository).deleteByEscooterId(escooterId);

        // Act
        Boolean status = eScooterService.deleteEscooter(escooterId, email);

        //Assert
        assertEquals(true, status);

    }

    @Test
    public void deleteEscooterTestReturnsFalseByIncorrectHostTest(){

        //Arrange
        Integer escooterId  = 3;
        String email = "host1@gmail.com";
        User user = User.builder().id(1).email(email).build();
        Host host = Host.builder().id(4).hostUser(user).build();

        EScooter eScooter = EScooter.builder().id(3).host(host).build();

        when(eScooterRepository.findById(escooterId)).thenReturn(Optional.empty());
        // Act
        Boolean status = eScooterService.deleteEscooter(escooterId, "host2@gmail.com");

        //Assert
        assertEquals(false, status);

    }

    @Test
    public void deleteEscooterTestReturnsFalseWithEmptyEscooterTest(){

        //Arrange
        Integer escooterId  = 3;
        String email = "host1@gmail.com";
        User user = User.builder().id(1).email(email).build();
        Host host = Host.builder().id(4).hostUser(user).build();

        EScooter eScooter = EScooter.builder().id(3).host(host).build();

        when(eScooterRepository.findById(escooterId)).thenReturn(Optional.ofNullable(eScooter));
        // Act
        Boolean status = eScooterService.deleteEscooter(escooterId, "host2@gmail.com");

        //Assert
        assertEquals(false, status);

    }


}