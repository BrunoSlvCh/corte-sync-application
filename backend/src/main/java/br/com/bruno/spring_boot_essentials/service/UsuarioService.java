package br.com.bruno.spring_boot_essentials.service;

import br.com.bruno.spring_boot_essentials.database.model.BarbeiroEntity;
import br.com.bruno.spring_boot_essentials.database.model.UsuarioEntity;
import br.com.bruno.spring_boot_essentials.database.repository.BarbeiroRepository;
import br.com.bruno.spring_boot_essentials.database.repository.UsuarioRepository;
import br.com.bruno.spring_boot_essentials.exeption.EventNotFoundException;
import br.com.bruno.spring_boot_essentials.exeption.RequisicaoInvalidaException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final BarbeiroRepository barbeiroRepository;

    @Transactional
    public void alterarSenha (Long idUsuario, String senhaAntiga, String novaSenha) throws Exception{

        UsuarioEntity user = usuarioRepository.findById(idUsuario).orElseThrow(() -> new EventNotFoundException("Usuário não encontrado!"));

        if (!passwordEncoder.matches(senhaAntiga, user.getSenha())) {
            throw new RequisicaoInvalidaException("Senha antiga incorreta!");
        }

        if (passwordEncoder.matches(novaSenha, user.getSenha())) {
            throw new RequisicaoInvalidaException("A nova senha não pode ser igual à senha antiga!");
        }

        else {
            user.setSenha(passwordEncoder.encode(novaSenha));
            usuarioRepository.save(user);
        }
    }

    @Transactional
    public void alterarEmail (Long idUsuario, String emailAntigo, String novoEmail) throws Exception{
        UsuarioEntity user = usuarioRepository.findById(idUsuario).orElseThrow(() -> new EventNotFoundException("Usuário não encontrado!"));

        String emailAntigoLimpo = emailAntigo.trim().toLowerCase();
        String novoEmailLimpo = novoEmail.trim().toLowerCase();

        UsuarioEntity verificaEmail = usuarioRepository.findByEmail(novoEmailLimpo).orElse(null);

        if (verificaEmail != null && !verificaEmail.getId().equals(idUsuario)) {
            throw new RequisicaoInvalidaException("Este E-Mail já pertence a outro usuário!");
        }

        if (!user.getEmail().equals(emailAntigoLimpo)){
            throw new RequisicaoInvalidaException("E-Mail antigo incorreto!");
        }

        if (user.getEmail().equals(novoEmailLimpo)){
            throw new RequisicaoInvalidaException("O novo E-Mail não pode ser igual ao E-Mail antigo!");
        }
        user.setEmail(novoEmailLimpo);
        usuarioRepository.save(user);
    }

    @Transactional
    public void alterarNome (Long idUsuario, String novoNome) throws Exception{
        UsuarioEntity user = usuarioRepository.findById(idUsuario).orElseThrow(() -> new EventNotFoundException("Usuário não encontrado!"));

        String novoNomeLimpo = novoNome.trim();

        if (user.getNome().equals(novoNomeLimpo)){
            throw new RequisicaoInvalidaException("O novo nome não pode ser igual ao nome antigo!");
        }

        user.setNome(novoNomeLimpo);
        usuarioRepository.save(user);

        barbeiroRepository.findByUsuarioEmail(user.getEmail()).ifPresent(barbeiro ->{
            barbeiro.setNome(novoNome);
            barbeiroRepository.save(barbeiro);
        });
    }

    @Transactional
    public void alterarTelefone (Long idUsuario, String telefoneAntigo, String novoTelefone) throws Exception{
        UsuarioEntity user = usuarioRepository.findById(idUsuario).orElseThrow(() -> new EventNotFoundException("Usuário não encontrado!"));

        String telefoneAntigoLimpo = telefoneAntigo.trim();
        String novoTelefoneLimpo = novoTelefone.trim();

        UsuarioEntity verificaTelefone = usuarioRepository.findByTelefone(novoTelefoneLimpo).orElse(null);

        if (verificaTelefone != null && !verificaTelefone.getId().equals(idUsuario)){
            throw new RequisicaoInvalidaException("Este número de telefone já pertence a outro usuário!");
        }

        if (!user.getTelefone().equals(telefoneAntigoLimpo)){
            throw new RequisicaoInvalidaException("Telefone antigo incorreto!");
        }

        if (user.getTelefone().equals(novoTelefoneLimpo)){
            throw new RequisicaoInvalidaException("O novo telefone não pode ser igual ao telefone antigo!");
        }
        user.setTelefone(novoTelefoneLimpo);
        usuarioRepository.save(user);
    }
}
