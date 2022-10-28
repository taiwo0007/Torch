package com.troch.torchApplication.controllers;


import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.services.HostService;
import com.troch.torchApplication.services.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/host")
public class HostController {

    @Autowired
    UserServiceImpl userService;

    @Autowired
    HostService hostService;


    @GetMapping(value = "/hostinfo")
    public String becomeHost(ModelMap map)  {




        return "host/becomeHost";

    }

    @GetMapping(value = "/createHost")
    public String processHost(Model model) throws Exception {

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
                formNewHost.setHost_user(currentUser);
                currentUser.setHost(formNewHost);

                userService.saveUser(currentUser);
//            hostService.save(formNewHost);

                model.addAttribute("host", formNewHost);
                model.addAttribute("user", currentUser);

                return "host/hostCreated";
            }
            else if(currentUser.getHost() != null ){
                model.addAttribute("error", "You are already a Host User");

            }
            else{
                model.addAttribute("error", "You must be verified to become a host");

            }



        }
        else{
            model.addAttribute("error", "You must have a user account to become a host");
        }


        return "/host/becomeHost";

    }



}
