package com.troch.torchApplication.controllers;

import com.troch.torchApplication.Utilities.FileUploadUtil;
import com.troch.torchApplication.dto.UserRegistrationDto;
import com.troch.torchApplication.forms.EScooterForm;
import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.Make;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.repositories.UserRepository;
import com.troch.torchApplication.services.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/user")
public class UserController {

    private UserService userService;

    @Autowired
    EScooterForm eScooterForm;

    @Autowired
    FileUploadUtil fileUploadUtil;


    @Autowired
    EScooterService eScooterService;

    @Autowired
    HostService hostService;

    @Autowired
    MakeService makeService;

    @Autowired
    UserServiceImpl userServiceImpl;

    @Autowired
    UserRepository userRepository;

    Logger logger = LoggerFactory.getLogger(EScooterController.class);

    public UserController(UserService userService) {
        super();
        this.userService = userService;
    }




    @GetMapping(value = "/signin")
    public String singIn(Model model)  {

        model.addAttribute("error", "Incorrect email or passowrd.");
        return "authentication/signin";

    }





@GetMapping("/scooter-list/{id}")
public String scooterList(@PathVariable("id") Integer id, Model model) throws Exception {

      User user = userServiceImpl.findUser(id);

//      eScooterService.

       model.addAttribute("user", user);



       return "user/view_scooters";

}

    @GetMapping("/scooter-add/{id}")
    public String scooterAdd(@PathVariable("id") Integer id, Model model) throws Exception {


        model.addAttribute("escooterForm", new EScooterForm());
        model.addAttribute("makes", makeService.findAllMake());

        User user  = userServiceImpl.findUser(id);
        model.addAttribute("user", user);






        return "user/add_scooter";

    }

    @PostMapping("/process-add-scooter/{id}")
    public String scooterAdd(@RequestParam("image") MultipartFile file, @PathVariable("id") Integer id, @ModelAttribute("escooterForm")  EScooterForm escooterForm , Model model) throws Exception {

        User user = userServiceImpl.findUser(id);

        model.addAttribute("user", user);
        EScooter eScooter = new EScooter();
        eScooter.setAbout(escooterForm.getAbout());
        eScooter.setCost(escooterForm.getCost());
        eScooter.setScooterWeight(escooterForm.getScooterWeight());
        eScooter.setImage("/images/uploads/"+file.getOriginalFilename().toLowerCase());
        eScooter.setWaterResistant(escooterForm.getWaterResistant());
        eScooter.setTripStart(escooterForm.getTripStart());
        eScooter.setTripEnd(escooterForm.getTripEnd());
        eScooter.setMotorPower(escooterForm.getMotorPower());
        eScooter.setMaxRange(escooterForm.getMaxRange());
        eScooter.setMaxWeight(escooterForm.getMaxWeight());
        eScooter.setScooterWeight(escooterForm.getScooterWeight());
        eScooter.setMaxSpeed(escooterForm.getMaxSpeed());
        eScooter.setHost(user.getHost());
        eScooter.setModelName(eScooter.getModelName());


        fileUploadUtil.saveFile(file);
        eScooterService.save(eScooter);

        model.addAttribute("success", eScooter.getModelName()+" electric scooter has been created.");

        return "user/view_scooters";

    }




    @GetMapping("/profileEdit/{id}")
    public String profileEdit(@PathVariable("id") Integer id, Model model) throws Exception {

        User user = userServiceImpl.findUser(id);

        model.addAttribute("user", user);



        return "user/user_edit_profile";

    }

    @PostMapping("/update/{id}")
    public String updateUser(@PathVariable("id") Integer id, @ModelAttribute("user") User user,
                             BindingResult result, Model model) {
        if (result.hasErrors()) {
            user.setId(id);
            return "/user/user_edit_profile";
        }

        User currentUsr = userServiceImpl.findUser(id);
        currentUsr.setIsVerified(true);
        currentUsr.setProfilePicture(user.getProfilePicture());
        currentUsr.setCountry(user.getCountry());
        currentUsr.setPostCode(user.getPostCode());
        currentUsr.setLastName(user.getLastName());
        currentUsr.setPhoneNumber(user.getPhoneNumber());
        currentUsr.setState(user.getState());
        currentUsr.setEmail(currentUsr.getEmail());

        userRepository.save(currentUsr);

        model.addAttribute("user", user);

        return "redirect:/user/profileEdit/"+id;
    }



}
