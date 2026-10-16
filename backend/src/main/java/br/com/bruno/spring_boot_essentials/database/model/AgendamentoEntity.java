package br.com.bruno.spring_boot_essentials.database.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(exclude = {"cliente", "barbeiro", "servicos"})
@Entity
@Table(name = "tb_agendamentos")
public class AgendamentoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dataInicio;
    @Column(nullable = false)
    private LocalDateTime dataTermino;
    @Column(nullable = false)
    private String status;
    @Column(nullable = false)
    private BigDecimal valorTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private UsuarioEntity usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barbeiro_id", nullable = false)
    private BarbeiroEntity barbeiro;

    @ManyToMany
    @JoinTable(
            name = "tb_agendamento_servico",
            joinColumns = @JoinColumn(name = "agendamento_id"),
            inverseJoinColumns = @JoinColumn(name = "servico_id")
    )
    private List<ServicoEntity> servicos = new ArrayList<>();
}
