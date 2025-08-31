package com.br.lojaquadros;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer>{

    @Query(value = "select * from produto where contrast > 0 order by contrast asc", nativeQuery=true)
    List<Produto> listVitrine();

    @Query(value = "select * from produto where name LIKE %:termo%", nativeQuery=true)
     List<Produto> fazerBusca(@Param("termo") String termo);  

}
