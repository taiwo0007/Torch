package com.troch.torchApplication.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.api.Http;
import com.troch.torchApplication.Utilities.FileUploadUtil;
import com.troch.torchApplication.Utilities.GCPUtil;
import com.troch.torchApplication.Utilities.JSONConverter;
import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.controllers.TripController;
import com.troch.torchApplication.dto.*;
import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.Role;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.repositories.UserRepository;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.validation.constraints.Email;


@Service
public class UserServiceImpl implements UserService{

    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    EmailService emailService;

    @Autowired
    JSONConverter jsonConverter;

    @Autowired
    FileUploadUtil fileUploadUtil;

    @Autowired
    GCPUtil gcpUtil;

    Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);


    public UserServiceImpl(UserRepository userRepository) {
        super();
        this.userRepository = userRepository;
    }

    public User findUserByEmail(String email){
        User user = userRepository.findByEmail(email);
        if(user == null) {
            throw new UsernameNotFoundException("Username Not found");
        }

        return user;
    }
    public boolean isAlreadyCreated(String email){
        User user = userRepository.findByEmail(email);
        if(user == null) {
            return false;
        }
        return true;
    }

    public BasicUserResponse findBasicUser(Integer id){

        Optional<User> user = userRepository.findById(id);
        if(user == null) {
            throw new UsernameNotFoundException("Invalid username or password.");
        }
        User newUser = user.get();


        return new BasicUserResponse(newUser.getFirstName(),
                newUser.getLastName(),
                newUser.getCountry(),
                newUser.getProfilePicture(),
                newUser.getHost() != null ? newUser.getHost().getId() : null,
                newUser.getId());

    }



    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(username);
        if(user == null) {
            throw new UsernameNotFoundException("Invalid username or password.");
        }
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), mapRolesToAuthorities(user.getRoles()));
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Collection<Role> roles){
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());
    }


    public User saveUser(User user){

        return userRepository.save(user);
    }


    public User findUser(int id){

        return userRepository.findById(id).get();
    }

    
    public List<User> findAllUsers() {

        return userRepository.findAll();
    }

    public ResponseEntity verifyEmail(String code){

        User user = userRepository.findUserByVerificationCode(code);

        user.setIsVerified(true);

        return new ResponseEntity(userRepository.save(user), HttpStatus.CREATED);


    }

    public ResponseEntity verifyUser(@NotNull VerifyRequest verifyRequest, String jwt) throws Exception {

        Path filePath = fileUploadUtil.writeBase64FileToSystem(verifyRequest.getProfilePicture(),
                verifyRequest.getFileName());

        String gcpPublicImageUrlgcpUtil = gcpUtil.uploadObject(filePath, verifyRequest.getContentType());

        User currentUsr = findUserByEmail(jwtUtil.extractUsernameFromRawToken(jwt));

        if(currentUsr.getIsVerified()){
            return new ResponseEntity(new ErrorResponse("User already Verified"), HttpStatus.BAD_REQUEST);
        }

        JsonNode json;
        HttpURLConnection http;

        try{
            URL url = new URL("https://api.geoapify.com/v1/geocode/search?text="+verifyRequest.getLocation().replaceAll(" ", "%20")+"&apiKey=0d1f31ae91154c4c8f9d6002deb16ca3");
            http = (HttpURLConnection)url.openConnection();
            http.setRequestProperty("Accept", "application/json");
            json = jsonConverter.getJson(url);
            logger.info("JSON" +json);
        }
        catch (Exception ex){
            throw new IOException();
        }


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

        currentUsr.setProfilePicture(verifyRequest.getProfilePicture());
        currentUsr.setCountry(countryFormatted);
        currentUsr.setLocation(addressFormatted);
        currentUsr.setIsVerified(false);
        currentUsr.setAbout(verifyRequest.getAbout());
        currentUsr.setLastName(verifyRequest.getLastName());
        currentUsr.setFirstName(verifyRequest.getFirstName());
        currentUsr.setPhoneNumber(verifyRequest.getPhoneNumber());
        currentUsr.setState(countyFormated);
        currentUsr.setLatitude(latitudeFormatted);
        currentUsr.setLongitude(longitudeFormatted);
        currentUsr.setProfilePicture(gcpPublicImageUrlgcpUtil);


        //Send Email
        Map<String, Object> model = new HashMap<>();
        String randomCode = UUID.randomUUID().toString();
        model.put("code", randomCode);
        model.put("location", "Brian");
        model.put("environment_url", verifyRequest.getUrl());
        currentUsr.setUser_verification_code(randomCode);

        MailRequest mailRequest = new MailRequest(currentUsr.getFirstName() +" " +currentUsr.getLastName(), currentUsr.getEmail(),"torch.noreply@gmail.com","Verify Account");
        emailService.sendEmail(mailRequest, model);


        return new ResponseEntity(userRepository.save(currentUsr), HttpStatus.CREATED);

    }
}
