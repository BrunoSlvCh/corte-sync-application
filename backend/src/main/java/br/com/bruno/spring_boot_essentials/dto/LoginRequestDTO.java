package br.com.bruno.spring_boot_essentials.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.stereotype.Component;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString

public class LoginRequestDTO {

    private String email;
    private String telefone;
    @NotBlank
    private String senha;

}
