package br.com.bruno.spring_boot_essentials.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AlterarNomeRequestDTO(
        @NotBlank(message = "O novo nome é obrigatório")
        @Size(min = 2, max = 100, message = "O nome deve conter entre 2 e 100 caracteres")
        String novoNome
) {}
