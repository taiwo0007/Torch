package com.troch.torchApplication.controllers;

import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.dto.UserRegistrationDto;
import com.troch.torchApplication.services.UserService;
import com.troch.torchApplication.services.UserServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/registration")
public class RegistrationController {

    Logger logger = LoggerFactory.getLogger(RegistrationController.class);

    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    UserServiceImpl userServiceimpl;

    public RegistrationController(UserService userService) {
        super();
        this.userService = userService;
    }

    @ModelAttribute("user")
    public UserRegistrationDto userRegistrationDto() {
        return new UserRegistrationDto();
    }

    @GetMapping
    public String singUp(Model model)  {

        model.addAttribute("user", new UserRegistrationDto());

        return "authentication/signup";
    }





//    @PostMapping
//    public String registerUserAccount(@ModelAttribute("user") UserRegistrationDto registrationDto, Model model) throws Exception {
//
//        String formatFirstName = registrationDto.getFirstName().replaceAll(",", "");
//        registrationDto.setFirstName(formatFirstName);
//
//        String formatLastName = registrationDto.getLastName().replaceAll(",", "");
//        registrationDto.setLastName(formatLastName);
//
//        model.addAttribute("success", "You've been successfully registred.");
//
//        logger.info("yes it is working");
//
//
//
//
//
//
//
//
//
//
//
//
//
//        if(userServiceimpl.findUserByEmail(registrationDto.getEmail()) != null){
//
//            model.addAttribute("error", "User with that email already exists");
//            return "authentication/signup";
//        }
//
//            userService.save(registrationDto);
//            return "redirect:/user/signin?success";
//
//    }
}