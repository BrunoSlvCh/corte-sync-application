package br.com.bruno.spring_boot_essentials.controller;

import br.com.bruno.spring_boot_essentials.dto.AgendamentoRequestDTO;
import br.com.bruno.spring_boot_essentials.dto.AgendamentoResponseDTO;
import br.com.bruno.spring_boot_essentials.dto.HorariosDisponiveisDTO;
import br.com.bruno.spring_boot_essentials.exeption.RequisicaoInvalidaException;
import br.com.bruno.spring_boot_essentials.service.AgendamentoService;
import br.com.bruno.spring_boot_essentials.service.BarbeiroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/v1/agendamento")
@RequiredArgsConstructor
public class AgendamentoController {

    private final AgendamentoService agendamentoService;
    private final BarbeiroService barbeiroService;

    @PostMapping("/new")
    @ResponseStatus(HttpStatus.CREATED)
    public AgendamentoResponseDTO novoAgendamento (@Valid @RequestBody AgendamentoRequestDTO agendamento) throws RequisicaoInvalidaException {
        return agendamentoService.criarAgendamento(agendamento);
    }

    @PreAuthorize("#idUsuario == authentication.principal.id or hasRole('ADMIN')")
    @GetMapping("/agendamentos/usuario/{idUsuario}")
    public ResponseEntity<List<AgendamentoResponseDTO>> userAgendamentos (@PathVariable Long idUsuario) throws Exception{
        return ResponseEntity.ok(agendamentoService.clienteAgendamentos(idUsuario));
    }

    @PreAuthorize("#idUsuario == authentication.principal.id or hasRole('ADMIN')")
    @GetMapping("/idAgendamento/{idAgendamento}/idUsuario/{idUsuario}")
    @ResponseStatus(HttpStatus.OK)
    public AgendamentoResponseDTO buscarAgendamento (@PathVariable Long idAgendamento, @PathVariable Long idUsuario) throws Exception{
        return agendamentoService.bucarAgendamentoId(idAgendamento, idUsuario);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/barbeiro/email/{email}/id")
    public ResponseEntity<Long> buscarIdBarbeiroPorEmail(@PathVariable String email) throws Exception {
        return ResponseEntity.ok(barbeiroService.buscarIdBarbeiroPorEmail(email));
    }

    @GetMapping("/barbeiroId/{barbeiroId}/data/{data}")
    @ResponseStatus(HttpStatus.OK)
    public HorariosDisponiveisDTO buscarHorariosDisponiveis (@PathVariable Long barbeiroId, @PathVariable LocalDate data, @RequestParam (required = false) Integer duracaoMinutos) throws Exception{
        return agendamentoService.buscarHorariosDisponiveis(barbeiroId,data, duracaoMinutos);
    }

    @PreAuthorize("hasRole('BARBEIRO') or hasRole('ADMIN')")
    @GetMapping("/meus-agendamentos")
    public ResponseEntity<List<AgendamentoResponseDTO>> meusAgendamentos(Authentication authentication) {
        String emailBarbeiro = authentication.getName();
        List<AgendamentoResponseDTO> agendamentos = agendamentoService.listarAgendamentosPorEmailBarbeiro(emailBarbeiro);
        return ResponseEntity.ok(agendamentos);
    }

    @PreAuthorize("#idUsuario == authentication.principal.id or hasRole('ADMIN') or (hasRole('BARBEIRO') and @agendamentoSecurity.isBarbeiroDoAgendamento(#idAgendamento, authentication.principal.id))")
    @PatchMapping("/idAgendamento/{idAgendamento}/idUsuario/{idUsuario}")
    public ResponseEntity<String> cancelarAgendamento (@PathVariable Long idAgendamento, @PathVariable Long idUsuario) throws Exception{
        agendamentoService.cancelarAgendamento(idAgendamento, idUsuario);
        return ResponseEntity.ok("Agendamento cancelado com sucesso!");
    }

    @PreAuthorize("hasRole('ADMIN') or (hasRole('BARBEIRO') and @agendamentoSecurity.isBarbeiroDoAgendamento(#idAgendamento, authentication.principal.id))")
    @PatchMapping("/concluir/{idAgendamento}")
    public ResponseEntity<String> concluirAgendamento (@PathVariable Long idAgendamento) throws Exception{
        agendamentoService.concluirAgendamento(idAgendamento);
        return ResponseEntity.ok("Agendamento concluído com sucesso!");
    }

    @PreAuthorize("hasRole('ADMIN') or (hasRole('BARBEIRO') and @agendamentoSecurity.isBarbeiroDoAgendamento(#id, authentication.principal.id))")
    @PatchMapping("/{id}/status")
    public ResponseEntity<String> reverterParaConfirmado (@PathVariable Long id) throws Exception{
        agendamentoService.reverterParaConfirmado(id);
        return ResponseEntity.ok("Status alterado para CONFIRMADO com sucesso!");
    }

    @PreAuthorize("hasRole('ADMIN') or (hasRole('BARBEIRO') and @agendamentoSecurity.isBarbeiroDoAgendamento(#id, authentication.principal.id))")
    @GetMapping("/agendamentos/status/{status}")
    public ResponseEntity <List <AgendamentoResponseDTO>> buscarAgendamentosPorStatus (@PathVariable String status) throws Exception{
        return ResponseEntity.ok(agendamentoService.buscaAgendamentoStatus(status));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AgendamentoResponseDTO>> verTodosAgendamentos (){
        return ResponseEntity.ok(agendamentoService.verTodosAgendamentos());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/all")
    public ResponseEntity<String> deletarTodosAgendamentos (){
        agendamentoService.deletarTodosAgendamentos();
        return ResponseEntity.ok("Todos os agendamentos foram deletados com sucesso!");
    }
}
