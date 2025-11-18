package com.br.lojaquadros;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    private ProdutoRepository bd;

    /**
     * Recebe um Produto em JSON. Se vier campo imageBase64 (dataURL),
     * decodifica e grava o arquivo em uploads/images/ e grava imageUrl no produto.
     */
    @PostMapping("/produto")
    public ResponseEntity<?> postProduto(@RequestBody Produto obj) {
        try {
            String b64 = obj.getImageBase64(); 

            if (b64 != null && !b64.isBlank()) {
                
                String[] parts = b64.split(",");
                String meta = parts[0];
                String dataPart = parts.length > 1 ? parts[1] : parts[0];

                String ext = "png";
                if (meta.contains("image/jpeg") || meta.contains("image/jpg")) ext = "jpg";
                else if (meta.contains("image/png")) ext = "png";
                else if (meta.contains("image/gif")) ext = "gif";

                byte[] decoded = Base64.getDecoder().decode(dataPart);
                String filename = UUID.randomUUID().toString() + "." + ext;

                // em ProdutoController, ajuste imagesDir:
                // exemplo: salva em /var/www/lojaquadros/uploads/images ou ./uploads/images
Path imagesDir = Paths.get("uploads/images"); // relativo ao diretório do backend
Files.createDirectories(imagesDir);
Path filePath = imagesDir.resolve(filename);
Files.write(filePath, decoded);

// set um caminho público relativo que o backend exponha:
obj.setImageUrl("/uploads/images/" + filename);


            }

            bd.save(obj);
            System.out.println("Produto salvo.");
            return ResponseEntity.ok("Produto salvo com sucesso.");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao salvar a imagem.");
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao salvar produto.");
        }
    }

    @GetMapping("/produto/{id}")
    public Produto getProduto(@PathVariable("id") int id) {
        if (bd.existsById(id)) {
            return bd.findById(id).get();
        } else {
            return new Produto();
        }
    }

    @PutMapping("/produto")
    public ResponseEntity<?> putProduto(@RequestBody Produto obj) {
        if (bd.existsById(obj.getId())) {
            bd.save(obj);
            System.out.println("Produto alterado.");
            return ResponseEntity.ok("Produto alterado.");
        } else {
            return ResponseEntity.status(404).body("Produto não encontrado.");
        }
    }

    @DeleteMapping("/produto/{id}")
    public ResponseEntity<?> deleteProduto(@PathVariable("id") int id) {
        if (bd.existsById(id)) {
            bd.deleteById(id);
            System.out.println("Produto removido.");
            return ResponseEntity.ok("Produto removido.");
        } else {
            return ResponseEntity.status(404).body("Produto não encontrado.");
        }
    }

    @GetMapping("/produtos")
    public List<Produto> listProdutos() {
        return bd.findAll();
    }

    @GetMapping("/produtos/vitrine")
    public List<Produto> listVitrine() {
        return bd.listVitrine();
    }

    @GetMapping("/produtos/termo/{termo}")
    public List<Produto> fazerBusca(@PathVariable String termo) {
        return bd.fazerBusca(termo);
    }
}
