package br.com.bruno.spring_boot_essentials.service;

import br.com.bruno.spring_boot_essentials.database.model.RolesEntity;
import br.com.bruno.spring_boot_essentials.database.model.UsuarioEntity;
import br.com.bruno.spring_boot_essentials.database.repository.RoleRepository;
import br.com.bruno.spring_boot_essentials.database.repository.UsuarioRepository;
import br.com.bruno.spring_boot_essentials.dto.LoginRequestDto;
import br.com.bruno.spring_boot_essentials.dto.RegisterRequestDto;
import br.com.bruno.spring_boot_essentials.dto.TokenRespondeDto;
import br.com.bruno.spring_boot_essentials.enums.RoleTypeEnum;
import br.com.bruno.spring_boot_essentials.exeption.RequisicaoInvalidaException;
import br.com.bruno.spring_boot_essentials.security.SecurityConfiguration;
import br.com.bruno.spring_boot_essentials.security.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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
    private final SecurityConfiguration securityConfiguration;

    public void register (RegisterRequestDto registerRequestDto) throws BadRequestException{
        UsuarioEntity usuarioEntity = usuarioRepository.findByEmail(registerRequestDto.getEmail()).orElse(null);

        if (usuarioEntity != null){
            throw new BadRequestException("Esse E-Mail já está vinculado a uma conta");
        }

        RolesEntity roles = roleRepository.findByName(RoleTypeEnum.ROLE_USUARIO.name()).orElseGet (() -> roleRepository.save(RolesEntity.builder()
                .name(RoleTypeEnum.ROLE_USUARIO.name())
                .build()));

        usuarioRepository.save(UsuarioEntity.builder()
                .nome(registerRequestDto.getNome())
                .email(registerRequestDto.getEmail())
                .senha(securityConfiguration.passwordEncoder().encode(registerRequestDto.getSenha()))
                .roles(Set.of(roles))
                .build());
    }

    public TokenRespondeDto login (LoginRequestDto loginRequestDto) throws RequisicaoInvalidaException {
        try{

            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getSenha()));

            String token = tokenProvider.gerarToken(authentication);
            UsuarioEntity usuarioEntity = usuarioRepository.findByEmail(loginRequestDto.getEmail())
                    .orElseThrow(() -> new RequisicaoInvalidaException("Usuário ou senha inválidos."));

            Long id = usuarioEntity.getId();

            return new TokenRespondeDto(token, expiationTime, id);
        } catch (AuthenticationException authenticationException){
            throw new RequisicaoInvalidaException("Usuário ou senha inválidos.");
        }
    }
}
