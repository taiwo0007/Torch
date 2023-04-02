package com.troch.torchApplication.services;

import com.troch.torchApplication.Utilities.JwtUtil;
import com.troch.torchApplication.controllers.HostController;
import com.troch.torchApplication.dto.CreateAdRequest;
import com.troch.torchApplication.dto.ErrorResponse;
import com.troch.torchApplication.dto.TopHostsCardDto;
import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.User;
import com.troch.torchApplication.repositories.HostRepository;
import com.troch.torchApplication.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.swing.*;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class HostService {


    @Autowired
    HostRepository hostRepository;

    @Autowired
    UserServiceImpl userService;

    @Autowired
    EScooterService eScooterService;

    @Autowired
    JwtUtil jwtUtil;

    Logger logger = LoggerFactory.getLogger(HostService.class);
    @Autowired
    private UserRepository userRepository;


    public Host save(Host host){
        return hostRepository.save(host);
    }

    public Host findHostByUser(User user){

        return hostRepository.findByHostUser(user);
    }

    public Optional<Host> findById(int id){

        return hostRepository.findById(id);
    }

    public ResponseEntity<List<EScooter>> getHostEscooters(Integer id){

//        User user = userService.findUserByEmail(jwtUtil.extractUsernameFromRawToken(jwt));
//        if (user.getHost() == null){
//            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
//        }
//
//        Integer host_id = user.getHost().getId();

        Host host = hostRepository.findById(id).get();

        logger.info("Host objec"+host);

        List<EScooter> eScooterList = eScooterService.findAllEscootersByHost(host.getId());

        logger.info("Host Escooters"+eScooterList);

        return new ResponseEntity<>(eScooterList, HttpStatus.OK);
    }

    public ResponseEntity makeUserHost(String jwt) {

        User currentUser = userService.findUserByEmail(jwtUtil.extractUsernameFromRawToken(jwt));

        if (currentUser.getHost() == null && currentUser.getIsVerified() != null && currentUser.getIsVerified()) {

            Host formNewHost = new Host();
            formNewHost.setId(currentUser.hashCode());
            formNewHost.setHostUser(currentUser);
            currentUser.setHost(formNewHost);
            currentUser.setIsHost(true);

            userService.saveUser(currentUser);
            hostRepository.save(formNewHost);

            logger.info("New host careated with ID "+formNewHost);

            return new ResponseEntity<>(formNewHost, HttpStatus.CREATED);
        } else if (currentUser.getHost() != null) {

            return new ResponseEntity<>(new ErrorResponse("You are already a Host User"), HttpStatus.BAD_REQUEST);
        }
        else if(currentUser.getIsVerified() != true){
            return new ResponseEntity<>(new ErrorResponse("You must be verified to become a host"), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new ErrorResponse("You must be signed in & verified"), HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity createAd(CreateAdRequest createAdRequest, String email) throws ParseException {

        Optional<Host> host = hostRepository.findById(createAdRequest.getHostId());
        Optional<EScooter> eScooter = eScooterService.findEScooter(createAdRequest.getEscooterId());
        if (host.isEmpty()){
            return new ResponseEntity<>(new ErrorResponse("Host not Found"), HttpStatus.BAD_REQUEST);
        }

        if (eScooter.isEmpty()){
            return new ResponseEntity<>(new ErrorResponse("Escooter not Found"), HttpStatus.BAD_REQUEST);
        }

        if(host.get().getTotalAdDays() < createAdRequest.getAdDays()){
            return new ResponseEntity<>(new ErrorResponse("Not Enough Ad days"), HttpStatus.BAD_REQUEST);

        }
        logger.info("host"+host.get().getTotalAdDays());

        logger.info("ewscooter"+createAdRequest.getAdDate());

        DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

        Date todayWithZeroTime = formatter.parse(formatter.format(createAdRequest.getAdDate()));

        //set date to 00:00
        eScooter.get().setAdDate(todayWithZeroTime);
        eScooter.get().setEscooterAdDays(createAdRequest.getAdDays());
        host.get().setTotalAdDays(host.get().getTotalAdDays() - createAdRequest.getAdDays());

        hostRepository.save(host.get());
        eScooterService.save(eScooter.get());


        return new ResponseEntity(HttpStatus.CREATED);
    }

    public ResponseEntity getTopHosts() {

        List<User> topHosts = hostRepository.findTopHosts();
        List<TopHostsCardDto> topHostsCardDtos = new ArrayList<>();

        for(User u: topHosts){

            topHostsCardDtos.add(
                    TopHostsCardDto.builder()
                            .reviewer_comment(u.getHost().getHostReviews().get(0).getComment())
                            .reviewer_date(u.getHost().getHostReviews().get(0).getReviewDate())
                            .reviewer_name(u.getHost().getHostReviews().get(0).getUser_reviewer().getFirstName() +" "
                                    +u.getHost().getHostReviews().get(0).getUser_reviewer().getLastName())
                            .isTrusted(u.isTorchTrusted())
                            .trips(u.getUserTrips() == null ? 0 : u.getUserTrips())
                            .joined(u.getJoined())
                            .firstName(u.getFirstName())
                            .LastNameInitital(u.getLastName().substring(0,1))
                            .profileImage(u.getProfilePicture())
                            .rating(u.getRating())
                            .host_id(u.getHost().getId())
                            .build()
            );
        }

        if(topHosts.isEmpty()){
            return new ResponseEntity<>(new ErrorResponse("No hosts found"), HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(topHostsCardDtos, HttpStatus.OK);
    }
}
