package com.troch.torchApplication.controllers;


import com.troch.torchApplication.Utilities.FileUploadUtil;
import com.troch.torchApplication.Utilities.ValidateUser;
import com.troch.torchApplication.dto.Response;
import com.troch.torchApplication.forms.EScooterForm;
import com.troch.torchApplication.forms.ScooterReviewForm;
import com.troch.torchApplication.models.*;
import com.troch.torchApplication.services.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;


@Controller
public class EScooterController {

    Logger logger = LoggerFactory.getLogger(EScooterController.class);

    @Autowired
    ValidateUser validateUserutil;


    @Autowired
    FileUploadUtil fileUploadUtil;

    @Autowired
    EScooterReviewService eScooterReviewService;

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

    @Value("${stripe.keys.public}")
    private String API_PUBLIC_KEY;

    @Autowired
    private StripeService stripeService;

    @GetMapping("/checkout")
    public String chargePage(Model model){

        model.addAttribute("stripePublicKey", API_PUBLIC_KEY);

        return "checkout";
    }

    @GetMapping(value = "/stripe")
    public String Stripe(ModelMap map, Model model) {

        return "checkouttest";

    }


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

        HashMap<String, Object> validatorObj =  validateUserutil.isUserAuthenticated();
        if((Boolean)validatorObj.get("authenticated") == false){
            model.addAttribute("isAuthenticated", false);

        }
        else{
            model.addAttribute("isAuthenticated", true);

        }

        List<ScooterReview> allScootersReview = eScooterReviewService.findAllReviewsByScooter(id);
        double averageRating = 0.0;

        int one = 0,two =0, three = 0, four = 0, five = 0;
        for(ScooterReview scoot : allScootersReview){
            if(scoot.getStarRating() == 1){
                one++;
            }
            if(scoot.getStarRating() == 2){
                two++;
            }
            if(scoot.getStarRating() == 3){
                three++;
            }
            if(scoot.getStarRating() == 4){
                four++;
            }
            if(scoot.getStarRating() == 5){
                five++;
            }

             averageRating = (five * 5 + four * 4 + three * 3 + two * 2 + one * 1) / (five+four+three+two+one);

        }
        model.addAttribute("reviews", allScootersReview);

        Optional<EScooter> escooter = eScooterService.findEScooter(id);
        Trip newTrip = new Trip();

        if(escooter.isPresent()){
            ScooterReviewForm ScooterReviewForm = new ScooterReviewForm();

            //Add review number and save in db
            escooter.get().setRating(averageRating);
            eScooterService.save(escooter.get());


            model.addAttribute("escooter", escooter.get());
            model.addAttribute("trip", newTrip);
            model.addAttribute("ScooterReviewForm", ScooterReviewForm);

        }
        else {
            model.addAttribute("error", "Cannot find escooter selected");
            return "error";        }

        List<User> scooterUser = userServiceimpl.findAllUsers();

        return "EScooter/EScooterDetail";

    }

    @GetMapping("/escooterBooking/{id}")
    public String escooterBooking(@PathVariable("id") Integer id, Model model, @ModelAttribute("trip") Trip trip) throws Exception {

        String uniqueString = new SecureRandom().ints(0, 24)
                .mapToObj(i -> Integer.toString(i, 24))
                .map(String::toUpperCase).distinct().limit(12).collect(Collectors.joining())
                .replaceAll("([A-Z0-9]{4})", "$1-").substring(0,14);



        Trip bookingTrip = new Trip();
        model.addAttribute("stripePublicKey", API_PUBLIC_KEY);

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
            bookingTrip.setTripId(uniqueString);
            eScooter.setTrips(eScooter.getTrips()+1);

            int days = Math.abs(startingDate.getDate() - endingDate.getDate());

            bookingTrip.setTripCost(eScooter.getCost() * days + 20);
            bookingTrip.setEScooterOnTrip(eScooter);
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

    @GetMapping("/processTrip/")
    public String escooterBookingTrip(@RequestParam Integer tripId, Model model) throws Exception {


        Trip trip = new Trip();
        Optional<Trip> optionalTrip = tripService.findTripById(tripId);

        if(!optionalTrip.isPresent()){

            model.addAttribute("error", "Escooter not found for this trip");
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

    @PostMapping("/reviewScooter/{scooterId}")
    public String reviewScooter(@PathVariable("scooterId") Integer scooterId, @ModelAttribute("ScooterReviewForm") ScooterReviewForm scooterReviewForm, Model model) throws Exception {


        HashMap<String, Object> validatorObj = validateUserutil.isUserAuthenticated();
        if ((Boolean) validatorObj.get("authenticated") == false) {

            throw new Exception("User not logged in");

        } else {


            EScooter escooter;
            Optional<EScooter> optionalEscooter = eScooterService.findEScooter(scooterId);

            if (!optionalEscooter.isPresent()) {

                model.addAttribute("error", "Escooter not found for this Review");
                return "error";
            } else {

                escooter = optionalEscooter.get();
            }

            ScooterReview scooterReview = new ScooterReview();
            scooterReview.setReviewDate(Calendar.getInstance().getTime());
            scooterReview.setEScooter(escooter);
            scooterReview.setStarRating(scooterReviewForm.getStarRating());
            scooterReview.setComment(scooterReviewForm.getComment());
            scooterReview.setScooter_reviewer((User) validatorObj.get(("currentUserObj")));


            eScooterReviewService.save(scooterReview);


            return "redirect:/EScooterDetail/" + scooterId;

        }


    }

}
