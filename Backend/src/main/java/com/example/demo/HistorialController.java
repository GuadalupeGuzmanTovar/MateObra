package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/historial")
@CrossOrigin
public class HistorialController {

    private final CalculoRepository repo;

    public HistorialController(CalculoRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Calculo guardar(@RequestBody Calculo c) {
        c.setId(null);
        c.setFecha(java.time.LocalDateTime.now());
        return repo.save(c);
    }

    @GetMapping("/{usuario}")
    public List<Calculo> listar(@PathVariable String usuario) {
        return repo.findByUsuarioOrderByFechaDesc(usuario);
    }
}
