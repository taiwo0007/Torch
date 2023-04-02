package com.troch.torchApplication.repositories;

import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.Make;
import com.troch.torchApplication.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostRepository extends JpaRepository<Host, Integer> {

    Host findByHostUser(User user);

    @Query("SELECT u from Host h, User u WHERE u.host IS NOT NULL AND u.host.id = h.id")
    List<User> findTopHosts();


}
