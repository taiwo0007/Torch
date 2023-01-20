package com.troch.torchApplication.controllers;


import com.troch.torchApplication.Utilities.ValidateUser;
import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.services.HostService;
import com.troch.torchApplication.services.UserServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;

@Controller
@RequestMapping("/host")
public class HostsController {

    @Autowired
    UserServiceImpl userService;

    @Autowired
    HostService hostService;

    @Autowired
    ValidateUser validateUserutil;

    Logger logger = LoggerFactory.getLogger(EScooterController.class);


    @GetMapping(value = "/hostinfo")
    public String becomeHost(Model model)  {

        //Validator
        HashMap<String, Object> validatorObj =  validateUserutil.isUserAuthenticated();
        if((Boolean)validatorObj.get("authenticated")){
            model.addAttribute("user",validatorObj.get("currentUserObj"));

        }
        return "host/becomehost";
    }

    @GetMapping(value = "/createHost")
    public String processHost(Model model) throws Exception {

        HashMap<String, Object> validatorObj =  validateUserutil.isUserAuthenticated();
        if((Boolean)validatorObj.get("authenticated")){
            model.addAttribute("user",validatorObj.get("currentUserObj"));

        }



        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            String currentUserName = authentication.getName();
//            return currentUserName;

            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username;
            if (principal instanceof UserDetails) {
                 username = ((UserDetails)principal).getUsername();
            } else {
                 username = principal.toString();
            }

            User currentUser = userService.findUserByEmail(username);

            if(currentUser.getHost() == null && currentUser.getIsVerified() != null && currentUser.getIsVerified()){

                Host formNewHost = new Host();
                formNewHost.setId(currentUser.hashCode());
                formNewHost.setHostUser(currentUser);
                currentUser.setHost(formNewHost);
                currentUser.setIsHost(true);

                userService.saveUser(currentUser);
//            hostService.save(formNewHost);

                model.addAttribute("host", formNewHost);
                model.addAttribute("user", currentUser);

                return "host/hostCreated";
            }
            else if(currentUser.getHost() != null ){
                model.addAttribute("user",validatorObj.get("currentUserObj"));
                model.addAttribute("error", "You are already a Host User");
            }
            else{
                model.addAttribute("user",validatorObj.get("currentUserObj"));
                model.addAttribute("error", "You must be verified to become a host");
            }
        }
        else{

            //Validator
            if((Boolean)validatorObj.get("authenticated")){
                model.addAttribute("user",validatorObj.get("currentUserObj"));

            }
            model.addAttribute("user",validatorObj.get("currentUserObj"));
            model.addAttribute("error", "You must have a user account to become a host");
        }

        return "host/becomehost";
    }




    @GetMapping("/view-host-trips")
    public String viewHostTrips(Model model) throws Exception {

        HashMap<String, Object> validatorObj = validateUserutil.isUserAuthenticated();
        User user = null;
        if ((Boolean) validatorObj.get("authenticated")) {
            model.addAttribute("user", validatorObj.get("currentUserObj"));
            user = (User) validatorObj.get("currentUserObj");
        }

        if (user == null){
            throw new Exception("You're not logged in");
        }

        if(user.getHost() == null){
            throw new Exception("You must be a host to access this page");
        }

        model.addAttribute("hostTrips", user.getHost().getHostTrips());
        model.addAttribute("totalHostTrips", user.getHost().getHostTrips().size());

        model.addAttribute("escootersInUse", user.getHost().getScooterUseDetail().get("ESCOOTER-IN-USE"));
        model.addAttribute("escootersNotInUse", user.getHost().getScooterUseDetail().get("ESCOOTER-NOT-IN-USE"));
        model.addAttribute("earned", user.getHost().getScooterUseDetail().get("EARNED"));
        model.addAttribute("cancelled", user.getHost().getScooterUseDetail().get("CANCELLED"));
        model.addAttribute("cancelledRecently", user.getHost().getScooterUseDetail().get("CANCELLED-RECENTLY"));

        return "host/view_host_trips";
    }


}
