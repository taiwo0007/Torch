package com.troch.torchApplication.services;


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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
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
            Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
                    loginRequest.getPassword()));
            User user = userServiceimpl.findUserByEmail(loginRequest.getEmail());

            SecurityContextHolder.getContext().setAuthentication(authenticate);
            String token = jwtUtil.generateToken(loginRequest.getEmail());
            Date expiresDate = jwtUtil.extractExpiration(token);

            return new ResponseEntity(AuthenticationResponse.builder()
                    .authToken(token)
                    .email(loginRequest.getEmail())
                    .expiresAt(expiresDate)
                    .isHost(user.getHost()!= null)
                    .build(), HttpStatus.OK);
        } catch (BadCredentialsException e){

            return new ResponseEntity(new ErrorResponse("Invalid username or password"), HttpStatus.UNAUTHORIZED);
        }
        catch (Exception e){
            return new ResponseEntity(new ErrorResponse("An error has occured while processing your request"), HttpStatus.UNAUTHORIZED);
        }

    }


    public AuthenticationResponse signup(RegisterRequest registerRequest){
        User user = new User(registerRequest.getFirstName(),
                registerRequest.getLastName(), registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()), Arrays.asList(new Role("ROLE_USER")));

            userRepository.save(user);

        String token = jwtUtil.generateToken(registerRequest.getEmail());

        return AuthenticationResponse.builder()
                .authToken(token)
                .email(registerRequest.getEmail())
                .isHost(false)
                .build();
    }

}
