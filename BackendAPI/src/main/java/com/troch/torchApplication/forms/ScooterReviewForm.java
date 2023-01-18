package com.troch.torchApplication.forms;

import com.troch.torchApplication.models.Host;
import com.troch.torchApplication.models.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Component;

import java.util.Date;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Component
public class ScooterReviewForm {
    private String comment;
    private Integer starRating;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date reviewDate;
    private User user_reviewer;

}
