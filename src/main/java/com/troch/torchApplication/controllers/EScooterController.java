package com.troch.torchApplication.controllers;


import com.troch.torchApplication.Utilities.FileUploadUtil;
import com.troch.torchApplication.forms.EScooterForm;
import com.troch.torchApplication.models.Trip;
import com.troch.torchApplication.services.*;
import org.springframework.data.repository.query.Param;
import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.Make;
import com.troch.torchApplication.models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static java.time.temporal.ChronoUnit.DAYS;

@Controller
public class EScooterController {

    Logger logger = LoggerFactory.getLogger(EScooterController.class);

    @Autowired
    FileUploadUtil fileUploadUtil;

    @Autowired
    EScooterService eScooterService;

    @Autowired
    UserServiceImpl userServiceimpl;

    @Autowired
    MakeService makeService;

    @Autowired
    UserServiceImpl userServiceImpl;

    @Autowired
    TripService tripService;

    @GetMapping(value = "/")
    public String index(ModelMap map, Model model)  {

        List<EScooter> scooters = eScooterService.findAllEScooters();
        List<User> userList = userServiceimpl.findAllUsers();
        List<Make> makeList = makeService.findAllMake();


        map.addAttribute("userList", userList);
        map.addAttribute("scooters", scooters);
        map.addAttribute("makeList", makeList);

        if( SecurityContextHolder.getContext().getAuthentication() != null &&
                SecurityContextHolder.getContext().getAuthentication().isAuthenticated() &&
                //when Anonymous Authentication is enabled
                !(SecurityContextHolder.getContext().getAuthentication()
                        instanceof AnonymousAuthenticationToken) ){

            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username;

            if (principal instanceof UserDetails) {
                username = ((UserDetails)principal).getUsername();
            } else {
                username = principal.toString();
            }


            User currentUserObj = userServiceImpl.findUserByEmail(username);

            model.addAttribute("user", currentUserObj);
        }
        else{
            model.addAttribute("user", null);
        }

        model.addAttribute("escooterSearch", new EScooterForm());
        return "index";

    }





    @PostMapping("/upload")
    public String uploadImage(Model model, @RequestParam("image") MultipartFile file) throws IOException {


        fileUploadUtil.saveFile(file);
        User savedUser = userServiceimpl.findUser(2);
        savedUser.setProfilePicture("/images/uploads/"+file.getOriginalFilename().toLowerCase());
        userServiceimpl.saveUser(savedUser);
        model.addAttribute("msg", "Uploaded images: " + file.getOriginalFilename().toString());
        return "index";
    }

    @GetMapping("/findEscooters")
    public String findEscooters( Model model,@ModelAttribute("escootersearch") EScooterForm escooterSearch){

        List<EScooter> eScooterList = eScooterService.findAllByTripDatesAndLocation(escooterSearch.getTripStart(), escooterSearch.getTripEnd(), escooterSearch.getCountry());
        model.addAttribute("escooterList", eScooterList);
        logger.info("hellow orld");
        return "EScooter/results";

    }
    @GetMapping("/EScooterDetail/{id}")
    public String EScooterDetail(@PathVariable("id") Integer id, Model model) throws Exception {



        Optional<EScooter> escooter = eScooterService.findEScooter(id);
        if(escooter.isPresent()){
            model.addAttribute("escooter", escooter.get());
            model.addAttribute("trip", new Trip());

        }
        else {
            throw new Exception("Cannot find escooter");
        }

        List<User> scooterUser = userServiceimpl.findAllUsers();

        return "EScooter/EScooterDetail";

    }
    @GetMapping("/escooterBooking/{id}")
    public String escooterBooking(@PathVariable("id") Integer id, Model model, @ModelAttribute("trip")  Trip trip) throws Exception {


        if( SecurityContextHolder.getContext().getAuthentication() != null &&
                SecurityContextHolder.getContext().getAuthentication().isAuthenticated() &&
                //when Anonymous Authentication is enabled
                !(SecurityContextHolder.getContext().getAuthentication()
                        instanceof AnonymousAuthenticationToken) ){

            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username;

            if (principal instanceof UserDetails) {
                username = ((UserDetails)principal).getUsername();
            } else {
                username = principal.toString();
            }

            EScooter eScooter = eScooterService.findEScooter(id).get();
            if(eScooter == null){
                throw new Exception("No escooter");
            }

            User currentUserObj = userServiceImpl.findUserByEmail(username);



            Date startingDate = trip.getTripStart();
            Date endingDate = trip.getTripEnd();
            trip.setUser_renter(currentUserObj);
            trip.setTrip_owner(eScooter.getHost());

            int days = Math.abs(startingDate.getDate() - endingDate.getDate());

            logger.info(String.valueOf(startingDate.getDate()));

            trip.setTripCost(eScooter.getCost() * days + 20);

            trip.setEScooterOnTrip(eScooter);

            tripService.saveTrip(trip);
            eScooter.getEscooterTrips().add(trip);
            model.addAttribute("days", days);
            model.addAttribute("user", currentUserObj);
            model.addAttribute("escooter", eScooter);
            model.addAttribute("normalCost", eScooter.getCost()*days);
            return "Escooter/EscooterBooking";

        }
        else{
            throw new Exception("You must log in to book  ");
        }


    }

    @GetMapping("/processTrip/{id}")
    public String escooterBookingTrip(Model model, @ModelAttribute("trip")  Trip trip){

        return "Escooter/EscooterBooking";
    }



}
