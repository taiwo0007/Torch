package com.troch.torchApplication.models;


import com.fasterxml.jackson.annotation.JsonAnyGetter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.bytebuddy.dynamic.loading.InjectionClassLoader;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "firstName")
    private String firstName;
    @Column(name = "lastName")
    private String lastName;

    private String email;
    @Column(name = "password")
    private String password;
    @Column(name = "rating")
    private Double rating;

    private Integer phoneNumber;

    private String postCode;

    private String country;

    private String state;

    private String accountType;


    @Column(name = "profilePicture")
    private String profilePicture;

    private Integer userTrips;



    @LazyCollection(LazyCollectionOption.FALSE)
    @ManyToMany( cascade = CascadeType.ALL)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(
                    name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(
                    name = "role_id", referencedColumnName = "id"))
    private Collection<Role> roles;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "host_id", referencedColumnName = "id")
    private Host host;

    @OneToMany(mappedBy = "user_reviewer", cascade = CascadeType.ALL)
    List<HostReview> hostReviews = new ArrayList<>();

    @OneToMany(mappedBy = "scooter_reviewer", cascade = CascadeType.ALL)
    List<ScooterReview> scooterReviews = new ArrayList<>();

    @OneToMany(mappedBy = "user_renter", cascade = CascadeType.ALL)
    List<Trip> renterTrips = new ArrayList<>();

    private Boolean isVerified;



    public User(String firstName, String lastName, String email, String password, Collection<Role> roles){
        this.firstName= firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }
    public String getProfile(){

        return this.profilePicture;
    }



}
