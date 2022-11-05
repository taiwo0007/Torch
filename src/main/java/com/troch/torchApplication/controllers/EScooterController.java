package com.troch.torchApplication.controllers;


import com.troch.torchApplication.Utilities.FileUploadUtil;
import com.troch.torchApplication.forms.EScooterForm;
import com.troch.torchApplication.models.*;
import com.troch.torchApplication.services.*;
import org.springframework.data.repository.query.Param;
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
import java.util.Date;
import java.util.List;
import java.util.Optional;


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
        Trip newTrip = new Trip();

        if(escooter.isPresent()){
            model.addAttribute("escooter", escooter.get());
            model.addAttribute("trip", newTrip);

        }
        else {
            model.addAttribute("error", "Cannot find escooter selected");
            return "error";        }

        List<User> scooterUser = userServiceimpl.findAllUsers();

        return "EScooter/EScooterDetail";

    }
    @GetMapping("/escooterBooking/{id}")
    public String escooterBooking(@PathVariable("id") Integer id, Model model, @ModelAttribute("trip") Trip trip) throws Exception {


        Trip bookingTrip = new Trip();


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
                model.addAttribute("error", "No escooter selected");
                return "error";
            }

            User currentUserObj = userServiceImpl.findUserByEmail(username);

            Date startingDate = trip.getTripStart();
            Date endingDate = trip.getTripEnd();

            bookingTrip.setTripStart(startingDate);
            bookingTrip.setTripEnd(endingDate);
            bookingTrip.setUser_renter(currentUserObj);
            bookingTrip.setTrip_owner(eScooter.getHost());
            eScooter.setTrips(eScooter.getTrips()+1);

            int days = Math.abs(startingDate.getDate() - endingDate.getDate());

            bookingTrip.setTripCost(eScooter.getCost() * days + 20);

            bookingTrip.setEScooterOnTrip(eScooter);

            //database triggers to +1 so overriding here instead of in db code
//            trip.setId(trip.getId());

            tripService.saveTrip(bookingTrip);

            eScooter.getEscooterTrips().add(bookingTrip);


            model.addAttribute("days", days);
            model.addAttribute("user", currentUserObj);
            model.addAttribute("escooter", eScooter);
            model.addAttribute("normalCost", eScooter.getCost()*days);
            model.addAttribute("trip", bookingTrip);
            return "Escooter/EscooterBooking";

        }
        else{
            model.addAttribute("error", "You must log in to book");
            return "error";        }


    }

    @PostMapping("/processTrip/{tripId}")
    public String escooterBookingTrip(@PathVariable("tripId") Integer tripId, Model model) throws Exception {

        Trip trip = new Trip();
        Optional<Trip> optionalTrip = tripService.findTripById(tripId);

        if(!optionalTrip.isPresent()){

            model.addAttribute("error", "Escoter not found for this trip");
            return "error";
        }
        else{

            trip = tripService.findTripByIdCertain(tripId);
        }
        int days = Math.abs(trip.getTripStart().getDate() - trip.getTripEnd().getDate());

        model.addAttribute("normalCost", trip.getEScooterOnTrip().getCost()*days);
        model.addAttribute("host", trip.getTrip_owner().getHostUser());
        model.addAttribute("escooter", trip.getEScooterOnTrip());
        model.addAttribute("trip", trip);
        model.addAttribute("days", days);

        return "Escooter/trip";
    }





}
