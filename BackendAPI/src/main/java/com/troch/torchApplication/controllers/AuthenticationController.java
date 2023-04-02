package com.troch.torchApplication.controllers;

import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.dto.*;
import com.troch.torchApplication.services.AuthService;
import com.troch.torchApplication.services.EmailService;
import com.troch.torchApplication.services.UserServiceImpl;
import org.apache.catalina.webresources.JarWarResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:4200")
@RestController()
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    AuthenticationManager authenticationManager;


    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    AuthService authService;

    @Autowired
    UserServiceImpl userService;

    @Autowired
    EmailService emailService;


    Logger logger = LoggerFactory.getLogger(AuthenticationController.class);



    @CrossOrigin(origins = "http://localhost:4200")

    @PostMapping("/login")
    private ResponseEntity logIn(@RequestBody LoginRequest loginRequest) throws Exception {
        return authService.login(loginRequest);
    }

    @PostMapping("/verification-email/{code}")
    public ResponseEntity myController(@PathVariable String code){

        logger.info("code"+code);

        return userService.verifyEmail(code);

    }



    @PostMapping("/signup")
    private ResponseEntity SignUp(@RequestBody RegisterRequest registerRequest) throws Exception {
        return authService.signup(registerRequest);
    }

    @PostMapping("/verify")
    private ResponseEntity verifyUser(@RequestBody VerifyRequest verifyRequest, @RequestHeader("Authorization") String jwt) throws Exception {

        return userService.verifyUser(verifyRequest, jwt);
    }
}
