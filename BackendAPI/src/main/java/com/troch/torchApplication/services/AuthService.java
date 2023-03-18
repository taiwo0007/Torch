package com.troch.torchApplication.services;


import com.google.api.Http;
import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.dto.AuthenticationResponse;
import com.troch.torchApplication.dto.ErrorResponse;
import com.troch.torchApplication.dto.LoginRequest;
import com.troch.torchApplication.dto.RegisterRequest;
import com.troch.torchApplication.models.Role;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.Arrays;

@Service
public class AuthService {


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserService userService;

    @Autowired
    UserServiceImpl userServiceimpl;

    @Autowired
    UserRepository userRepository;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;

    public ResponseEntity login(LoginRequest loginRequest){
        try{
            User user = userServiceimpl.findUserByEmail(loginRequest.getEmail());
            Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
                    loginRequest.getPassword()));


            SecurityContextHolder.getContext().setAuthentication(authenticate);
            String token = jwtUtil.generateToken(loginRequest.getEmail());
            Date expiresDate = jwtUtil.extractExpiration(token);

            return new ResponseEntity(AuthenticationResponse.builder()
                    .authToken(token)
                    .email(loginRequest.getEmail())
                    .expiresAt(expiresDate)
                    .isHost(user.getHost()!= null)
                    .isVerified(user.getIsVerified())
                    .accountType(user.getAccountType())
                    .hostID(user.getHost() != null ? user.getHost().getId() : null)
                    .build(), HttpStatus.OK);
        }
        catch (UsernameNotFoundException e){
            return new ResponseEntity(new ErrorResponse("Username not found"), HttpStatus.UNAUTHORIZED);

        }
        catch (BadCredentialsException e){

            return new ResponseEntity(new ErrorResponse("Invalid username or password"), HttpStatus.UNAUTHORIZED);
        }

        catch (Exception e){
            return new ResponseEntity(new ErrorResponse("An error has occurred while processing your request"), HttpStatus.UNAUTHORIZED);
        }

    }


    @Transactional
    public ResponseEntity signup(RegisterRequest registerRequest){

        try{
            if(userServiceimpl.isAlreadyCreated(registerRequest.getEmail())){
                throw new Exception("There is a Username already with this email");
            };
            User user = new User(registerRequest.getFirstName(),
                    registerRequest.getLastName(), registerRequest.getEmail(),
                    passwordEncoder.encode(registerRequest.getPassword()), Arrays.asList(new Role("ROLE_USER")));

            user.setJoined(new Date());
            userRepository.save(user);

            String token = jwtUtil.generateToken(registerRequest.getEmail());
            Date expiresDate = jwtUtil.extractExpiration(token);

            return new ResponseEntity(AuthenticationResponse.builder()
                    .authToken(token)
                    .email(registerRequest.getEmail())
                    .isHost(false)
                    .isVerified(false)
                    .expiresAt(expiresDate)
                    .accountType(user.getAccountType())
                    .hostID(null)
                    .build(), HttpStatus.OK) ;

        }
        catch (Exception e){
            return new ResponseEntity(new ErrorResponse("User with this email already exists"), HttpStatus.UNAUTHORIZED);
        }



    }

}
