package br.com.bruno.spring_boot_essentials.dto;

import br.com.bruno.spring_boot_essentials.database.model.BarbeiroEntity;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString

public class HorariosDisponiveisDTO {

    private Long barbeiroId;
    private String nomeBarbeiro;
    private LocalDate dataConsulta;
    private List <LocalTime> horariosDisponiveis;
}
