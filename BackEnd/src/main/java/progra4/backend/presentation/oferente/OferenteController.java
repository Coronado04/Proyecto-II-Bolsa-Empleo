package progra4.backend.presentation.oferente;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import progra4.backend.data.OferenteRepository;
import progra4.backend.data.UsuarioRepository;
import progra4.backend.logic.Oferente;
import progra4.backend.logic.Usuario;

@RestController
@RequestMapping("/api/oferente")
public class OferenteController {

    private final OferenteRepository oferenteRepo;
    private final UsuarioRepository  usuarioRepo;
    private final PasswordEncoder    passwordEncoder;

    public OferenteController(OferenteRepository oferenteRepo,
                              UsuarioRepository usuarioRepo,
                              PasswordEncoder passwordEncoder) {
        this.oferenteRepo    = oferenteRepo;
        this.usuarioRepo     = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // ── POST /api/oferente/registro ──────────────────────────
    @PostMapping("/registro")
    public ResponseEntity<String> registrar(@RequestBody RegistroOferenteRequest req) {
        if (usuarioRepo.existsByCorreo(req.correo()))
            return ResponseEntity.badRequest().body("El correo ya está registrado.");

        if (oferenteRepo.existsByIdentificacion(req.identificacion()))
            return ResponseEntity.badRequest().body("La identificación ya está registrada.");

        if (req.telefono() != null && !req.telefono().isBlank()
                && oferenteRepo.existsByTelefono(req.telefono()))
            return ResponseEntity.badRequest().body("El teléfono ya está registrado.");

        Usuario usuario = new Usuario();
        usuario.setCorreo(req.correo());
        usuario.setClave(passwordEncoder.encode(req.clave()));
        usuario.setRol("OFE");
        usuarioRepo.save(usuario);

        Oferente oferente = new Oferente();
        oferente.setUsuario(usuario);
        oferente.setIdentificacion(req.identificacion());
        oferente.setNombre(req.nombre());
        oferente.setPrimerApellido(req.primerApellido());
        oferente.setNacionalidad(req.nacionalidad());
        oferente.setTelefono(req.telefono());
        oferente.setResidencia(req.residencia());
        oferenteRepo.save(oferente);

        return ResponseEntity.ok("Oferente registrado correctamente.");
    }

    // Aquí irán los futuros endpoints de oferente:
    // subir CV, ver habilidades, editar perfil, etc.

    record RegistroOferenteRequest(
        String correo,
        String clave,
        String identificacion,
        String nombre,
        String primerApellido,
        String nacionalidad,
        String telefono,
        String residencia
    ) {}
}
