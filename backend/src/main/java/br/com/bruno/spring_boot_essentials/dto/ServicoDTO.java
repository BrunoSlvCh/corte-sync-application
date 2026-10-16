package br.com.bruno.spring_boot_essentials.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString

public class ServicoDTO {

    Long id;

    @NotBlank(message = "O nome do serviço é obrigatório")
    private String nomeServico;

    @NotNull(message = "O preço do serviço é obrigatório")
    @Positive(message = "O preço deve ser maior que zero")
    private BigDecimal precoServico;

    @NotNull(message = "A duração do serviço é obrigatória")
    @Positive(message = "A duração deve ser maior que zero")
    private Integer duracaoServico;

    @NotNull(message = "O status do serviço é obrigatório")
    private Boolean status;

    @NotBlank(message = "A categoria do serviço é obrigatória")
    private String categoria;

}
