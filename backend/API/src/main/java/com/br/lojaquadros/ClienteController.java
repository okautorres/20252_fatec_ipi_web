package com.br.lojaquadros;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class ClienteController {
    @Autowired
    ClienteRepository bd;

    @Autowired
    PasswordEncoder passwordEncoder;


    @Autowired LojaService lojaService;

    //CADASTRO

    @PostMapping("/cliente/cadastro")
    public void postCliente (@RequestBody Cliente obj){
       Optional<Cliente> clienteExistente = bd.findByEmail(obj.getEmail());
        
        if (clienteExistente.isPresent()) {
            System.out.println("Erro: E-mail já cadastrado.");
            return;
        }

        String token = UUID.randomUUID().toString();
        obj.setPassword(passwordEncoder.encode(obj.getPassword()));
        obj.setActive(0); 
        obj.setTokenEmail(token); 

        bd.save(obj);
        System.out.println("Cliente salvo com sucesso.");

        String linkConfirmacao = "http://localhost:8080/cliente/ativar?token=" + token;
        String assunto = "Confirmação de Cadastro - " + obj.getName();
        String corpo = "Olá " + obj.getName() + ",\n\n"
                 + "Obrigado por se cadastrar em nossa loja! Para ativar sua conta e começar a usar, temos um sistema de segunraça, por favor, clique no link abaixo:\n"
                 + linkConfirmacao + "\n\n"
                 + "Atenciosamente,\n"
                 + "Equipe Loja de Quadros.";
        
        lojaService.sendEmail(obj.getEmail(), assunto, corpo);
        System.out.println("E-mail enviado  com sucesso.");
    }

    //ATIVAÇÃO
    
    @PatchMapping("/cliente/ativar")
    public void ativarCliente(@RequestParam("token") String token) {
        Optional<Cliente> re = bd.findByTokenEmail(token);
        
        if (re.isPresent()) {
            Cliente cliente = re.get();
            cliente.setActive(1); 
            cliente.setTokenEmail(null); 
            bd.save(cliente);
            System.out.println("Cliente ativado com sucesso!");
        } else {
            System.out.println("Erro: Token inválido ou expirado.");
        }
    }

    //PEGAR POR ID

    @GetMapping("/cliente/{id}")
    public Cliente getCliente(@PathVariable("id") int id){
        if(bd.existsById(id)){
            return bd.findById(id).get();
        } else{
            return new Cliente();
        }
    }

    //ATUALIZAR

    @PutMapping("/cliente")
    public void putCliente(@RequestBody Cliente obj){
        if(bd.existsById(obj.getId())){
            bd.save(obj);
            System.out.println("Cliente alterado.");
        }
    }

    //DELETAR

    @DeleteMapping("/cliente/{id}")
    public void deleteCliente(@PathVariable("id") int id){
        if(bd.existsById(id)){
            bd.deleteById(id);
            System.out.println("Cliente removido.");
        }
    }

    //LISTAR

    @GetMapping("/clientes")
    public List<Cliente> listClientes(){
        return bd.findAll();
    }

    //LOGIN

    @PostMapping("/cliente/login")
    public Cliente login(@RequestBody Cliente obj){
        Optional<Cliente> re = bd.findByEmail(obj.getEmail());
        
        if(re.isPresent()){
            Cliente cliente = re.get();
            if(passwordEncoder.matches(obj.getPassword(), cliente.getPassword()) && cliente.getActive() == 1) {
                System.out.println("Login efetuado com sucesso!");
                Cliente clienteSemSenha = new Cliente();
                clienteSemSenha.setId(cliente.getId());
                clienteSemSenha.setName(cliente.getName());
                clienteSemSenha.setEmail(cliente.getEmail());
                return clienteSemSenha;
            }
        }
        
        System.out.println("Erro: E-mail, senha ou conta inativos. Verifique suas credenciais.");
        return new Cliente(); 
    }

    //REDIFINIR SENHA

@PostMapping("/cliente/redefinir-senha")
public ResponseEntity<?> resetPassword(@RequestBody Cliente obj) {

    Optional<Cliente> re = bd.findByEmail(obj.getEmail());

    if (!re.isPresent()) {
        // retorna status 404 + mensagem
        return ResponseEntity
                .status(404)
                .body("não existe esse email");
    }
    
    Cliente cliente = re.get();
    String tokenRedefinicao = UUID.randomUUID().toString();
    cliente.setTokenEmail(tokenRedefinicao);
    bd.save(cliente);

    String linkRedefinicao = "http://localhost:8080/cliente/nova-senha?token=" + tokenRedefinicao;

    String assunto = "Redefinição de Senha";
    String corpo = "Olá " + cliente.getName() + ",\n\n"
            + "Recebemos uma solicitação para redefinir sua senha. Se você não fez essa solicitação, pode ignorar este e-mail. Caso contrário, clique no link abaixo para criar uma nova senha:\n"
            + linkRedefinicao + "\n\n"
            + "O link expira em 30 minutos.\n\n"
            + "Atenciosamente,\n"
            + "Equipe Loja de Quadros.";

    lojaService.sendEmail(cliente.getEmail(), assunto, corpo);

    return ResponseEntity.ok("E-mail de redefinição enviado.");
}


    //NOVA SENHA

    @PatchMapping("/cliente/nova-senha")
    public void defineNewPassword(@RequestParam("token") String token, @RequestBody Cliente clienteComNovaSenha) {
        Optional<Cliente> re = bd.findByTokenEmail(token);
        
        if (re.isPresent()) {
            Cliente cliente = re.get();
            cliente.setPassword(passwordEncoder.encode(clienteComNovaSenha.getPassword()));
            cliente.setTokenEmail(null); 
            bd.save(cliente);
        }
    }

    //LISTAR INATIVOS

    @GetMapping("/clientes/inativos")
    public List<Cliente> listInativos(){
        return bd.listInativos();
    }


}
