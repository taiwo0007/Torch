package com.troch.torchApplication.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Make {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String image;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "make", cascade = CascadeType.ALL)
    @JsonManagedReference
    List<EScooter> eScooters = new ArrayList<>();
}
