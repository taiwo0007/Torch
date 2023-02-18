package com.troch.torchApplication.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Host_Review")
@AllArgsConstructor
@Getter
@Setter
@ToString
@NoArgsConstructor
public class HostReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "host_id", referencedColumnName = "id")
    @JsonManagedReference
    private Host host;

    @ManyToOne
    @JoinColumn(name = "user_reviewer_id", referencedColumnName = "id")
//    @JsonManagedReference
    private User user_reviewer;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date reviewDate;

    private String comment;

    private int starRating;
}
