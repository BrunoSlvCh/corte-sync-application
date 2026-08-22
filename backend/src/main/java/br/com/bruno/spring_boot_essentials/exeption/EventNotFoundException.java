package br.com.bruno.spring_boot_essentials.exeption;

public class EventNotFoundException extends Exception{

    public EventNotFoundException(Long id){
        super(String.format("O evento com ID '%s' não existe ou já foi cancelado.", id));
    }

    public EventNotFoundException(String customMessage){
        super(customMessage);
    }
}
