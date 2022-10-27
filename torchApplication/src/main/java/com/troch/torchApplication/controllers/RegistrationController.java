package com.troch.torchApplication.controllers;

import com.troch.torchApplication.dto.UserRegistrationDto;
import com.troch.torchApplication.services.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/registration")
public class RegistrationController {

    private UserService userService;

    public RegistrationController(UserService userService) {
        super();
        this.userService = userService;
    }

    @ModelAttribute("user")
    public UserRegistrationDto userRegistrationDto() {
        return new UserRegistrationDto();
    }

    @GetMapping
    public String singUp()  {


        return "authentication/signup";

    }


    @PostMapping
    public String registerUserAccount(@ModelAttribute("user") UserRegistrationDto registrationDto) {

        String formatFirstName = registrationDto.getFirstName().replaceAll(",", "");
        registrationDto.setFirstName(formatFirstName);

        String formatLastName = registrationDto.getLastName().replaceAll(",", "");
        registrationDto.setLastName(formatLastName);
        userService.save(registrationDto);
        return "redirect:/user/signin?success";
    }
}