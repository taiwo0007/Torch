package com.troch.torchApplication.controllers;

import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.dto.HostScooterReviewRequest;
import com.troch.torchApplication.dto.ScooterReviewRequest;
import com.troch.torchApplication.forms.ScooterReviewForm;
import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.ScooterReview;
import com.troch.torchApplication.models.Trip;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.services.EScooterReviewService;
import com.troch.torchApplication.services.EScooterService;
import com.troch.torchApplication.services.UserServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/escooter")
public class EScooterController {


    Logger logger = LoggerFactory.getLogger(EScooterController.class);

    @Autowired
    EScooterService eScooterService;

    @Autowired
    EScooterReviewService eScooterReviewService;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserServiceImpl userService;


    @GetMapping("/findescooters")
    private ResponseEntity<List<EScooter>> findEscooterByParams(@RequestParam String tripStart,
                                                                @RequestParam String tripEnd,
                                                                @RequestParam String location) throws ParseException, IOException {

        List<EScooter> eScooterList = eScooterService.findAllByTripDatesAndLocation(tripStart, tripEnd, location);
        if (eScooterList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(eScooterList, HttpStatus.OK);


    }
    @GetMapping("/find-escooter-ads")
    private ResponseEntity<List<EScooter>> findEscooterByParams() throws ParseException {

        List<EScooter> eScooterList = eScooterService.findAllEscooterAds();
        return new ResponseEntity<>(eScooterList, HttpStatus.OK);


    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity ResponseEntitydeleteEscooter(@PathVariable("id") Integer id, Principal principal) {
        return eScooterService.deleteEscooter(id, principal.getName()) ? new ResponseEntity(HttpStatus.OK) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }



    @CrossOrigin(origins = "http://localhost:4200")

    @GetMapping("/escooter-reviews/{id}")
    public ResponseEntity<List<ScooterReview>> getScooterReviewByScooterId(@PathVariable("id") Integer id){
        List<ScooterReview> allScootersReview = eScooterReviewService.findAllReviewsByScooter(id);
        return new ResponseEntity<>(allScootersReview, HttpStatus.OK);

    }

    @CrossOrigin(origins = "http://localhost:4200")

    @GetMapping("/escooter-detail/{id}")
    public EScooter getEscooterDetailById(@PathVariable("id") Integer id) throws Exception {
        Optional<EScooter> escooter = eScooterService.findEScooter(id);
        if(escooter.isEmpty()){
            throw new Exception("No Escooter found");
        }
        return escooter.get();
    }


    @CrossOrigin(origins = "http://localhost:4200")

    @PostMapping("/create-review")
    public ScooterReview postScooterReview(@RequestBody ScooterReviewRequest scooterReviewRequest,
                                           @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByEmail(jwtUtil.extractUsernameFromRawToken(jwt));
        logger.info("srr"+scooterReviewRequest);
        logger.info("use"+user);

        return eScooterReviewService.saveCustom(user, scooterReviewRequest);
    }

    @PostMapping("/create-host-scooter-review")
    public ResponseEntity postHostScooterReview(@RequestBody HostScooterReviewRequest hostScooterReviewRequest,
                                               Principal principal) throws Exception {

        return eScooterReviewService.saveReviews(hostScooterReviewRequest, principal.getName());
    }
}
