
package br.com.bruno.spring_boot_essentials.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AlterarEmailRequestDTO(
        @NotBlank(message = "O E-Mail antigo é obrigatório")
        @Email(message = "Informe um E-Mail antigo válido")
        String emailAntigo,

        @NotBlank(message = "O novo E-Mail é obrigatório")
        @Email(message = "Informe um novo E-Mail válido")
        String novoEmail
) {}