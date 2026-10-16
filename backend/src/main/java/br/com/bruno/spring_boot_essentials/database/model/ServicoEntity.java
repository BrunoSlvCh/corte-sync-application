package br.com.bruno.spring_boot_essentials.database.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(exclude = "agendamentos")
@Entity
@Table(name = "tb_servicos")
public class ServicoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nomeServico;
    @Column(nullable = false)
    private BigDecimal precoServico;
    @Column(nullable = false)
    private Integer duracaoServico;
    @Column(nullable = false)
    private Boolean status;
    @Column(nullable = false)
    private String categoria;

    @ManyToMany(mappedBy = "servicos")
    private List<AgendamentoEntity> agendamentos = new ArrayList<>();
}
