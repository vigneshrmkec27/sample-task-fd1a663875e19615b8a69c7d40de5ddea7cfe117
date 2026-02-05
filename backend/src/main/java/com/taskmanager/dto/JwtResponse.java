package com.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {

    private String token;
    private String type = "Bearer";
    private String username;
    private String email;
    private String profileImage;

    public JwtResponse(String token, String username, String email, String profileImage) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.profileImage = profileImage;
        this.type = "Bearer";
    }
}
