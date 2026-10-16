package br.com.bruno.spring_boot_essentials.service;

import br.com.bruno.spring_boot_essentials.database.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        return usuarioRepository.findByEmail(login)
                .orElseGet(() -> usuarioRepository.findByTelefone(login)
                        .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com login: " + login)));
    }
}
