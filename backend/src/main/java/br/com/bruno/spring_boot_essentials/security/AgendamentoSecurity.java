package br.com.bruno.spring_boot_essentials.security;

import br.com.bruno.spring_boot_essentials.database.repository.AgendamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("agendamentoSecurity")
@RequiredArgsConstructor
public class AgendamentoSecurity {

    private final AgendamentoRepository agendamentoRepository;

    public boolean isBarbeiroDoAgendamento(Long idAgendamento, Long idUsuarioLogado) {
        return agendamentoRepository.findById(idAgendamento)
                .map(agendamento -> agendamento.getBarbeiro().getUsuario().getId().equals(idUsuarioLogado))
                .orElse(false);
    }
}