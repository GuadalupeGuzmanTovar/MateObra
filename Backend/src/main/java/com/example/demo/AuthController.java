package com.example.demo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class AuthController {

    private final UsuarioRepository repo;

    public AuthController(UsuarioRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/registro")
    public ResponseEntity<String> registro(@RequestBody Usuario u) {
        if (repo.findByUsuario(u.getUsuario()).isPresent()) {
            return ResponseEntity.badRequest().body("El usuario ya existe");
        }
        if (!"CLIENTE".equals(u.getRol()) && !"CONSTRUCTOR".equals(u.getRol())) {
            u.setRol("CLIENTE");
        }
        repo.save(u);
        return ResponseEntity.ok("Usuario creado");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario u) {
        return repo.findByUsuario(u.getUsuario())
                .filter(x -> x.getPassword().equals(u.getPassword()))
                .<ResponseEntity<?>>map(x -> ResponseEntity.ok(Map.of(
                        "usuario", x.getUsuario(),
                        "rol", x.getRol() == null ? "CLIENTE" : x.getRol())))
                .orElse(ResponseEntity.status(401).body("Usuario o contraseña incorrectos"));
    }

    @GetMapping("/existe/{usuario}")
    public ResponseEntity<Void> existe(@PathVariable String usuario) {
        return repo.findByUsuario(usuario).isPresent()
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }

    @PutMapping("/cambiar-password")
    public ResponseEntity<String> cambiarPassword(@RequestBody Usuario u) {
        return repo.findByUsuario(u.getUsuario())
                .map(x -> {
                    x.setPassword(u.getPassword());
                    repo.save(x);
                    return ResponseEntity.ok("Contraseña actualizada");
                })
                .orElse(ResponseEntity.status(404).body("Usuario no encontrado"));
    }
}