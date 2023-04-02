package com.troch.torchApplication.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class MailResponse

{

    private String message;
    private boolean status;
}
