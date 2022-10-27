package com.troch.torchApplication.controllers;

import com.troch.torchApplication.dto.UserRegistrationDto;
import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.Make;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.services.UserService;
import com.troch.torchApplication.services.UserServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/user")
public class UserController {

    private UserService userService;

    @Autowired
    UserServiceImpl userServiceImpl;

    Logger logger = LoggerFactory.getLogger(EScooterController.class);

    public UserController(UserService userService) {
        super();
        this.userService = userService;
    }



    @GetMapping(value = "/signin")
    public String singIn()  {

        return "authentication/signin";

    }



    @GetMapping(value = "/sginin")
    public String login()  {

        return "authentication/signin";

    }

    @GetMapping("/profileEdit")
    public String profileEdit(Model model) throws Exception {



        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;

        if (principal instanceof UserDetails) {
            username = ((UserDetails)principal).getUsername();
        } else {
            username = principal.toString();
        }


        User currentUserObj = userServiceImpl.findUserByEmail(username);
        model.addAttribute("user", currentUserObj);



        return "user/user_edit_profile";

    }



}
