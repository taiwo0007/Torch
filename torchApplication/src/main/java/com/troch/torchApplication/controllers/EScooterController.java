package com.troch.torchApplication.controllers;


import com.troch.torchApplication.Utilities.FileUploadUtil;
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
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    @GetMapping(value = "/")
    public String index(ModelMap map)  {

        List<EScooter> scooters = eScooterService.findAllEScooters();
        List<User> userList = userServiceimpl.findAllUsers();
        List<Make> makeList = makeService.findAllMake();


        map.addAttribute("userList", userList);
        map.addAttribute("scooters", scooters);
        map.addAttribute("makeList", makeList);

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


}
