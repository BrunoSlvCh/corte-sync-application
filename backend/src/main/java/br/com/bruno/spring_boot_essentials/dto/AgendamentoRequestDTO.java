package br.com.bruno.spring_boot_essentials.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AgendamentoRequestDTO {

    @NotNull(message = "A data e hora de início são obrigatórias")
    private LocalDateTime dataInicio;

    @NotNull(message = "O ID do cliente é obrigatório")
    private Long clienteId;

    @NotNull(message = "O ID do barbeiro é obrigatório")
    private Long barbeiroId;

    @NotEmpty(message = "Informe ao menos um serviço para o agendamento")
    private List<Long> servicosIds;
}