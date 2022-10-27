package com.troch.torchApplication.controllers;


import com.troch.torchApplication.models.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/host")
public class HostController {


    @GetMapping(value = "/hostinfo")
    public String becomeHost(ModelMap map)  {




        return "host/becomeHost";

    }



}
