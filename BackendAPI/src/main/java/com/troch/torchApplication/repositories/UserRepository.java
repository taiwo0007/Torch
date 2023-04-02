package com.troch.torchApplication.repositories;

import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    User findByEmail(String email);

    @Query("SELECT u from User u WHERE :code = u.user_verification_code")
    User findUserByVerificationCode(@Param("code") String code);

}
