package br.com.bruno.spring_boot_essentials.service;

import br.com.bruno.spring_boot_essentials.database.model.ArquivoEntity;
import br.com.bruno.spring_boot_essentials.database.model.UsuarioEntity;
import br.com.bruno.spring_boot_essentials.database.repository.ArquivoRepository;
import br.com.bruno.spring_boot_essentials.database.repository.UsuarioRepository;
import br.com.bruno.spring_boot_essentials.dto.ArquivoDto;
import br.com.bruno.spring_boot_essentials.exeption.EventNotFoundException;
import br.com.bruno.spring_boot_essentials.exeption.RequisicaoInvalidaException;
import ch.qos.logback.core.Context;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ArquivoService {

    private final ArquivoRepository arquivoRepository;
    private final UsuarioRepository usuarioRepository;
    private static final String DIRETORIO_UPLOAD = System.getProperty("user.dir") + "/uploads/";

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public String gerarHashSha256(String nomeArquivo) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(nomeArquivo.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar hash do arquivo", e);
        }
    }

    @Transactional
    public String novoArquivo(Long idUsuario, MultipartFile arquivo) throws RequisicaoInvalidaException, DataIntegrityViolationException {

        UsuarioEntity user = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado."));

        if (arquivo == null || arquivo.isEmpty()) {
            throw new RequisicaoInvalidaException("Por favor, selecione um arquivo para enviar.");
        }

        String nomeOriginal = arquivo.getOriginalFilename();
        if (nomeOriginal == null || nomeOriginal.isBlank()) {
            nomeOriginal = "arquivo_sem_nome";
        }

        ArquivoEntity buscaArquivo = arquivoRepository.findByNome(nomeOriginal).orElse(null);
        if (buscaArquivo != null) {
            throw new DataIntegrityViolationException("Este arquivo já foi salvo anteriormente.");
        }

        long tamanhoArquivo = arquivo.getSize();
        long tamanhoLimite = 50 * 1024 * 1024L;

        if (tamanhoArquivo > tamanhoLimite) {
            throw new RequisicaoInvalidaException("Esse arquivo ultrapassa o limite permitido de 50MB.");
        }

        String subpasta = LocalDate.now().toString();
        String nomeUnico = UUID.randomUUID().toString() + "_" + nomeOriginal;
        String chaveS3 = subpasta + "/" + nomeUnico;

        try (InputStream inputStream = arquivo.getInputStream()) {

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(chaveS3)
                    .contentType(arquivo.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, tamanhoArquivo));

            ArquivoEntity novoArquivo = ArquivoEntity.builder()
                    .nome(nomeOriginal)
                    .hashNome(gerarHashSha256(nomeOriginal))
                    .caminho(chaveS3)
                    .tamanho(tamanhoArquivo)
                    .tipoMime(arquivo.getContentType())
                    .dataCriacao(new Date())
                    .usuario(user)
                    .email(user.getEmail())
                    .build();

            arquivoRepository.save(novoArquivo);
            return "Arquivo enviado com sucesso para a AWS S3: " + nomeOriginal;

        } catch (IOException e) {
            throw new RuntimeException("Erro ao ler o fluxo do arquivo: " + e.getMessage(), e);
        } catch (S3Exception e) {
            throw new RuntimeException("Erro ao salvar o arquivo no S3 da AWS: " + e.getMessage(), e);
        }
    }

    public ResponseEntity<Resource> baixarArquivo(Long idUsuario, String nomeArquivo) throws FileNotFoundException, EventNotFoundException {

        UsuarioEntity user = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EventNotFoundException("Usuário não encontrado."));

        ArquivoEntity arquivo = arquivoRepository.findByEmail(user.getEmail()).stream()
                .filter(a -> a.getNome().equalsIgnoreCase(nomeArquivo))
                .findFirst()
                .orElseThrow(() -> new EventNotFoundException("Arquivo não encontrado para este usuário."));

        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(arquivo.getCaminho())
                    .build();

            ResponseInputStream<GetObjectResponse> s3ObjectStream = s3Client.getObject(getObjectRequest);

            InputStreamResource resource = new InputStreamResource(s3ObjectStream);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(arquivo.getTipoMime()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + arquivo.getNome() + "\"")
                    .body(resource);

        } catch (NoSuchKeyException e) {
            throw new FileNotFoundException("O arquivo físico não foi encontrado no S3: " + arquivo.getNome());
        } catch (S3Exception e) {
            throw new RuntimeException("Erro de comunicação com a AWS S3 ao baixar o arquivo: " + e.getMessage(), e);
        }
    }

    public List<ArquivoDto> verArquivos() {
        return arquivoRepository.findAll().stream()
                .map(this::converterParaDto)
                .toList();
    }

    public List<ArquivoDto> verArquivosUser(Long idUsuario) throws EventNotFoundException {
        UsuarioEntity user = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EventNotFoundException("Usuário não encontrado."));

        List<ArquivoEntity> arquivosUsuario = arquivoRepository.findByEmail(user.getEmail());

        return arquivosUsuario.stream()
                .map(this::converterParaDto)
                .toList();
    }

    public ArquivoDto buscarArquivoId(Long idArquivo, Long idUsuario) throws EventNotFoundException {
        UsuarioEntity user = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EventNotFoundException("Usuário não encontrado."));

        ArquivoEntity arquivo = arquivoRepository.findById(idArquivo)
                .orElseThrow(() -> new EventNotFoundException("Arquivo não encontrado."));

        if (!user.getEmail().equalsIgnoreCase(arquivo.getEmail())) {
            throw new EventNotFoundException("O arquivo solicitado não pertence a este usuário.");
        }

        return converterParaDto(arquivo);
    }

    public ArquivoDto buscarArquivoNome(String nomeArquivo, Long idUsuario) throws EventNotFoundException {
        UsuarioEntity user = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EventNotFoundException("Usuário não encontrado."));

        ArquivoEntity arquivo = arquivoRepository.findByEmail(user.getEmail()).stream()
                .filter(a -> a.getNome().equalsIgnoreCase(nomeArquivo))
                .findFirst()
                .orElseThrow(() -> new EventNotFoundException("Arquivo não encontrado com o nome: " + nomeArquivo));

        return converterParaDto(arquivo);
    }

    @Transactional
    public String deletarTudo() {
        List <ArquivoEntity> todosArquivos = arquivoRepository.findAll();

        for (ArquivoEntity arquivo : todosArquivos){
            deletarArquivoS3(arquivo.getCaminho());
        }

        arquivoRepository.deleteAll();
        return "Todos os arquivos foram deletados com sucesso.";
    }

    @Transactional
    public String mudarNomeArquivo(Long idUsuario, String nomeAtual, String novoNome) throws EventNotFoundException {
        UsuarioEntity user = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EventNotFoundException("Usuário não encontrado."));

        ArquivoEntity arquivo = arquivoRepository.findByEmail(user.getEmail()).stream()
                .filter(a -> a.getNome().equalsIgnoreCase(nomeAtual))
                .findFirst()
                .orElseThrow(() -> new EventNotFoundException("Arquivo não encontrado: " + nomeAtual));

        arquivo.setNome(novoNome);
        arquivoRepository.save(arquivo);

        return "Nome do arquivo alterado com sucesso para: " + novoNome;
    }

    @Transactional
    public String deletarArquivoId(Long idArquivo, Long idUsuario) throws EventNotFoundException {
        UsuarioEntity user = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EventNotFoundException("Usuário não encontrado."));

        ArquivoEntity arquivo = arquivoRepository.findById(idArquivo)
                .orElseThrow(() -> new EventNotFoundException("Arquivo não encontrado."));

        if (!user.getEmail().equalsIgnoreCase(arquivo.getEmail())) {
            throw new EventNotFoundException("O arquivo não pertence a este usuário.");
        }

        deletarArquivoS3(arquivo.getCaminho());
        arquivoRepository.delete(arquivo);

        return "Arquivo deletado com sucesso.";
    }

    @Transactional
    public String deletarArquivoNome(Long idUsuario, String nomeArquivo) throws EventNotFoundException {
        UsuarioEntity user = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EventNotFoundException("Usuário não encontrado."));

        ArquivoEntity arquivo = arquivoRepository.findByEmail(user.getEmail()).stream()
                .filter(a -> a.getNome().equalsIgnoreCase(nomeArquivo))
                .findFirst()
                .orElseThrow(() -> new EventNotFoundException("Arquivo não encontrado: " + nomeArquivo));

        deletarArquivoS3(arquivo.getCaminho());
        arquivoRepository.delete(arquivo);

        return "Arquivo deletado com sucesso.";
    }

    private void deletarArquivoS3(String chaveS3) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(chaveS3)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);

        } catch (S3Exception e) {
            throw new RuntimeException("Falha ao tentar deletar o arquivo no S3: " + e.getMessage(), e);
        }
    }

    private ArquivoDto converterParaDto(ArquivoEntity entity) {
        return ArquivoDto.builder()
                .nome(entity.getNome())
                .caminho(entity.getCaminho())
                .tamanho(entity.getTamanho())
                .tipoMime(entity.getTipoMime())
                .dataCriacao(entity.getDataCriacao())
                .build();
    }
}