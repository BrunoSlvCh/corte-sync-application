package br.com.bruno.spring_boot_essentials.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AlterarTelefoneRequestDTO(
        @NotBlank(message = "O telefone antigo é obrigatório")
        @Size(min = 10, max = 15, message = "O telefone antigo deve ter entre 10 e 15 caracteres")
        String telefoneAntigo,

        @NotBlank(message = "O novo telefone é obrigatório")
        @Size(min = 10, max = 15, message = "O novo telefone deve ter entre 10 e 15 caracteres")
        String novoTelefone
) {}