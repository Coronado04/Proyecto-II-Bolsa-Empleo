package progra4.backend.presentation.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import progra4.backend.data.UsuarioRepository;
import progra4.backend.logic.Usuario;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UsuarioRepository usuarioRepo;

    public AdminController(UsuarioRepository usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }

    // GET /api/admin/resumen
    // Devuelve cantidad de empresas y oferentes pendientes de aprobación
    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Integer>> resumen() {
        int empresas  = usuarioRepo.findByRolAndActivoFalse("EMP").size();
        int oferentes = usuarioRepo.findByRolAndActivoFalse("OFE").size();
        return ResponseEntity.ok(Map.of(
                "empresasPendientes",  empresas,
                "oferentesPendientes", oferentes
        ));
    }

    // GET /api/admin/empresas/pendientes
    // Lista de usuarios empresa inactivos (pendientes de aprobación)
    @GetMapping("/empresas/pendientes")
    public ResponseEntity<List<UsuarioPendienteDTO>> empresasPendientes() {
        List<UsuarioPendienteDTO> lista = usuarioRepo
                .findByRolAndActivoFalse("EMP")
                .stream()
                .map(UsuarioPendienteDTO::new)
                .toList();
        return ResponseEntity.ok(lista);
    }

    // GET /api/admin/oferentes/pendientes
    // Lista de usuarios oferente inactivos (pendientes de aprobación)
    @GetMapping("/oferentes/pendientes")
    public ResponseEntity<List<UsuarioPendienteDTO>> oferentesPendientes() {
        List<UsuarioPendienteDTO> lista = usuarioRepo
                .findByRolAndActivoFalse("OFE")
                .stream()
                .map(UsuarioPendienteDTO::new)
                .toList();
        return ResponseEntity.ok(lista);
    }

    // POST /api/admin/usuarios/{id}/aprobar
    // Activa el usuario (aprobación del admin)
    @PostMapping("/usuarios/{id}/aprobar")
    public ResponseEntity<Map<String, String>> aprobar(@PathVariable Integer id) {
        return usuarioRepo.findById(id)
                .map(u -> {
                    u.setActivo(true);
                    usuarioRepo.save(u);
                    return ResponseEntity.ok(Map.of("mensaje", "Usuario aprobado correctamente."));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DTO de salida — solo expone id y correo al frontend
    record UsuarioPendienteDTO(Integer id, String correo) {
        UsuarioPendienteDTO(Usuario u) {
            this(u.getId(), u.getCorreo());
        }
    }
}