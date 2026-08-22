package br.com.bruno.spring_boot_essentials.database.repository;

import br.com.bruno.spring_boot_essentials.database.model.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long> {

    @Query("SELECT DISTINCT u FROM UsuarioEntity u LEFT JOIN FETCH u.roles WHERE u.email = :email")
    Optional<UsuarioEntity> findByEmail(String email);
}
