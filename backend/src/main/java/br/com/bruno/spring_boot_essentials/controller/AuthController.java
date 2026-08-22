package br.com.bruno.spring_boot_essentials.controller;

import br.com.bruno.spring_boot_essentials.dto.LoginRequestDto;
import br.com.bruno.spring_boot_essentials.dto.RegisterRequestDto;
import br.com.bruno.spring_boot_essentials.dto.TokenRespondeDto;
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
    @ResponseStatus(HttpStatus.OK)
    public void register (@Valid @RequestBody RegisterRequestDto registerRequestDto) throws Exception {
        authenticationService.register(registerRequestDto);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public TokenRespondeDto login (@Valid @RequestBody LoginRequestDto loginRequestDto) throws Exception{
        return authenticationService.login(loginRequestDto);
    }
}
