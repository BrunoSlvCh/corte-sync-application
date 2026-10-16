package br.com.bruno.spring_boot_essentials.controller;

import br.com.bruno.spring_boot_essentials.dto.AlterarEmailRequestDTO;
import br.com.bruno.spring_boot_essentials.dto.AlterarNomeRequestDTO;
import br.com.bruno.spring_boot_essentials.dto.AlterarSenhaRequestDTO;
import br.com.bruno.spring_boot_essentials.dto.AlterarTelefoneRequestDTO;
import br.com.bruno.spring_boot_essentials.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/user")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PatchMapping("/idUsuario/{idUsuario}/alterar-nome")
    @PreAuthorize("#idUsuario == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<String> alterarNome(
            @PathVariable Long idUsuario,
            @Valid @RequestBody AlterarNomeRequestDTO dto) throws Exception {

        usuarioService.alterarNome(idUsuario, dto.novoNome());
        return ResponseEntity.ok("Nome alterado com sucesso!");
    }

    @PatchMapping("/idUsuario/{idUsuario}/alterar-senha")
    @PreAuthorize("#idUsuario == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<String> alterarSenha(
            @PathVariable Long idUsuario,
            @Valid @RequestBody AlterarSenhaRequestDTO dto) throws Exception {

        usuarioService.alterarSenha(idUsuario, dto.senhaAntiga(), dto.novaSenha());
        return ResponseEntity.ok("Senha alterada com sucesso!");
    }

    @PatchMapping("/idUsuario/{idUsuario}/alterar-email")
    @PreAuthorize("#idUsuario == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<String> alterarEmail(
            @PathVariable Long idUsuario,
            @Valid @RequestBody AlterarEmailRequestDTO dto) throws Exception {

        usuarioService.alterarEmail(idUsuario, dto.emailAntigo(), dto.novoEmail());
        return ResponseEntity.ok("E-Mail alterado com sucesso!");
    }

    @PatchMapping("/idUsuario/{idUsuario}/alterar-telefone")
    @PreAuthorize("#idUsuario == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<String> alterarTelefone(
            @PathVariable Long idUsuario,
            @Valid @RequestBody AlterarTelefoneRequestDTO dto) throws Exception {

        usuarioService.alterarTelefone(idUsuario, dto.telefoneAntigo(), dto.novoTelefone());
        return ResponseEntity.ok("Telefone alterado com sucesso!");
    }
}
