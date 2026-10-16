package br.com.bruno.spring_boot_essentials.dto;

public record TokenResponseDTO(String token, long expireIn, Long id) {
}
