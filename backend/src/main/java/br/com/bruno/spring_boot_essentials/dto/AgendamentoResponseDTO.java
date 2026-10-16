package br.com.bruno.spring_boot_essentials.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AgendamentoResponseDTO {

    private Long id;
    private LocalDateTime dataInicio;
    private LocalDateTime dataTermino;
    private String status;
    private BigDecimal valorTotal;

    private Long clienteId;
    private String clienteNome;

    private Long barbeiroId;
    private String barbeiroNome;

    private List<ServicoDTO> servicos;
}