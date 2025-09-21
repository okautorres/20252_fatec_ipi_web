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
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping("/pedido/{clienteId}")
    public Pedido gravarPedido(@RequestBody Pedido pedido, @PathVariable int clienteId) {
        return pedidoService.gravarPedido(pedido, clienteId);
    }
    

    @PutMapping("/pedido/{id}")
    public Pedido alterarPedido(@PathVariable int id, @RequestBody Pedido pedido) {
        return pedidoService.alterarPedido(id, pedido);
    }
    

    @DeleteMapping("/pedido/{id}")
    public void removerPedido(@PathVariable int id) {
        pedidoService.removerPedido(id);
    }
    

    @GetMapping("/pedido/{id}")
    public Optional<Pedido> getPedidoPorCodigo(@PathVariable int id) {
        return pedidoService.getPedidoPorCodigo(id);
    }
    

    @GetMapping("/pedido/cliente/{clienteId}")
    public List<Pedido> listarPedidosPorCliente(@PathVariable int clienteId) {
        return pedidoService.listarPedidosPorCliente(clienteId);
    }
    

    @GetMapping("/pedidos")
    public List<Pedido> listarTodosPedidos() {
        return pedidoService.listarTodosPedidos();
    }
}