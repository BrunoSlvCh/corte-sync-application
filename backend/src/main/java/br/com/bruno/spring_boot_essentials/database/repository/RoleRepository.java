package br.com.bruno.spring_boot_essentials.database.repository;

import br.com.bruno.spring_boot_essentials.database.model.RolesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<RolesEntity, Long> {

    Optional<RolesEntity> findByName(String nome);
}
