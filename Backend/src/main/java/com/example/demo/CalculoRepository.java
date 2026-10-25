package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CalculoRepository extends JpaRepository<Calculo, Long> {
    List<Calculo> findByUsuarioOrderByFechaDesc(String usuario);
}