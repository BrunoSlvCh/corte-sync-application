package br.com.bruno.spring_boot_essentials.handler;

import br.com.bruno.spring_boot_essentials.exeption.EventNotFoundException;
import br.com.bruno.spring_boot_essentials.exeption.RequisicaoInvalidaException;
import br.com.bruno.spring_boot_essentials.exeption.ResponseError;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(EventNotFoundException.class)
    public ResponseEntity<ResponseError> handleEventNotFound(EventNotFoundException exception) {
        ResponseError error = new ResponseError(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                exception.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(RequisicaoInvalidaException.class)
    public ResponseEntity<ResponseError> handleRequisicaoInvalida(RequisicaoInvalidaException exception) {
        ResponseError error = new ResponseError(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                exception.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ResponseError> handleIllegalArgument(IllegalArgumentException exception) {
        ResponseError error = new ResponseError(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                exception.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ResponseError> handleDataIntegrityViolation(DataIntegrityViolationException exception) {
        ResponseError error = new ResponseError(
                LocalDateTime.now(),
                HttpStatus.CONFLICT.value(),
                "Conflito ao salvar os dados. O registro já existe ou viola uma regra do sistema."
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseError> handleMethodArgumentNotValid(MethodArgumentNotValidException exception) {
        String mensagensDeErro = exception.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .collect(Collectors.joining("; "));

        ResponseError error = new ResponseError(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Falha na validação dos campos: " + mensagensDeErro
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ResponseError> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException exception) {
        ResponseError error = new ResponseError(
                LocalDateTime.now(),
                HttpStatus.PAYLOAD_TOO_LARGE.value(),
                "O arquivo excede o limite máximo permitido de 50MB."
        );
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseError> handleGeneralException(Exception exception) {
        ResponseError error = new ResponseError(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde."
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}