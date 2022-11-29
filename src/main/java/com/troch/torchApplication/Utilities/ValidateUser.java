package com.troch.torchApplication.Utilities;

import com.troch.torchApplication.models.User;
import com.troch.torchApplication.services.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.HashMap;

@Component
public class ValidateUser {


    @Autowired
    UserServiceImpl userServiceImpl;


    public HashMap<String, Object> isUserAuthenticated() {

        HashMap<String, Object> validateMap = new HashMap<>();

        if (SecurityContextHolder.getContext().getAuthentication() != null &&
                SecurityContextHolder.getContext().getAuthentication().isAuthenticated() &&
                //when Anonymous Authentication is enabled
                !(SecurityContextHolder.getContext().getAuthentication()
                        instanceof AnonymousAuthenticationToken)) {

            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username;

            if (principal instanceof UserDetails) {
                username = ((UserDetails) principal).getUsername();
            } else {
                username = principal.toString();
            }

            User currentUserObj = userServiceImpl.findUserByEmail(username);


            validateMap.put("username", username);
            validateMap.put("authenticated", true);
            validateMap.put("currentUserObj", currentUserObj);

        } else {
            validateMap.put("currentUserObj", null);

            validateMap.put("authenticated", false);
        }
        return validateMap;


    }
}