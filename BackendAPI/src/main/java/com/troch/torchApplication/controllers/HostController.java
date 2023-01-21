package com.troch.torchApplication.controllers;

import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.services.HostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/host")
public class HostController {


    @Autowired
    HostService hostService;

    @GetMapping("/{id}")
    public Host getHostDetails(@PathVariable("id") Integer id) throws Exception {

        Optional<Host> host = hostService.findById(id);

        if(host.isEmpty()){
            throw new Exception("Host no tfound");
        }

        return host.get();

    }

}
