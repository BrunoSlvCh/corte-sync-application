package br.com.bruno.spring_boot_essentials.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString

public class ArquivoDto {

    private Long id;
    @NotBlank(message = "Digite um nome para esse arquivo.")
    private String nome;
    private String hashNome;
    public String caminho;
    public Long tamanho;
    public String tipoMime;
    public Date dataCriacao;
}
