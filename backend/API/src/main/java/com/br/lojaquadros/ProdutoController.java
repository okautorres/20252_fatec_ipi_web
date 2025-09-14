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
public class ProdutoController {
    @Autowired
    ProdutoRepository bd;

    @PostMapping("/produto")
    public void postProduto (@RequestBody Produto obj){
        bd.save(obj);
        System.out.println("Produto salvo.");
    }

    @GetMapping("/produto/{id}")
    public Produto getProduto(@PathVariable("id") int id){
        if(bd.existsById(id)){
            return bd.findById(id).get();
        } else{
            return new Produto();
        }
    }

    @PutMapping("/produto")
    public void putProduto(@RequestBody Produto obj){
        if(bd.existsById(obj.getId())){
            bd.save(obj);
            System.out.println("Produto alterado.");
        }
    }

    @DeleteMapping("/produto/{id}")
    public void deleteProduto(@PathVariable("id") int id){
        if(bd.existsById(id)){
            bd.deleteById(id);
            System.out.println("Produto removido.");
        }
    }

    @GetMapping("/produtos")
    public List<Produto> listProdutos(){
        return bd.findAll();
    }

    @GetMapping("/produtos/vitrine")
    public List<Produto> listVitrine(){
        return bd.listVitrine();
    }

    @GetMapping("/produtos/termo/{termo}")
    public List<Produto> fazerBusca(@PathVariable String termo){
        return bd.fazerBusca(termo);
    }



}
