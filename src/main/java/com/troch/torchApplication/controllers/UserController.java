package com.troch.torchApplication.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.jayway.jsonpath.JsonPath;
import com.troch.torchApplication.Utilities.FileUploadUtil;
import com.troch.torchApplication.Utilities.JSONConverter;
import com.troch.torchApplication.Utilities.ValidateUser;
import com.troch.torchApplication.dto.UserRegistrationDto;
import com.troch.torchApplication.forms.EScooterForm;
import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.Make;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.repositories.UserRepository;
import com.troch.torchApplication.services.*;
import org.json.JSONObject;
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
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import static com.jayway.jsonpath.JsonPath.*;


@Controller
@RequestMapping("/user")
public class UserController {

    private UserService userService;

    @Autowired
    ValidateUser validateUserutil;

    @Autowired
    EScooterForm eScooterForm;

    @Autowired
    JSONConverter jsonConverter;

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


        HashMap<String, Object> validatorObj =  validateUserutil.isUserAuthenticated();
        if((Boolean)validatorObj.get("authenticated")){
            model.addAttribute("user",validatorObj.get("currentUserObj"));

        }
        else{
            throw new Exception("Not authorised");
        }

        User user =  userServiceImpl.findUser(id);

        if(user.getHost() == null){

            throw new Exception("You must be a host to view Escooters");
        }

        Integer host_id = user.getHost().getId();

        Host host = hostService.findById(host_id).get();

        List<EScooter> eScooterList = eScooterService.findAllEscootersByHost(host.getId());

        model.addAttribute("eScooterList", eScooterList);

        return "user/view_scooters";

    }

    @GetMapping("/scooter-add/{id}")
    public String scooterAdd(@PathVariable("id") Integer id, Model model) throws Exception {

        HashMap<String, Object> validatorObj =  validateUserutil.isUserAuthenticated();
        if((Boolean)validatorObj.get("authenticated")){
            model.addAttribute("user",validatorObj.get("currentUserObj"));
        }

        model.addAttribute("escooterForm", new EScooterForm());
        model.addAttribute("makes", makeService.findAllMake());

        return "user/add_scooter";

    }

    @PostMapping("/process-add-scooter/{id}")
    public String scooterAdd(@RequestParam("image") MultipartFile file, @PathVariable("id") Integer id, @ModelAttribute("escooterForm")  EScooterForm escooterForm , Model model) throws Exception {

        User user = userServiceImpl.findUser(id);

        URL url = new URL("https://api.geoapify.com/v1/geocode/search?text="+escooterForm.getCountry().replaceAll(" ", "%20")+"&apiKey=0d1f31ae91154c4c8f9d6002deb16ca3");
        HttpURLConnection http = (HttpURLConnection)url.openConnection();
        http.setRequestProperty("Accept", "application/json");

        JsonNode json = jsonConverter.getJson(url);

        JsonNode featuresKey  = json.get("features").get(0);
        JsonNode propertiesKey  = featuresKey.get("properties");
        JsonNode longitudeKey  = propertiesKey.get("lon");
        JsonNode latitudeKey = propertiesKey.get("lat");
        JsonNode countryKey = propertiesKey.get("country");
        JsonNode countyKey = propertiesKey.get("city");

        double longitudeFormatted = longitudeKey.asDouble();
        double latitudeFormatted = latitudeKey.asDouble();
        String addressFormatted = propertiesKey.get("formatted").asText();
        String countryFormatted = countryKey.asText();
        String countyFormated = countyKey.asText();

        http.disconnect();

        model.addAttribute("user", user);
        EScooter eScooter = new EScooter();

        //Api Service handler
        eScooter.setLatitude(latitudeFormatted);
        eScooter.setLongitude(longitudeFormatted);
        eScooter.setAddress(addressFormatted);
        eScooter.setCountry(countryFormatted);
        eScooter.setCounty(countyFormated);

        //Form handler
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
        eScooter.setModelName(escooterForm.getModelName());
        eScooter.setMake(escooterForm.getMake());
        eScooter.setTrips(0);

        //Save operation
        fileUploadUtil.saveFile(file);
        eScooterService.save(eScooter);

        model.addAttribute("success", eScooter.getModelName()+" electric scooter has been created.");

        return "redirect:/user/scooter-list/"+id+"?success";

    }




    @GetMapping("/profileEdit/{id}")
    public String profileEdit(@PathVariable("id") Integer id, Model model) throws Exception {

        HashMap<String, Object> validatorObj = validateUserutil.isUserAuthenticated();
        User user = null;
        if ((Boolean) validatorObj.get("authenticated")) {
            model.addAttribute("user", validatorObj.get("currentUserObj"));
            user = (User) validatorObj.get("currentUserObj");
        }

        if (user == null) {
            throw new Exception("Unauthorised access");
        }

        if (user.getHost() != null) {
            model.addAttribute("isHost", true);
        }
        else{
            model.addAttribute("isHost", false);

        }

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
