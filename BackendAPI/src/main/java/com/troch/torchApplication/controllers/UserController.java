package com.troch.torchApplication.controllers;


import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.services.UserServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {


    @Autowired
    UserServiceImpl userService;

    Logger logger = LoggerFactory.getLogger(EScooterController.class);
    @Autowired
    JwtUtil jwtUtil;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfileData(@RequestHeader("Authorization") String jwt){

        logger.info(jwt);

        User user = userService.findUserByEmail(jwtUtil.extractUsernameFromRawToken(jwt));

        logger.info(""+user);
        return new ResponseEntity<>(user, HttpStatus.OK);

    }
}
