package br.com.bruno.spring_boot_essentials.database.repository;

import br.com.bruno.spring_boot_essentials.database.model.ServicoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ServicoRepository extends JpaRepository<ServicoEntity, Long> {

    Optional<ServicoEntity> findByNomeServico (String NomeServico);
}
