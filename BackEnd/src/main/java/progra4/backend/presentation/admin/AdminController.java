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

    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Integer>> resumen() {
        int empresas  = usuarioRepo.findByRolAndActivoFalse("EMP").size();
        int oferentes = usuarioRepo.findByRolAndActivoFalse("OFE").size();
        return ResponseEntity.ok(Map.of(
                "empresasPendientes",  empresas,
                "oferentesPendientes", oferentes
        ));
    }

    @GetMapping("/empresas/pendientes")
    public ResponseEntity<List<UsuarioPendienteDTO>> empresasPendientes() {
        List<UsuarioPendienteDTO> lista = usuarioRepo
                .findByRolAndActivoFalse("EMP")
                .stream()
                .map(UsuarioPendienteDTO::new)
                .toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/oferentes/pendientes")
    public ResponseEntity<List<UsuarioPendienteDTO>> oferentesPendientes() {
        List<UsuarioPendienteDTO> lista = usuarioRepo
                .findByRolAndActivoFalse("OFE")
                .stream()
                .map(UsuarioPendienteDTO::new)
                .toList();
        return ResponseEntity.ok(lista);
    }

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

    record UsuarioPendienteDTO(Integer id, String correo) {
        UsuarioPendienteDTO(Usuario u) {
            this(u.getId(), u.getCorreo());
        }
    }

    @GetMapping("/caracteristicas")
    public ResponseEntity<?> caracteristicas(
            @RequestParam(required = false) Integer padreId) {

        if (padreId == null) {
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