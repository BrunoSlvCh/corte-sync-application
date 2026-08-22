package br.com.bruno.spring_boot_essentials.database.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(exclude = "usuario")
@Table(name = "tb_arquivos")
@Entity

public class ArquivoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;
    @Column(nullable = false)
    private String hashNome;
    @Column(nullable = false)
    private String caminho;
    @Column(nullable = false)
    private Long tamanho;
    @Column(nullable = false)
    private String tipoMime;
    @Column(nullable = false)
    private Date dataCriacao;
    @Column(nullable = false)
    private String email;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioEntity usuario;
}
