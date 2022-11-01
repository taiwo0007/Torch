package com.troch.torchApplication.controllers;


import com.troch.torchApplication.Utilities.FileUploadUtil;
import com.troch.torchApplication.forms.EScooterForm;
import org.springframework.data.repository.query.Param;
import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.Make;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.services.EScooterService;
import com.troch.torchApplication.services.MakeService;
import com.troch.torchApplication.services.UserService;
import com.troch.torchApplication.services.UserServiceImpl;
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

    @GetMapping(value = "/data")
    public String data(ModelMap map)  {

        List<User> userList = userServiceimpl.findAllUsers();

        logger.info(userList.get(0).getProfile());

        map.addAttribute("userList", userList);

        return "data";

    }

    @GetMapping("/EScooterDetail/{id}")
    public String EScooterDetail(@PathVariable("id") Integer id, Model model) throws Exception {

        Optional<EScooter> escooter = eScooterService.findEScooter(id);
        if(escooter.isPresent()){
            model.addAttribute("escooter", escooter.get());

//            User userScooter = eScooterService.findUser(id);
//            model.addAttribute("userScooter", userScooter);
//            logger.info(userScooter.getFirstName());
        }
        else {
            throw new Exception("Cannot find user");
        }

        List<User> scooterUser = userServiceimpl.findAllUsers();

        return "EScooter/EScooterDetail";

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

//        logger.info(eScooterList.get(0).getModelName());
        model.addAttribute("escooterList", eScooterList);

        logger.info("hellow orld");

        return "EScooter/results";

    }

    @GetMapping("/escooterBooking")
    public String escooterBooking(Model model){


        return "Escooter/EscooterBooking";
    }



}
