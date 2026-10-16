package br.com.bruno.spring_boot_essentials.service;
import br.com.bruno.spring_boot_essentials.database.model.ServicoEntity;
import br.com.bruno.spring_boot_essentials.database.repository.ServicoRepository;
import br.com.bruno.spring_boot_essentials.dto.ServicoDTO;
import br.com.bruno.spring_boot_essentials.exeption.EventNotFoundException;
import br.com.bruno.spring_boot_essentials.exeption.RequisicaoInvalidaException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServicoService {

    private final ServicoRepository servicoRepository;

    private ServicoEntity dtoParaEntity (ServicoDTO servicoDTO){
        return ServicoEntity.builder()
                .id(servicoDTO.getId())
                .nomeServico(servicoDTO.getNomeServico())
                .precoServico(servicoDTO.getPrecoServico())
                .duracaoServico(servicoDTO.getDuracaoServico())
                .status(servicoDTO.getStatus())
                .categoria(servicoDTO.getCategoria())
                .build();
    }

    private ServicoDTO entityParaDto (ServicoEntity servicoEntity){
        return ServicoDTO.builder()
                .id(servicoEntity.getId())
                .nomeServico(servicoEntity.getNomeServico())
                .precoServico(servicoEntity.getPrecoServico())
                .duracaoServico(servicoEntity.getDuracaoServico())
                .status(servicoEntity.getStatus())
                .categoria(servicoEntity.getCategoria())
                .build();
    }

    @Transactional
    public void criarServico (ServicoDTO servicoDTO) throws DataIntegrityViolationException{
        ServicoEntity servico = servicoRepository.findByNomeServico(servicoDTO.getNomeServico()).orElse(null);

        if (servico != null){
            throw new DataIntegrityViolationException("Esse serviço já foi criado anteriormente!");
        }
        servicoRepository.save(dtoParaEntity(servicoDTO));
    }

    public ServicoDTO buscarServicoNome (String nomeServico) throws EventNotFoundException{
        ServicoEntity servico = servicoRepository.findByNomeServico(nomeServico).orElseThrow(() -> new EventNotFoundException("Serviço não encontrado!"));
        return entityParaDto(servico);
    }

    public List<ServicoDTO> verServicos(){
        List<ServicoEntity> servicos = servicoRepository.findAll();
        return servicos.stream()
                .map(servico -> ServicoDTO.builder()
                        .id(servico.getId())
                        .nomeServico(servico.getNomeServico())
                        .precoServico(servico.getPrecoServico())
                        .duracaoServico(servico.getDuracaoServico())
                        .status(servico.getStatus())
                        .categoria(servico.getCategoria())
                        .build())
                .toList();
    }

    @Transactional
    public void modificarNomeServico (String nomeServico, String novoNome) throws EventNotFoundException{
        ServicoEntity servico = servicoRepository.findByNomeServico(nomeServico).orElseThrow(() -> new EventNotFoundException("Serviço não encontrado!"));
        servico.setNomeServico(novoNome);
        servicoRepository.save(servico);
    }

    @Transactional
    public void modificarPrecoServico (String nomeServico, BigDecimal novoPreco) throws EventNotFoundException{
        ServicoEntity servico = servicoRepository.findByNomeServico(nomeServico).orElseThrow(() -> new EventNotFoundException("Serviço não encontrado!"));
        servico.setPrecoServico(novoPreco);
        servicoRepository.save(servico);
    }

    @Transactional
    public void modificarDuracaoServico (String nomeServico, Integer novaDuracao) throws EventNotFoundException{
        ServicoEntity servico = servicoRepository.findByNomeServico(nomeServico).orElseThrow(() -> new EventNotFoundException("Serviço não encontrado!"));
        servico.setDuracaoServico(novaDuracao);
        servicoRepository.save(servico);
    }

    @Transactional
    public void modificarCategoriaServico (String nomeServico, String novaCategoria) throws EventNotFoundException{
        ServicoEntity servico = servicoRepository.findByNomeServico(nomeServico).orElseThrow(() -> new EventNotFoundException("Serviço não encontrado!"));
        servico.setCategoria(novaCategoria);
        servicoRepository.save(servico);
    }

    @Transactional
    public void deletarServico (String nomeServico) throws EventNotFoundException{
        ServicoEntity servico = servicoRepository.findByNomeServico(nomeServico).orElseThrow(() -> new EventNotFoundException("Serviço não encontrado!"));
        servicoRepository.deleteById(servico.getId());
    }

    @Transactional
    public void modificarStatusServico (Long idServico, Boolean status) throws RequisicaoInvalidaException {
        ServicoEntity servico = servicoRepository.findById(idServico).orElseThrow(() -> new RequisicaoInvalidaException("Serviço não encontrado!"));
        servico.setStatus(status);
    }

    @Transactional
    public void deletarTodosServicos (){
        servicoRepository.deleteAll();
    }
}
