package br.com.bruno.spring_boot_essentials.controller;

import br.com.bruno.spring_boot_essentials.dto.ArquivoDto;
import br.com.bruno.spring_boot_essentials.service.ArquivoService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/arquivos")
public class ArquivosController {

    private final ArquivoService arquivoService;

    @PreAuthorize("#idUsuario == principal.id or hasRole('ROLE_ADMIN')")
    @PostMapping("/novoArquivo/idUsuario/{idUsuario}")
    public ResponseEntity<Map<String, String>> upload(
            @PathVariable("idUsuario") Long idUsuario,
            @RequestParam("file") MultipartFile file) throws Exception {

        String mensagem = arquivoService.novoArquivo(idUsuario, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("mensagem", mensagem));
    }

    @PreAuthorize("#idUsuario == principal.id or hasRole('ADMIN')")
    @GetMapping("/idUsuario/{idUsuario}/arquivos")
    public ResponseEntity<List<ArquivoDto>> verArquivosUsuario(@PathVariable("idUsuario") Long idUsuario) throws Exception {
        return ResponseEntity.ok(arquivoService.verArquivosUser(idUsuario));
    }

    @PreAuthorize("#idUsuario == principal.id or hasRole('ADMIN')")
    @GetMapping("/download/idUsuario/{idUsuario}/{nome}")
    public ResponseEntity<Resource> download(
            @PathVariable("nome") String nome,
            @PathVariable("idUsuario") Long idUsuario) throws Exception {
        return arquivoService.baixarArquivo(idUsuario, nome);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<ArquivoDto>> verTodosArquivos() {
        return ResponseEntity.ok(arquivoService.verArquivos());
    }

    @PreAuthorize("#idUsuario == principal.id or hasRole('ADMIN')")
    @GetMapping("/idArquivo/{idArquivo}/idUsuario/{idUsuario}")
    public ResponseEntity<ArquivoDto> buscarArquivoId(
            @PathVariable("idArquivo") Long idArquivo,
            @PathVariable("idUsuario") Long idUsuario) throws Exception {
        return ResponseEntity.ok(arquivoService.buscarArquivoId(idArquivo, idUsuario));
    }

    @PreAuthorize("#idUsuario == principal.id or hasRole('ADMIN')")
    @GetMapping("/nomeArquivo/{nomeArquivo}/idUsuario/{idUsuario}")
    public ResponseEntity<ArquivoDto> buscarArquivoNome(
            @PathVariable("nomeArquivo") String nomeArquivo,
            @PathVariable("idUsuario") Long idUsuario) throws Exception {
        return ResponseEntity.ok(arquivoService.buscarArquivoNome(nomeArquivo, idUsuario));
    }

    @PreAuthorize("#idUsuario == principal.id or hasRole('ADMIN')")
    @PatchMapping("/idUsuario/{idUsuario}/{nomeAtual}/para/{novoNome}")
    public ResponseEntity<Map<String, String>> alterarNomeArquivo(
            @PathVariable("idUsuario") Long idUsuario,
            @PathVariable("nomeAtual") String nomeAtual,
            @PathVariable("novoNome") String novoNome) throws Exception {
        String mensagem = arquivoService.mudarNomeArquivo(idUsuario, nomeAtual, novoNome);
        return ResponseEntity.ok(Map.of("mensagem", mensagem));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteAll")
    public ResponseEntity<Void> deletarTudo() {
        arquivoService.deletarTudo();
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("#idUsuario == principal.id or hasRole('ADMIN')")
    @DeleteMapping("/idArquivo/{idArquivo}/idUsuario/{idUsuario}")
    public ResponseEntity<Void> deletarPorId(
            @PathVariable("idArquivo") Long idArquivo,
            @PathVariable("idUsuario") Long idUsuario) throws Exception {
        arquivoService.deletarArquivoId(idArquivo, idUsuario);
        return ResponseEntity.noContent().build();
    }
    
    @PreAuthorize("#idUsuario == principal.id or hasRole('ADMIN')")
    @DeleteMapping("/idUsuario/{idUsuario}/nome/{nome}")
    public ResponseEntity<Map<String, String>> deletarPorNome(
            @PathVariable("idUsuario") Long idUsuario,
            @PathVariable("nome") String nome) throws Exception {
        String mensagem = arquivoService.deletarArquivoNome(idUsuario, nome);
        return ResponseEntity.ok(Map.of("mensagem", mensagem));
    }
}