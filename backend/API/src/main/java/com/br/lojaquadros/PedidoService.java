package com.br.lojaquadros;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProdutoRepository produtoRepository; 
    
    @Autowired 
    LojaService lojaService;

    @Transactional
    public Pedido gravarPedido(Pedido pedido, int clienteId) {
        Optional<Cliente> clienteOpt = clienteRepository.findById(clienteId);
        if (clienteOpt.isPresent()) {
            pedido.setCliente(clienteOpt.get());
            pedido.setDataPedido(LocalDateTime.now());
            
            if (pedido.getItens() != null) {
                pedido.getItens().forEach(item -> {
                    Produto produto = produtoRepository.findById(item.getProduto().getId())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado."));
                    item.setProduto(produto);
                    
                    item.setPedido(pedido);
                });
            }
            
            Pedido pedidoSalvo = pedidoRepository.save(pedido);
            enviarEmailConfirmacao(pedidoSalvo);
            return pedidoSalvo;
        }
        return null;
    }

    @Transactional
    public Pedido alterarPedido(int id, Pedido pedidoAlterado) {
        Pedido pedidoExistente = pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido não encontrado com o ID: " + id));

        pedidoExistente.getItens().clear();

        for (ItemPedido item : pedidoAlterado.getItens()) {
            Produto produto = produtoRepository.findById(item.getProduto().getId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));
            
            item.setProduto(produto);
            item.setPedido(pedidoExistente);
            
            pedidoExistente.getItens().add(item);
        }

        return pedidoRepository.save(pedidoExistente);
    }

    public void removerPedido(int id) {
        pedidoRepository.deleteById(id);
    }

    public Optional<Pedido> getPedidoPorCodigo(int id) {
        return pedidoRepository.findById(id);
    }

    public List<Pedido> listarPedidosPorCliente(int clienteId) {
        return pedidoRepository.findByClienteId(clienteId);
    }

    public List<Pedido> listarTodosPedidos() {
        return pedidoRepository.findAll();
    }
    
    private void enviarEmailConfirmacao(Pedido pedido) {
        Cliente cliente = pedido.getCliente();
        String assunto = "Confirmação do Pedido #" + pedido.getId();
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String dataFormatada = pedido.getDataPedido().format(formatter);
        
        String itensPedido = pedido.getItens().stream()
            .map(item -> {
                String nomeProduto = item.getProduto().getName();
                double precoFinal = item.getProduto().getPromo() > 0 ? item.getProduto().getPromo() : item.getProduto().getValue();
                return "- " + item.getQuantidade() + "x " + nomeProduto + " (R$ " + String.format("%.2f", precoFinal) + ")";
            })
            .collect(Collectors.joining("\n"));

        String corpo = "Olá " + cliente.getName() + ",\n\n"
                    + "Seu pedido foi recebido com sucesso! Aqui estão os detalhes:\n\n"
                    + "Número do Pedido: #" + pedido.getId() + "\n"
                    + "Data do Pedido: " + dataFormatada + "\n\n"
                    + "Itens:\n"
                    + itensPedido + "\n\n"
                    + "Em breve você receberá mais informações sobre o envio. Obrigado por comprar conosco!\n\n"
                    + "Atenciosamente,\n"
                    + "Equipe Loja de Quadros.";

        lojaService.sendEmail(pedido.getCliente().getEmail(), assunto, corpo);
    }
}