package com.troch.torchApplication.dto;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class MailRequest {

    private String name;
    private String to;
    private String from;
    private String subject;
}
