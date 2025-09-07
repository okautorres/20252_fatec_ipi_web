package com.br.lojaquadros;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class LojaService {
    @Autowired
    private JavaMailSender conta;

    public String sendEmail(String to, String assunto, String corpo){
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom("kauantorresfatec@gmail.com");
            msg.setTo(to);
            msg.setSubject(assunto);
            msg.setText(corpo);
            conta.send(msg);
            return "";
        } catch (Exception e) {
            return "Ocorreu um erro no envio do e-mail." + e.getMessage();
        }
    }

    
}
