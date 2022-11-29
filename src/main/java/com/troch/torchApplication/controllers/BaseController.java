package com.troch.torchApplication.controllers;

import com.troch.torchApplication.Utilities.ValidateUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.HashMap;


@Controller
public class BaseController {


    @Autowired
    ValidateUser validateUserutil;

    @GetMapping(value = "/error")
    public String errorPage(Model model){

        //Validator
        HashMap<String, Object> validatorObj =  validateUserutil.isUserAuthenticated();
        if((Boolean)validatorObj.get("authenticated")){
            model.addAttribute("user",validatorObj.get("currentUserObj"));
        }

        return "error";
    }
}
