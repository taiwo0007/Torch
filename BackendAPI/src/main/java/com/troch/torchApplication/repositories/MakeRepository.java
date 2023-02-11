package com.troch.torchApplication.repositories;

import com.troch.torchApplication.models.EScooter;
import com.troch.torchApplication.models.Make;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MakeRepository extends JpaRepository<Make, Integer> {

    Make findMakeByName(String makeName);
}
