package progra4.backend.presentation.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import progra4.backend.data.CaracteristicaRepository;
import progra4.backend.data.UsuarioRepository;
import progra4.backend.logic.Caracteristica;
import progra4.backend.logic.Usuario;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UsuarioRepository usuarioRepo;
    private final CaracteristicaRepository caracteristicaRepo;

    public AdminController(UsuarioRepository usuarioRepo, CaracteristicaRepository caracteristicaRepo) {
        this.usuarioRepo = usuarioRepo;
        this.caracteristicaRepo = caracteristicaRepo;
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

    // GET /api/admin/caracteristicas?padreId=5  (padreId opcional)
    @GetMapping("/caracteristicas")
    public ResponseEntity<?> caracteristicas(
            @RequestParam(required = false) Integer padreId) {

        if (padreId == null) {
            // Devuelve raíces
            List<Caracteristica> raices = caracteristicaRepo.findByPadreIsNull();
            return ResponseEntity.ok(raices.stream().map(c -> Map.of(
                    "id", c.getId(), "nombre", c.getNombre(),
                    "tieneHijos", c.getHijos() != null && !c.getHijos().isEmpty()
            )).toList());
        } else {
            Caracteristica actual = caracteristicaRepo.findById(padreId).orElse(null);
            if (actual == null) return ResponseEntity.notFound().build();

            List<Caracteristica> hijos = actual.getHijos() == null ? List.of() : actual.getHijos();
            return ResponseEntity.ok(Map.of(
                    "actual", Map.of("id", actual.getId(), "nombre", actual.getNombre()),
                    "hijos", hijos.stream().map(h -> Map.of(
                            "id", h.getId(), "nombre", h.getNombre(),
                            "tieneHijos", h.getHijos() != null && !h.getHijos().isEmpty()
                    )).toList()
            ));
        }
    }

    // POST /api/admin/caracteristicas
    @PostMapping("/caracteristicas")
    public ResponseEntity<?> crearCaracteristica(@RequestBody Map<String, Object> body) {
        String nombre = (String) body.get("nombre");
        Integer padreId = body.get("padreId") != null
                ? Integer.valueOf(body.get("padreId").toString()) : null;

        if (nombre == null || nombre.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "El nombre es obligatorio"));

        Caracteristica c = new Caracteristica();
        c.setNombre(nombre.trim());
        if (padreId != null)
            c.setPadre(caracteristicaRepo.findById(padreId).orElse(null));

        caracteristicaRepo.save(c);
        return ResponseEntity.ok(Map.of("mensaje", "Característica creada", "id", c.getId()));
    }
}