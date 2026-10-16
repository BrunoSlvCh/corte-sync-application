package br.com.bruno.spring_boot_essentials.controller;
import br.com.bruno.spring_boot_essentials.dto.BarbeiroDTO;
import br.com.bruno.spring_boot_essentials.dto.CadastrarBarbeiroCompletoDTO;
import br.com.bruno.spring_boot_essentials.service.BarbeiroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/v1/barbeiro")
@RestController
@RequiredArgsConstructor

public class BarbeiroController {

    private final BarbeiroService barbeiroService;

    @GetMapping("/nome/{nome}")
    public BarbeiroDTO barbeiro (@PathVariable String nome) throws Exception {
        return barbeiroService.buscarBarbeiroNome(nome);
    }

    @GetMapping("/barbeiros")
    @ResponseStatus(HttpStatus.OK)
    public List<BarbeiroDTO> verBarbeiros(){
        return barbeiroService.verBarbeiros();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/new")
    public ResponseEntity<String> novoBarbeiro(@Valid @RequestBody CadastrarBarbeiroCompletoDTO dto) throws Exception {
        barbeiroService.cadastrarBarbeiroDoZero(dto);
        return ResponseEntity.ok("Barbeiro e conta de usuário criados com sucesso!");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/descricao/id/{id}")
    public ResponseEntity<String> modificarDescricaoBarbeiro(@PathVariable Long id, @RequestParam String descricao) throws Exception{
        barbeiroService.modificarDescricaoBarbeiro(id, descricao);
        return ResponseEntity.ok("Descrição alterada com sucesso!");
    }

    @PreAuthorize("#idUsuario == authentication.principal.id or hasRole('ADMIN')")
    @PatchMapping("usuario/{idUsuario}/foto")
    public ResponseEntity<String> modificarFotoBarbeiro(@PathVariable Long idUsuario,  @RequestParam String urlFoto) throws Exception{
        barbeiroService.modificarFotoPorUsuarioId(idUsuario, urlFoto);
        return ResponseEntity.ok("Foto alterada com sucesso!");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/id/{id}/status/{status}")
    public ResponseEntity<String> modificarStatusBarbeiro(@PathVariable Long id, @PathVariable Boolean status) throws Exception{
        barbeiroService.modificarStatusBarbeiro(id, status);
        return ResponseEntity.ok("Status alterado com sucesso!");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("delete/id/{id}")
    public ResponseEntity<String> deletarBarbeiro (@PathVariable Long id) throws Exception{
        barbeiroService.deletarBarbeiro(id);
        return ResponseEntity.ok("Barbeiro removido com sucesso!");
    }

}
