package progra4.backend.presentation.Oferente;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import progra4.backend.data.CaracteristicaRepository;
import progra4.backend.data.OferenteHabilidadRepository;
import progra4.backend.data.OferenteRepository;
import progra4.backend.data.UsuarioRepository;
import progra4.backend.logic.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/oferente")
public class OferenteController {

    private final OferenteRepository      oferenteRepo;
    private final OferenteHabilidadRepository habilidadRepo;
    private final CaracteristicaRepository caracteristicaRepo;
    private final UsuarioRepository        usuarioRepo;
    private static final String CV_DIR = "uploads/cv/";

    public OferenteController(OferenteRepository oferenteRepo, OferenteHabilidadRepository habilidadRepo,
      CaracteristicaRepository caracteristicaRepo, UsuarioRepository usuarioRepo) {
        this.oferenteRepo       = oferenteRepo;
        this.habilidadRepo      = habilidadRepo;
        this.caracteristicaRepo = caracteristicaRepo;
        this.usuarioRepo        = usuarioRepo;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(@AuthenticationPrincipal String correo) {
        return oferenteRepo.findByUsuario(usuarioRepo.findByCorreo(correo).orElseThrow())
                .map(o -> ResponseEntity.ok(Map.of(
                        "id",             o.getId(),
                        "nombre",         o.getNombre(),
                        "primerApellido", o.getPrimerApellido(),
                        "correo",         correo,
                        "tieneCv",        o.getCurriculum() != null
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/habilidades")
    public ResponseEntity<List<Map<String, Object>>> misHabilidades(
            @AuthenticationPrincipal String correo) {
        Oferente o = oferenteRepo.findByUsuario(
                usuarioRepo.findByCorreo(correo).orElseThrow()).orElseThrow();
        List<Map<String, Object>> lista = habilidadRepo.findByOferente(o).stream()
                .map(h -> Map.<String, Object>of(
                        "caracteristicaId",     h.getCaracteristica().getId(),
                        "caracteristicaNombre", h.getCaracteristica().getNombre(),
                        "nivel",                h.getNivel()
                ))
                .toList();
        return ResponseEntity.ok(lista);
    }

    @PostMapping("/habilidades")
    public ResponseEntity<?> agregarHabilidad(
            @AuthenticationPrincipal String correo,
            @RequestBody Map<String, Integer> body) {
        Oferente o = oferenteRepo.findByUsuario(
                usuarioRepo.findByCorreo(correo).orElseThrow()).orElseThrow();
        Caracteristica c = caracteristicaRepo.findById(body.get("caracteristicaId"))
                .orElse(null);
        if (c == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Característica no encontrada"));

        Integer nivel = body.get("nivel");
        if (nivel == null || nivel < 1 || nivel > 5)
            return ResponseEntity.badRequest().body(Map.of("error", "Nivel debe ser entre 1 y 5"));

        Optional<OferenteHabilidad> existente =
                habilidadRepo.findByOferenteAndCaracteristicaId(o, c.getId());

        OferenteHabilidad h = existente.orElse(new OferenteHabilidad());
        h.setOferente(o);
        h.setCaracteristica(c);
        h.setNivel(nivel);
        habilidadRepo.save(h);

        return ResponseEntity.ok(Map.of("mensaje", "Habilidad guardada"));
    }

    @DeleteMapping("/habilidades/{caracteristicaId}")
    public ResponseEntity<?> eliminarHabilidad(
            @AuthenticationPrincipal String correo,
            @PathVariable Integer caracteristicaId) {
        Oferente o = oferenteRepo.findByUsuario(
                usuarioRepo.findByCorreo(correo).orElseThrow()).orElseThrow();
        habilidadRepo.findByOferenteAndCaracteristicaId(o, caracteristicaId)
                .ifPresent(habilidadRepo::delete);
        return ResponseEntity.ok(Map.of("mensaje", "Habilidad eliminada"));
    }

    @PostMapping("/cv")
    public ResponseEntity<?> subirCV(
            @AuthenticationPrincipal String correo,
            @RequestParam MultipartFile archivo) {
        if (archivo.isEmpty() ||
                !archivo.getOriginalFilename().toLowerCase().endsWith(".pdf"))
            return ResponseEntity.badRequest().body(Map.of("error", "Solo se permiten archivos PDF"));

        Oferente o = oferenteRepo.findByUsuario(
                usuarioRepo.findByCorreo(correo).orElseThrow()).orElseThrow();
        try {
            Files.createDirectories(Paths.get(CV_DIR));
            String nombre = "cv_" + o.getId() + ".pdf";
            Files.write(Paths.get(CV_DIR + nombre), archivo.getBytes());
            o.setCurriculum(CV_DIR + nombre);
            oferenteRepo.save(o);
            return ResponseEntity.ok(Map.of("mensaje", "CV subido correctamente"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al subir: " + e.getMessage()));
        }
    }

    @GetMapping("/cv/ver")
    public ResponseEntity<byte[]> verCV(@AuthenticationPrincipal String correo) {
        Oferente o = oferenteRepo.findByUsuario(
                usuarioRepo.findByCorreo(correo).orElseThrow()).orElseThrow();
        if (o.getCurriculum() == null) return ResponseEntity.notFound().build();
        try {
            byte[] contenido = Files.readAllBytes(Path.of(o.getCurriculum()));
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"cv_" + o.getId() + ".pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(contenido);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/caracteristicas")
    public ResponseEntity<List<CaracteristicaArbolDTO>> caracteristicas() {
        return ResponseEntity.ok(
                caracteristicaRepo.findByPadreIsNull().stream()
                        .map(CaracteristicaArbolDTO::new).toList());
    }
}
