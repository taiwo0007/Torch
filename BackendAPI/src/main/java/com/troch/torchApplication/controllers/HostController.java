package com.troch.torchApplication.controllers;
import com.troch.torchApplication.Utilities.FileUploadUtil;
import com.troch.torchApplication.Utilities.GCPUtil;
import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.dto.CreateAdRequest;
import com.troch.torchApplication.dto.EsccoterAddRequest;
import com.troch.torchApplication.models.*;
import com.troch.torchApplication.services.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.text.ParseException;
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
    InsuranceService insuranceService;

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


    @GetMapping("/host-details/{id}")
    public Host getHostDetails(@PathVariable("id") Integer id) throws Exception {

        Optional<Host> host = hostService.findById(id);

        if(host.isEmpty()){
            throw new Exception("Host no tfound");
        }

        return host.get();

    }

    @PutMapping("/create-ad")
    public ResponseEntity createAd(@RequestBody CreateAdRequest createAdRequest, Principal principal) throws ParseException {

        logger.info("created"+createAdRequest.getAdDays() +principal.getName());



        return hostService.createAd(createAdRequest, principal.getName());

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

    @PostMapping("/make-user-host/{insuranceId}")
    public ResponseEntity makeUserHost(@RequestHeader("Authorization") String jwt, @PathVariable("insuranceId") Integer insuranceId){
        logger.info(String.format("Insurance id: %s", insuranceId) );

        return hostService.makeUserHost(jwt, insuranceId);
    }

    @GetMapping("/scooter-list/{id}")
    public ResponseEntity<List<EScooter>> scooterList(@PathVariable Integer id) throws Exception {

        logger.info(id.toString());

        return hostService.getHostEscooters(id);

    }

    @GetMapping("/insurance-list")
    public ResponseEntity<List<Insurance>> getAllInsurances() {
        return new ResponseEntity<>(insuranceService.findAllInsurance(), HttpStatus.OK);

    }

    @GetMapping("/top")
    public ResponseEntity topHosts() throws Exception {

        return hostService.getTopHosts();

    }

    @GetMapping("/makes")
    public ResponseEntity<List<Make>> getAllMakes(){

        return new ResponseEntity<>(makeService.findAllMake(), HttpStatus.OK);

    }

    @PostMapping("/add-escooter")
    public EScooter scooterAdd(@RequestBody EsccoterAddRequest esccoterAddRequest, @RequestHeader("Authorization") String jwt) throws Exception {

        return eScooterService.addEscooterFromForm(esccoterAddRequest, jwt);
    }


}
