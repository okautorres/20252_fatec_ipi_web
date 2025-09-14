package com.br.lojaquadros;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer>{

    @Query(value = "select * from cliente where email=?1 and password=?2", nativeQuery= true)
    public Optional<Cliente> login(String email, String password);

    @Query(value = "select * from cliente where active=0",nativeQuery=true)
     public List<Cliente> listInativos();

     Optional<Cliente> findByEmail(String email);

    public Optional<Cliente> findByTokenEmail(String tokenEmail);

}
