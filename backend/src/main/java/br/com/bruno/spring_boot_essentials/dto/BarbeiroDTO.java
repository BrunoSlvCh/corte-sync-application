package br.com.bruno.spring_boot_essentials.dto;

import br.com.bruno.spring_boot_essentials.database.model.UsuarioEntity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class BarbeiroDTO {

    private Long id;

    @NotBlank(message = "O nome do barbeiro é obrigatório")
    private String nome;

    @NotBlank(message = "A descrição é obrigatória")
    private String descricao;

    @NotNull(message = "O status é obrigatório")
    private Boolean status;

    @NotBlank(message = "A URL da foto é obrigatória")
    private String urlFoto;

    @NotNull(message = "O ID do usuário é obrigatório")
    private Long usuarioId;
}