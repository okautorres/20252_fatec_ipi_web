package com.br.lojaquadros;

import java.util.List;

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

    @PostMapping("/cliente")
    public void postCliente (@RequestBody Cliente obj){
        bd.save(obj);
        System.out.println("Cliente salvo.");
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



}
