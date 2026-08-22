package br.com.bruno.spring_boot_essentials.exeption;

import java.time.LocalDateTime;

public record ResponseError(
        LocalDateTime timestamp,
        int status,
        String erro
) {}
