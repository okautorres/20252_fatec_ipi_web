package com.br.lojaquadros;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class ClienteController {
    @Autowired
    ClienteRepository bd;

    @Autowired LojaService lojaService;

    @PostMapping("/cliente/cadastro")
    public void postCliente (@RequestBody Cliente obj){
       Optional<Cliente> clienteExistente = bd.findByEmail(obj.getEmail());
        
        if (clienteExistente.isPresent()) {
            System.out.println("Erro: E-mail já cadastrado.");
        }

        bd.save(obj);
        System.out.println("Cliente salvo com sucesso.");

        String assunto = "Confirmação de Cadastro - " + obj.getName();
        String corpo = "Olá " + ",\n\n" + "Confirmamos que seu cadastro foi realizado com sucesso em nossa loja. Agora você pode fazer login e aproveitar nossos produtos. " +
                       "Agradecemos a sua preferência!\n\n" +
                       "Atenciosamente,\n" +
                       "Equipe Loja de Quadros.";
        
        lojaService.sendEmail(obj.getEmail(), assunto, corpo);
    }

    @GetMapping("/cliente/{id}")
    public Cliente getCliente(@PathVariable("id") int id){
        if(bd.existsById(id)){
            return bd.findById(id).get();
        } else{
            return new Cliente();
        }
    }

    @PutMapping("/cliente")
    public void putCliente(@RequestBody Cliente obj){
        if(bd.existsById(obj.getId())){
            bd.save(obj);
            System.out.println("Cliente alterado.");
        }
    }

    @DeleteMapping("/cliente/{id}")
    public void deleteCliente(@PathVariable("id") int id){
        if(bd.existsById(id)){
            bd.deleteById(id);
            System.out.println("Cliente removido.");
        }
    }

    @GetMapping("/clientes")
    public List<Cliente> listClientes(){
        return bd.findAll();
    }

    @PostMapping("/cliente/login")
    public Cliente login(@RequestBody Cliente obj){
       Optional<Cliente> re =  bd.login(obj.getEmail(), obj.getPassword());
       if(re.isPresent()){
             System.out.println("Login efetuado com sucesso!");
            return re.get();
       } else {
            return new Cliente();
       }
    }

    @GetMapping("/cliente/inativos")
    public List<Cliente> listInativos(){
        return bd.listInativos();
    }


}
