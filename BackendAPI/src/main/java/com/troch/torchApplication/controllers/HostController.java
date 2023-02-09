package com.troch.torchApplication.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.forms.EScooterForm;
import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.Make;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.services.EScooterService;
import com.troch.torchApplication.services.HostService;
import com.troch.torchApplication.services.MakeService;
import com.troch.torchApplication.services.UserServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/host")
public class HostController {


    @Autowired
    HostService hostService;

    @Autowired
    UserServiceImpl userService;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    EScooterService eScooterService;

    @Autowired
    MakeService makeService;




    Logger logger = LoggerFactory.getLogger(HostController.class);


    @GetMapping("/{id}")
    public Host getHostDetails(@PathVariable("id") Integer id) throws Exception {

        Optional<Host> host = hostService.findById(id);

        if(host.isEmpty()){
            throw new Exception("Host no tfound");
        }

        return host.get();

    }

    @GetMapping("/host-data")
    public ResponseEntity<Host> getHostDetailByUser(@RequestHeader("Authorization") String jwt){

        User user = userService.findUserByEmail(jwtUtil.extractUsernameFromRawToken(jwt));
        if (user.getHost() == null){
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        logger.info(""+user.getHost() );
        return new ResponseEntity<>(user.getHost(), HttpStatus.OK);

    }

    @GetMapping("/scooter-list")
    public ResponseEntity<List<EScooter>> scooterList(@RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByEmail(jwtUtil.extractUsernameFromRawToken(jwt));
        if (user.getHost() == null){
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Integer host_id = user.getHost().getId();

        Host host = hostService.findById(host_id).get();

        List<EScooter> eScooterList = eScooterService.findAllEscootersByHost(host.getId());

        return new ResponseEntity<>(eScooterList, HttpStatus.OK);

    }

    @GetMapping("/makes")
    public ResponseEntity<List<Make>> getAllMakes(){

        return new ResponseEntity<>(makeService.findAllMake(), HttpStatus.OK);

    }

//    @PostMapping("/process-add-scooter/{id}")
//    public String scooterAdd(@RequestParam("image") MultipartFile file,
//                             @PathVariable("id") Integer id,
//                             @ModelAttribute("escooterForm") EScooterForm escooterForm ,
//                             Model model) throws Exception {
//
//        User user = userServiceImpl.findUser(id);
//
//        URL url = new URL("https://api.geoapify.com/v1/geocode/search?text="+escooterForm.getCountry().replaceAll(" ", "%20")+"&apiKey=0d1f31ae91154c4c8f9d6002deb16ca3");
//        HttpURLConnection http = (HttpURLConnection)url.openConnection();
//        http.setRequestProperty("Accept", "application/json");
//
//        JsonNode json = jsonConverter.getJson(url);
//
//        JsonNode featuresKey  = json.get("features").get(0);
//        JsonNode propertiesKey  = featuresKey.get("properties");
//        JsonNode longitudeKey  = propertiesKey.get("lon");
//        JsonNode latitudeKey = propertiesKey.get("lat");
//        JsonNode countryKey = propertiesKey.get("country");
//        JsonNode countyKey = propertiesKey.get("city");
//
//        double longitudeFormatted = longitudeKey.asDouble();
//        double latitudeFormatted = latitudeKey.asDouble();
//        String addressFormatted = propertiesKey.get("formatted").asText();
//        String countryFormatted = countryKey.asText();
//        String countyFormated = countyKey.asText();
//
//        http.disconnect();
//
//        model.addAttribute("user", user);
//        EScooter eScooter = new EScooter();
//
//        //Api Service handler
//        eScooter.setLatitude(latitudeFormatted);
//        eScooter.setLongitude(longitudeFormatted);
//        eScooter.setAddress(addressFormatted);
//        eScooter.setCountry(countryFormatted);
//        eScooter.setCounty(countyFormated);
//
//        //Form handler
//        eScooter.setAbout(escooterForm.getAbout());
//        eScooter.setCost(escooterForm.getCost());
//        eScooter.setScooterWeight(escooterForm.getScooterWeight());
//        eScooter.setImage("/images/uploads/"+file.getOriginalFilename().toLowerCase());
//        eScooter.setWaterResistant(escooterForm.getWaterResistant());
//        eScooter.setTripStart(escooterForm.getTripStart());
//        eScooter.setTripEnd(escooterForm.getTripEnd());
//        eScooter.setMotorPower(escooterForm.getMotorPower());
//        eScooter.setMaxRange(escooterForm.getMaxRange());
//        eScooter.setMaxWeight(escooterForm.getMaxWeight());
//        eScooter.setScooterWeight(escooterForm.getScooterWeight());
//        eScooter.setMaxSpeed(escooterForm.getMaxSpeed());
//        eScooter.setHost(user.getHost());
//        eScooter.setModelName(escooterForm.getModelName());
//        eScooter.setMake(escooterForm.getMake());
//        eScooter.setTrips(0);
//
//        //Save operation
//        fileUploadUtil.saveFile(file);
//        eScooterService.save(eScooter);
//
//        model.addAttribute("success", eScooter.getModelName()+" electric scooter has been created.");
//
//        return "redirect:/user/scooter-list/"+id+"?success";
//
//    }

}
