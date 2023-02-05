package com.troch.torchApplication.controllers;

import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.services.HostService;
import com.troch.torchApplication.services.UserServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    @Autowired
    UserServiceImpl userService;

    @Autowired
    JwtUtil jwtUtil;

    Logger logger = LoggerFactory.getLogger(HostController.class);


    @GetMapping("/{id}")
    public Host getHostDetails(@PathVariable("id") Integer id) throws Exception {

        Optional<Host> host = hostService.findById(id);

        if(host.isEmpty()){
            throw new Exception("Host no tfound");
        }

        return host.get();

    }

    @GetMapping("/host-data")
    public ResponseEntity<Host> getHostDetailByUser(@RequestHeader("Authorization") String jwt){

        User user = userService.findUserByEmail(jwtUtil.extractUsernameFromRawToken(jwt));
        if (user.getHost() == null){
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        logger.info(""+user.getHost() );
        return new ResponseEntity<>(user.getHost(), HttpStatus.OK);

    }

}
