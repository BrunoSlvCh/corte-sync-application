package br.com.bruno.spring_boot_essentials.service;

import br.com.bruno.spring_boot_essentials.database.model.RolesEntity;
import br.com.bruno.spring_boot_essentials.database.model.UsuarioEntity;
import br.com.bruno.spring_boot_essentials.database.repository.RoleRepository;
import br.com.bruno.spring_boot_essentials.database.repository.UsuarioRepository;
import br.com.bruno.spring_boot_essentials.dto.*;
import br.com.bruno.spring_boot_essentials.enums.RoleTypeEnum;
import br.com.bruno.spring_boot_essentials.exeption.EventNotFoundException;
import br.com.bruno.spring_boot_essentials.exeption.RequisicaoInvalidaException;
import br.com.bruno.spring_boot_essentials.security.SecurityConfiguration;
import br.com.bruno.spring_boot_essentials.security.TokenProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.security.core.AuthenticationException;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    @Value("${jwt.expiration}")
    private long expiationTime;

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final TokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void register (RegisterRequestDTO registerRequestDto){
        UsuarioEntity usuarioEntityEmail = usuarioRepository.findByEmail(registerRequestDto.getEmail()).orElse(null);

        UsuarioEntity usuarioNumero = usuarioRepository.findByTelefone(registerRequestDto.getTelefone()).orElse(null);

        if (usuarioEntityEmail != null){
            throw new IllegalArgumentException("Esse E-Mail já está vinculado a uma conta!");
        }

        if (usuarioNumero != null){
            throw new IllegalArgumentException("Esse número de telefone já está vinculado a uma conta!");
        }

        RolesEntity roles = roleRepository.findByName(RoleTypeEnum.ROLE_USUARIO.name()).orElseGet (() -> roleRepository.save(RolesEntity.builder()
                .name(RoleTypeEnum.ROLE_USUARIO.name())
                .build()));

        usuarioRepository.save(UsuarioEntity.builder()
                .nome(registerRequestDto.getNome())
                .email(registerRequestDto.getEmail())
                .telefone(registerRequestDto.getTelefone())
                .senha(passwordEncoder.encode(registerRequestDto.getSenha()))
                .roles(Set.of(roles))
                .build());
    }

    public TokenResponseDTO login (LoginRequestDTO loginRequestDto) throws RequisicaoInvalidaException {
        try{

            Authentication authentication = null;
            UsuarioEntity usuarioEntity = null;

            if (loginRequestDto.getEmail() == null){
                authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequestDto.getTelefone(), loginRequestDto.getSenha()));
                usuarioEntity = usuarioRepository.findByTelefone(loginRequestDto.getTelefone())
                        .orElseThrow(() -> new RequisicaoInvalidaException("Usuário ou senha inválidos."));
            }

            else {
                authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getSenha()));
                usuarioEntity = usuarioRepository.findByEmail(loginRequestDto.getEmail())
                        .orElseThrow(() -> new RequisicaoInvalidaException("Usuário ou senha inválidos."));

            }

            String token = tokenProvider.gerarToken(authentication);
            Long id = usuarioEntity.getId();

            return new TokenResponseDTO(token, expiationTime, id);
        } catch (AuthenticationException authenticationException){
            throw new RequisicaoInvalidaException("Usuário ou senha inválidos!");
        }
    }
}
