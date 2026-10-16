package br.com.bruno.spring_boot_essentials.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AlterarSenhaRequestDTO(
        @NotBlank(message = "A senha antiga é obrigatória")
        @Size(min = 6, message = "A senha antiga deve ter no mínimo 6 caracteres")
        String senhaAntiga,

        @NotBlank(message = "A nova senha é obrigatória")
        @Size(min = 6, message = "A nova senha deve ter no mínimo 6 caracteres")
        String novaSenha
) {}