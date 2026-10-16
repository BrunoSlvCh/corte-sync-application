package br.com.bruno.spring_boot_essentials.database.repository;

import br.com.bruno.spring_boot_essentials.database.model.BarbeiroEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BarbeiroRepository extends JpaRepository<BarbeiroEntity, Long> {
    Optional<BarbeiroEntity> findByNome (String nome);
    Optional<BarbeiroEntity> findByUsuarioEmail(String email);
    Optional<BarbeiroEntity> findByUsuarioId(Long idUsuario);
}
