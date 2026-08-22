package br.com.bruno.spring_boot_essentials.dto;

public record TokenRespondeDto(String token, long expireIn, Long id) {
}
