package br.com.bruno.spring_boot_essentials.exeption;

public class RequisicaoInvalidaException extends Exception{

    public RequisicaoInvalidaException(String customMessage){
        super(String.format(customMessage));
    }
}
