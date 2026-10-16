package br.com.bruno.spring_boot_essentials.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class TokenProvider {

    @Value("${jwt.expiration}")
    private long expirationTime;

    @Value("${jwt.key}")
    private String key;

    public String gerarToken (Authentication authentication){
        UserDetails user = (UserDetails) authentication.getPrincipal();
        return buildToken(user.getUsername());
    }

    private String buildToken (String username){
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationTime);
        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(getSingInKey())
                .compact();
    }

    private SecretKey getSingInKey(){
        return Keys.hmacShaKeyFor(key.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    private Claims getClaims (String token){
        return Jwts.parser().verifyWith(getSingInKey()).build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValid (String token){
        try {
            getClaims(token);
            return true;
        } catch(Exception e){
            System.out.println(">>> ERRO NA VALIDAÇÃO DO TOKEN: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public String getUsername (String token){
        return getClaims(token).getSubject();
    }
}
