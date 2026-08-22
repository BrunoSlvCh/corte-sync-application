package br.com.bruno.spring_boot_essentials.database.repository;

import br.com.bruno.spring_boot_essentials.database.model.ArquivoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ArquivoRepository extends JpaRepository<ArquivoEntity, Long> {

    Optional <ArquivoEntity> findByNome (String nome);
    List<ArquivoEntity> findByEmail (String email);
}
