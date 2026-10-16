package br.com.bruno.spring_boot_essentials.controller;

import br.com.bruno.spring_boot_essentials.dto.*;
import br.com.bruno.spring_boot_essentials.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register (@Valid @RequestBody RegisterRequestDTO registerRequestDto) {
        authenticationService.register(registerRequestDto);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public TokenResponseDTO login (@Valid @RequestBody LoginRequestDTO loginRequestDto) throws Exception{
        return authenticationService.login(loginRequestDto);
    }
}
