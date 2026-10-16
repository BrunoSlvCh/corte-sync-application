package br.com.bruno.spring_boot_essentials.database.repository;

import br.com.bruno.spring_boot_essentials.database.model.AgendamentoEntity;
import br.com.bruno.spring_boot_essentials.database.model.UsuarioEntity;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AgendamentoRepository extends JpaRepository<AgendamentoEntity, Long> {

    List<AgendamentoEntity> findByBarbeiroIdAndDataInicioBetweenAndStatusNot(
            Long barbeiroId,
            LocalDateTime inicio,
            LocalDateTime fim,
            String status
    );

    @Query("""
        SELECT COUNT(a) > 0 FROM AgendamentoEntity a
        WHERE a.barbeiro.id = :barbeiroId
          AND a.status <> 'CANCELADO'
          AND :inicio < a.dataTermino
          AND :fim > a.dataInicio
    """)
    boolean existsConflitoHorario(
            @Param("barbeiroId") Long barbeiroId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim
    );

    List <AgendamentoEntity> findByStatus (String status);
    List <AgendamentoEntity> findByUsuario (UsuarioEntity usuario);
    List<AgendamentoEntity> findByBarbeiroId(Long idBarbeiro);
}
