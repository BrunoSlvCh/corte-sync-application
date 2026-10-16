package br.com.bruno.spring_boot_essentials.service;

import br.com.bruno.spring_boot_essentials.database.model.*;
import br.com.bruno.spring_boot_essentials.database.repository.BarbeiroRepository;
import br.com.bruno.spring_boot_essentials.database.repository.RoleRepository;
import br.com.bruno.spring_boot_essentials.database.repository.UsuarioRepository;
import br.com.bruno.spring_boot_essentials.dto.BarbeiroDTO;
import br.com.bruno.spring_boot_essentials.dto.CadastrarBarbeiroCompletoDTO;
import br.com.bruno.spring_boot_essentials.enums.RoleTypeEnum;
import br.com.bruno.spring_boot_essentials.exeption.EventNotFoundException;
import br.com.bruno.spring_boot_essentials.exeption.RequisicaoInvalidaException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class BarbeiroService {

    private final BarbeiroRepository barbeiroRepository;
    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    private BarbeiroDTO entityParaDto (BarbeiroEntity barbeiroEntity){
        return BarbeiroDTO.builder()
                .nome(barbeiroEntity.getNome())
                .descricao(barbeiroEntity.getDescricao())
                .status(barbeiroEntity.getStatus())
                .urlFoto(barbeiroEntity.getUrlFoto())
                .build();
    }

    @Transactional
    public void cadastrarBarbeiroDoZero(CadastrarBarbeiroCompletoDTO dto) throws RequisicaoInvalidaException {

        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RequisicaoInvalidaException("Já existe um usuário cadastrado com este e-mail!");
        }

        RolesEntity roleBarbeiro = roleRepository.findByName(RoleTypeEnum.ROLE_BARBEIRO.name())
                .orElseGet(() -> roleRepository.save(RolesEntity.builder()
                        .name(RoleTypeEnum.ROLE_BARBEIRO.name())
                        .build()));

        UsuarioEntity novoUsuario = UsuarioEntity.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .senha(passwordEncoder.encode(dto.getSenha()))
                .telefone(dto.getTelefone())
                .roles(new java.util.HashSet<>())
                .build();

        novoUsuario.getRoles().add(roleBarbeiro);
        UsuarioEntity usuarioSalvo = usuarioRepository.save(novoUsuario);

        BarbeiroEntity novoBarbeiro = BarbeiroEntity.builder()
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .status(dto.getStatus() != null ? dto.getStatus() : true)
                .urlFoto(dto.getUrlFoto())
                .usuario(usuarioSalvo)
                .build();

        barbeiroRepository.save(novoBarbeiro);
    }

    public BarbeiroDTO buscarBarbeiroNome (String nome) throws EventNotFoundException{
        BarbeiroEntity barbeiro = barbeiroRepository.findByNome(nome).orElseThrow(() -> new EventNotFoundException("Barbeiro não encontrado!"));
        return entityParaDto(barbeiro);
    }

    public Long buscarIdBarbeiroPorEmail(String email) throws EventNotFoundException{
        BarbeiroEntity barbeiro = barbeiroRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new EventNotFoundException("Barbeiro não encontrado para o e-mail: " + email));
        return barbeiro.getId();
    }

    @Transactional
    public void modificarDescricaoBarbeiro (Long id, String descricao) throws RequisicaoInvalidaException, EventNotFoundException{
        if (descricao.isEmpty()){
            throw new RequisicaoInvalidaException("A descrição não pode estar vazia!");
        }
        BarbeiroEntity barbeiro = barbeiroRepository.findById(id).orElseThrow(() -> new EventNotFoundException("Barbeiro não encontrado!"));
        barbeiro.setDescricao(descricao);
        barbeiroRepository.save(barbeiro);
    }

    @Transactional
    public void modificarFotoPorUsuarioId(Long idUsuario, String urlFoto) throws  EventNotFoundException{
        BarbeiroEntity barbeiro = barbeiroRepository.findByUsuarioId(idUsuario)
                .orElseThrow(() -> new EventNotFoundException("Barbeiro não encontrado para o usuário de ID: " + idUsuario));
        barbeiro.setUrlFoto(urlFoto);
    }

    @Transactional
    public void modificarStatusBarbeiro (Long id, Boolean status) throws Exception{
        BarbeiroEntity barbeiro = barbeiroRepository.findById(id).orElseThrow(() -> new EventNotFoundException("Barbeiro não encontrado!"));
        barbeiro.setStatus(status);
    }

    public List<BarbeiroDTO> verBarbeiros(){
        List<BarbeiroEntity> barbeiros = barbeiroRepository.findAll();
        return barbeiros.stream()
                .map(barbeiro -> BarbeiroDTO.builder()
                        .id(barbeiro.getId())
                        .nome(barbeiro.getNome())
                        .descricao(barbeiro.getDescricao())
                        .urlFoto(barbeiro.getUrlFoto())
                        .status(barbeiro.getStatus())
                        .build())
                .toList();
    }

    @Transactional
    public void deletarBarbeiro (Long id) throws EventNotFoundException {
        barbeiroRepository.findById(id).orElseThrow(() -> new EventNotFoundException("Barbeiro não encontrado!"));
        barbeiroRepository.deleteById(id);
    }
}
