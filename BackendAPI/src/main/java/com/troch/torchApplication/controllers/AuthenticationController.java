package com.troch.torchApplication.controllers;

import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.dto.*;
import com.troch.torchApplication.services.AuthService;
import com.troch.torchApplication.services.UserServiceImpl;
import org.apache.catalina.webresources.JarWarResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

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

    @CrossOrigin(origins = "http://localhost:4200")

    @PostMapping("/login")
    private ResponseEntity logIn(@RequestBody LoginRequest loginRequest) throws Exception {
        return authService.login(loginRequest);
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
