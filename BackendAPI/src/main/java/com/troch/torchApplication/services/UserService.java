package com.troch.torchApplication.services;


import com.troch.torchApplication.dto.BasicUserResponse;
import com.troch.torchApplication.dto.RegisterRequest;
import com.troch.torchApplication.dto.UserRegistrationDto;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.repositories.EScooterRepository;
import com.troch.torchApplication.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public interface UserService extends UserDetailsService {

//    User save(RegisterRequest registerRequest);

    @Override
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;


     BasicUserResponse findBasicUser(Integer id) throws UsernameNotFoundException;
}
