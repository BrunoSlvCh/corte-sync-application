package br.com.bruno.spring_boot_essentials.controller;

import br.com.bruno.spring_boot_essentials.dto.ServicoDTO;
import br.com.bruno.spring_boot_essentials.service.ServicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/v1/servico")
@RequiredArgsConstructor
public class ServicoController {

    private final ServicoService servicoService;

    @GetMapping("/nome/{nome}")
    @ResponseStatus(HttpStatus.OK)
    public ServicoDTO buscarServicoNome (@PathVariable String nome) throws Exception{
        return servicoService.buscarServicoNome(nome);
    }

    @GetMapping("/servicos")
    @ResponseStatus(HttpStatus.OK)
    public List<ServicoDTO> verServicos(){
        return servicoService.verServicos();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/new")
    public ResponseEntity <String> novoServico (@Valid @RequestBody ServicoDTO servicoDTO){
        servicoService.criarServico(servicoDTO);
        return ResponseEntity.ok("Servico criado com sucesso!");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/nomeServico/{nomeServico}/nome")
    public ResponseEntity<String> modificarNomeServico (@PathVariable String nomeServico, @RequestParam String novoNome) throws Exception{
        servicoService.modificarNomeServico(nomeServico, novoNome);
        return ResponseEntity.ok("Nome modificado com sucesso!");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/nomeServico/{nomeServico}/preco")
    public ResponseEntity<String> modificarPrecoServico (@PathVariable String nomeServico, @RequestParam BigDecimal novoPreco) throws Exception{
        servicoService.modificarPrecoServico(nomeServico, novoPreco);
        return ResponseEntity.ok("Preço modificado com sucesso!");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/nomeServico/{nomeServico}/duracao")
    public ResponseEntity<String> modificarDuracaoServico (@PathVariable String nomeServico, @RequestParam Integer novaDuracao) throws Exception{
        servicoService.modificarDuracaoServico(nomeServico, novaDuracao);
        return ResponseEntity.ok("Duração do serviço modificada com sucesso!");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/nomeServico/{nomeServico}/categoria")
    public ResponseEntity<String> modificarCategoriaServico (@PathVariable String nomeServico, @RequestParam String novaCategoria) throws Exception{
        servicoService.modificarCategoriaServico(nomeServico, novaCategoria);
        return ResponseEntity.ok("Categoria do serviço modificada com sucesso!");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/idServico/{idServico}/status/{status}")
    public ResponseEntity<String> modificarStatusServico (@PathVariable Long idServico, @PathVariable Boolean status) throws Exception{
        servicoService.modificarStatusServico(idServico, status);
        return ResponseEntity.ok("Status do serviço alterado com sucesso!");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/nomeServico/{nomeServico}")
    public ResponseEntity<String> deletarServico (@PathVariable String nomeServico) throws Exception{
        servicoService.deletarServico(nomeServico);
        return ResponseEntity.ok("Serviço deletado com sucesso!");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/all")
    public ResponseEntity<String> deletarTodosServicos (){
        servicoService.deletarTodosServicos();
        return ResponseEntity.ok("Todos os Servicos foram deletados com sucesso!");
    }
}
