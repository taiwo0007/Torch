package com.troch.torchApplication.services;

import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.controllers.HostController;
import com.troch.torchApplication.dto.ErrorResponse;
import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.repositories.HostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.swing.*;
import java.util.List;
import java.util.Optional;

@Service
public class HostService {


    @Autowired
    HostRepository hostRepository;

    @Autowired
    UserServiceImpl userService;

    @Autowired
    EScooterService eScooterService;

    @Autowired
    JwtUtil jwtUtil;

    Logger logger = LoggerFactory.getLogger(HostService.class);


    public Host save(Host host){
        return hostRepository.save(host);
    }

    public Host findHostByUser(User user){

        return hostRepository.findByHostUser(user);
    }

    public Optional<Host> findById(int id){

        return hostRepository.findById(id);
    }

    public ResponseEntity<List<EScooter>> getHostEscooters(Integer id){

//        User user = userService.findUserByEmail(jwtUtil.extractUsernameFromRawToken(jwt));
//        if (user.getHost() == null){
//            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
//        }
//
//        Integer host_id = user.getHost().getId();

        Host host = hostRepository.findById(id).get();

        logger.info("Host objec"+host);

        List<EScooter> eScooterList = eScooterService.findAllEscootersByHost(host.getId());

        logger.info("Host Escooters"+eScooterList);

        return new ResponseEntity<>(eScooterList, HttpStatus.OK);
    }

    public ResponseEntity makeUserHost(String jwt) {

        User currentUser = userService.findUserByEmail(jwtUtil.extractUsernameFromRawToken(jwt));

        if (currentUser.getHost() == null && currentUser.getIsVerified() != null && currentUser.getIsVerified()) {

            Host formNewHost = new Host();
            formNewHost.setId(currentUser.hashCode());
            formNewHost.setHostUser(currentUser);
            currentUser.setHost(formNewHost);
            currentUser.setIsHost(true);

            userService.saveUser(currentUser);
            hostRepository.save(formNewHost);

            return new ResponseEntity<>(formNewHost, HttpStatus.CREATED);
        } else if (currentUser.getHost() != null) {

            return new ResponseEntity<>(new ErrorResponse("You are already a Host User"), HttpStatus.BAD_REQUEST);
        }
        else if(currentUser.getIsVerified() != true){
            return new ResponseEntity<>(new ErrorResponse("You must be verified to become a host"), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new ErrorResponse("You must be signed in & verified"), HttpStatus.BAD_REQUEST);
    }

}
