package com.troch.torchApplication.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.troch.torchApplication.Utilities.CustomMultipartFile;
import com.troch.torchApplication.Utilities.FileUploadUtil;
import com.troch.torchApplication.Utilities.GCPUtil;
import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.dto.EsccoterAddRequest;
import com.troch.torchApplication.dto.EscooterAddResponse;
import com.troch.torchApplication.forms.EScooterForm;
import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.Make;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.services.EScooterService;
import com.troch.torchApplication.services.HostService;
import com.troch.torchApplication.services.MakeService;
import com.troch.torchApplication.services.UserServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
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

    @Autowired
    EScooterService eScooterService;

    @Autowired
    MakeService makeService;

    @Autowired
    FileUploadUtil fileUploadUtil;

    @Autowired
    GCPUtil gcpUtil;


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

    @GetMapping("/scooter-list")
    public ResponseEntity<List<EScooter>> scooterList(@RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByEmail(jwtUtil.extractUsernameFromRawToken(jwt));
        if (user.getHost() == null){
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Integer host_id = user.getHost().getId();

        Host host = hostService.findById(host_id).get();

        List<EScooter> eScooterList = eScooterService.findAllEscootersByHost(host.getId());

        return new ResponseEntity<>(eScooterList, HttpStatus.OK);

    }

    @GetMapping("/makes")
    public ResponseEntity<List<Make>> getAllMakes(){

        return new ResponseEntity<>(makeService.findAllMake(), HttpStatus.OK);

    }

    @PostMapping("/add-escooter")
    @ResponseStatus(HttpStatus.CREATED)
    public EscooterAddResponse scooterAdd(@RequestBody EsccoterAddRequest esccoterAddRequest, @RequestHeader("Authorization") String jwt) throws Exception {


//        byte[] imgBytes = Base64.getDecoder().decode(esccoterAddRequest.getImage().getBytes());
        logger.info(esccoterAddRequest.getImage());

        int commanIndex = esccoterAddRequest.getImage().indexOf(",");
        String base64EncodedString = esccoterAddRequest.getImage().substring(commanIndex +1);

        logger.info(base64EncodedString);
        byte[] imgBytes = Base64.getDecoder().decode(base64EncodedString);

        CustomMultipartFile customMultipartFile = new CustomMultipartFile(imgBytes,esccoterAddRequest.getFileName() );

        logger.info("" +esccoterAddRequest.getImage());
        gcpUtil.uploadObject(customMultipartFile);
        return eScooterService.addEscooterFromForm(esccoterAddRequest, jwt);
    }


}
