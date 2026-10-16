package br.com.bruno.spring_boot_essentials.service;

import br.com.bruno.spring_boot_essentials.database.model.AgendamentoEntity;
import br.com.bruno.spring_boot_essentials.database.model.BarbeiroEntity;
import br.com.bruno.spring_boot_essentials.database.model.ServicoEntity;
import br.com.bruno.spring_boot_essentials.database.model.UsuarioEntity;
import br.com.bruno.spring_boot_essentials.database.repository.AgendamentoRepository;
import br.com.bruno.spring_boot_essentials.database.repository.BarbeiroRepository;
import br.com.bruno.spring_boot_essentials.database.repository.ServicoRepository;
import br.com.bruno.spring_boot_essentials.database.repository.UsuarioRepository;
import br.com.bruno.spring_boot_essentials.dto.AgendamentoRequestDTO;
import br.com.bruno.spring_boot_essentials.dto.AgendamentoResponseDTO;
import br.com.bruno.spring_boot_essentials.dto.HorariosDisponiveisDTO;
import br.com.bruno.spring_boot_essentials.dto.ServicoDTO;
import br.com.bruno.spring_boot_essentials.exeption.EventNotFoundException;
import br.com.bruno.spring_boot_essentials.exeption.RequisicaoInvalidaException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final BarbeiroRepository barbeiroRepository;
    private final ServicoRepository servicoRepository;

    private AgendamentoResponseDTO entityParaResponseDTO (AgendamentoEntity agendamentoEntity) {

        List <ServicoEntity > servicosEntiy = agendamentoEntity.getServicos();

        List<ServicoDTO> servicosDto = servicosEntiy.stream()
                .map(servicoEntity -> ServicoDTO.builder()
                        .nomeServico(servicoEntity.getNomeServico())
                        .duracaoServico(servicoEntity.getDuracaoServico())
                        .precoServico(servicoEntity.getPrecoServico())
                        .status(servicoEntity.getStatus())
                        .categoria(servicoEntity.getCategoria())
                        .build())
                .toList();


        return AgendamentoResponseDTO.builder()
                .id(agendamentoEntity.getId())
                .dataInicio(agendamentoEntity.getDataInicio())
                .dataTermino(agendamentoEntity.getDataTermino())
                .status(agendamentoEntity.getStatus())
                .valorTotal(agendamentoEntity.getValorTotal())
                .clienteNome(agendamentoEntity.getUsuario().getNome())
                .barbeiroNome(agendamentoEntity.getBarbeiro().getNome())
                .servicos(servicosDto)
                .build();
    }

    @Transactional
    public AgendamentoResponseDTO criarAgendamento(AgendamentoRequestDTO dto) throws RequisicaoInvalidaException {
        UsuarioEntity cliente = usuarioRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RequisicaoInvalidaException("Cliente não encontrado!"));

        UsuarioEntity usuarioLogado = (UsuarioEntity) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        boolean isAdmin = usuarioLogado.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));

        if (!isAdmin && !dto.getClienteId().equals(usuarioLogado.getId())) {
            throw new RequisicaoInvalidaException("Você não pode criar agendamentos para outro cliente!");
        }

        BarbeiroEntity barbeiro = barbeiroRepository.findById(dto.getBarbeiroId())
                .orElseThrow(() -> new RequisicaoInvalidaException("Barbeiro não encontrado"));

        List<ServicoEntity> servicos = servicoRepository.findAllById(dto.getServicosIds());
        if (servicos.isEmpty()) {
            throw new RequisicaoInvalidaException("Nenhum serviço válido foi informado");
        }

        int duracaoTotalMinutos = servicos.stream()
                .mapToInt(ServicoEntity::getDuracaoServico)
                .sum();

        BigDecimal valorTotal = servicos.stream()
                .map(ServicoEntity::getPrecoServico)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        LocalDateTime dataTermino = dto.getDataInicio().plusMinutes(duracaoTotalMinutos);

        boolean existeConflito = agendamentoRepository.existsConflitoHorario(
                dto.getBarbeiroId(),
                dto.getDataInicio(),
                dataTermino
        );

        if (existeConflito) {
            throw new RequisicaoInvalidaException("O barbeiro selecionado já possui um agendamento nesse horário");
        }

        AgendamentoEntity entity = AgendamentoEntity.builder()
                .usuario(cliente)
                .barbeiro(barbeiro)
                .servicos(servicos)
                .dataInicio(dto.getDataInicio())
                .dataTermino(dataTermino)
                .valorTotal(valorTotal)
                .status("CONFIRMADO")
                .build();

        AgendamentoEntity agendamentoSalvo = agendamentoRepository.save(entity);
        return entityParaResponseDTO(agendamentoSalvo);
    }

    public List<AgendamentoResponseDTO> listarAgendamentosPorEmailBarbeiro(String email) {
        BarbeiroEntity barbeiro = barbeiroRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Barbeiro não encontrado para o e-mail logado!"));

        List<AgendamentoEntity> agendamentos = agendamentoRepository.findByBarbeiroId(barbeiro.getId());

        return agendamentos.stream()
                .map(this::entityParaResponseDTO)
                .collect(Collectors.toList());
    }

    public List <AgendamentoResponseDTO> clienteAgendamentos (Long usuarioId) throws EventNotFoundException{
        UsuarioEntity usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new EventNotFoundException("Usuário não encontrado!"));
        List <AgendamentoEntity> agendamentos = agendamentoRepository.findByUsuario(usuario);

        return agendamentos.stream()
                .map(this::entityParaResponseDTO)
                .toList();
    }


    public AgendamentoResponseDTO bucarAgendamentoId (Long idAgendamento, Long idUsuario) throws EventNotFoundException, RequisicaoInvalidaException {

        usuarioRepository.findById(idUsuario).orElseThrow(() -> new EventNotFoundException("Usuário não encontrado!"));

        AgendamentoEntity agendamento = agendamentoRepository.findById(idAgendamento).orElseThrow(() -> new EventNotFoundException("Agendamento não encontrado!"));

        if (!agendamento.getUsuario().getId().equals(idUsuario)) {
            throw new RequisicaoInvalidaException("O agendamento informado não pertence a este usuário");
        }
        return entityParaResponseDTO(agendamento);
    }

    public HorariosDisponiveisDTO buscarHorariosDisponiveis(Long barbeiroId, LocalDate data, Integer duracaoServicoMinutos) throws RequisicaoInvalidaException {
        BarbeiroEntity barbeiro = barbeiroRepository.findById(barbeiroId)
                .orElseThrow(() -> new RequisicaoInvalidaException("Barbeiro não encontrado"));

        int duracao = (duracaoServicoMinutos != null && duracaoServicoMinutos > 0) ? duracaoServicoMinutos : 30;

        LocalTime inicioExpediente = LocalTime.of(8, 0);
        LocalTime fimExpediente = LocalTime.of(18, 0);
        int intervaloMinutos = 30;

        List<LocalTime> todosHorarios = new ArrayList<>();
        LocalTime horarioAtual = inicioExpediente;

        while (horarioAtual.isBefore(fimExpediente)) {
            todosHorarios.add(horarioAtual);
            horarioAtual = horarioAtual.plusMinutes(intervaloMinutos);
        }

        LocalDateTime inicioDia = data.atStartOfDay();
        LocalDateTime fimDia = data.atTime(23, 59, 59);

        List<AgendamentoEntity> agendamentosDoDia = agendamentoRepository
                .findByBarbeiroIdAndDataInicioBetweenAndStatusNot(
                        barbeiroId,
                        inicioDia,
                        fimDia,
                        "CANCELADO"
                );

        List<LocalTime> horariosLivres = todosHorarios.stream()
                .filter(horarioSlot -> {
                    LocalTime fimPossivelAgendamento = horarioSlot.plusMinutes(duracao);

                    if (fimPossivelAgendamento.isAfter(fimExpediente)) {
                        return false;
                    }

                    return agendamentosDoDia.stream().noneMatch(agendamento -> {
                        LocalTime inicioAgendamento = agendamento.getDataInicio().toLocalTime();
                        LocalTime fimAgendamento = agendamento.getDataTermino().toLocalTime();

                        return horarioSlot.isBefore(fimAgendamento) && fimPossivelAgendamento.isAfter(inicioAgendamento);
                    });
                })
                .collect(Collectors.toList());

        return HorariosDisponiveisDTO.builder()
                .barbeiroId(barbeiro.getId())
                .nomeBarbeiro(barbeiro.getNome())
                .dataConsulta(data)
                .horariosDisponiveis(horariosLivres)
                .build();
    }

    @Transactional
    public void cancelarAgendamento (Long idAgendamento, Long idUsuario) throws EventNotFoundException, RequisicaoInvalidaException {
        usuarioRepository.findById(idUsuario).orElseThrow(() -> new EventNotFoundException("Usuário não encontrado!"));

        AgendamentoEntity agendamento = agendamentoRepository.findById(idAgendamento).orElseThrow(() -> new EventNotFoundException("Agendamento não encontrado!"));


        if (!agendamento.getUsuario().getId().equals(idUsuario)) {
            throw new RequisicaoInvalidaException("O agendamento informado não pertence a este usuário");
        }
        agendamento.setStatus("CANCELADO");
    }

    @Transactional
    public void concluirAgendamento (Long idAgendamento) throws EventNotFoundException, RequisicaoInvalidaException {
        AgendamentoEntity agendamento = agendamentoRepository.findById(idAgendamento).orElseThrow(() -> new EventNotFoundException("Agendamento não encontrado!"));

        if ("CANCELADO".equalsIgnoreCase(agendamento.getStatus())){
            throw new RequisicaoInvalidaException("Não é possível concluir um agendamento cancelado!");
        }

        if ("CONCLUIDO".equals(agendamento.getStatus())){
            throw new RequisicaoInvalidaException("Essa agendamento já foi concluído!");
        }

        agendamento.setStatus("CONCLUIDO");
    }

    @Transactional
    public void reverterParaConfirmado (Long idAgendamento) throws EventNotFoundException,RequisicaoInvalidaException{
        AgendamentoEntity agendamento = agendamentoRepository.findById(idAgendamento).orElseThrow(() -> new EventNotFoundException("Agendamento não encontrado!"));

        if (agendamento.getStatus().equalsIgnoreCase("CONFIRMADO")){
            throw new RequisicaoInvalidaException("Este agendamento já está com o status confirmado!");
        }
        agendamento.setStatus("CONFIRMADO");
    }

    public List <AgendamentoResponseDTO> buscaAgendamentoStatus (String status) throws Exception{
        String statusUpper = status.toUpperCase();
        if (!statusUpper.equals("CONFIRMADO") && !statusUpper.equals("CONCLUIDO") && !statusUpper.equals("CANCELADO")){
            throw new RequisicaoInvalidaException("O status buscado é inválido! Use CONFIRMADO, CONCLUIDO ou CANCELADO!");
        }
        List <AgendamentoEntity> agendamentos = agendamentoRepository.findByStatus(statusUpper);
        return agendamentos.stream()
                .map(this::entityParaResponseDTO)
                .toList();
    }

    public List <AgendamentoResponseDTO> verTodosAgendamentos (){
       List <AgendamentoEntity> agendamentos = agendamentoRepository.findAll();
       return agendamentos.stream()
               .map(agendamento -> AgendamentoResponseDTO.builder()
                       .id(agendamento.getId())
                       .dataInicio(agendamento.getDataInicio())
                       .dataTermino(agendamento.getDataTermino())
                       .status(agendamento.getStatus())
                       .valorTotal(agendamento.getValorTotal())
                       .clienteId(agendamento.getUsuario().getId())
                       .clienteNome(agendamento.getUsuario().getNome())
                       .barbeiroId(agendamento.getBarbeiro().getId())
                       .barbeiroNome(agendamento.getBarbeiro().getNome())

                       .servicos(agendamento.getServicos().stream()
                               .map(servico -> ServicoDTO.builder()
                                       .nomeServico(servico.getNomeServico())
                                       .precoServico(servico.getPrecoServico())
                                       .duracaoServico(servico.getDuracaoServico())
                                       .status(servico.getStatus())
                                       .categoria(servico.getCategoria())
                                       .build())
                                .toList())
                       .build())
                .toList();
    }

    @Transactional
    public void deletarTodosAgendamentos (){
        agendamentoRepository.deleteAll();
    }
}

