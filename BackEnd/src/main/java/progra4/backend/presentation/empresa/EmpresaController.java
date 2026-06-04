package progra4.backend.presentation.empresa;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import progra4.backend.data.EmpresaRepository;
import progra4.backend.data.UsuarioRepository;
import progra4.backend.logic.Empresa;
import progra4.backend.logic.Usuario;

@RestController
@RequestMapping("/api/empresa")
public class EmpresaController {

    private final EmpresaRepository  empresaRepo;
    private final UsuarioRepository  usuarioRepo;
    private final PasswordEncoder    passwordEncoder;

    public EmpresaController(EmpresaRepository empresaRepo,
                             UsuarioRepository usuarioRepo,
                             PasswordEncoder passwordEncoder) {
        this.empresaRepo     = empresaRepo;
        this.usuarioRepo     = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // ── POST /api/empresa/registro ───────────────────────────
    @PostMapping("/registro")
    public ResponseEntity<String> registrar(@RequestBody RegistroEmpresaRequest req) {
        if (usuarioRepo.existsByCorreo(req.correo()))
            return ResponseEntity.badRequest().body("El correo ya está registrado.");

        if (req.telefono() != null && !req.telefono().isBlank()
                && empresaRepo.existsByTelefono(req.telefono()))
            return ResponseEntity.badRequest().body("El teléfono ya está registrado.");

        Usuario usuario = new Usuario();
        usuario.setCorreo(req.correo());
        usuario.setClave(passwordEncoder.encode(req.clave()));
        usuario.setRol("EMP");
        usuarioRepo.save(usuario);

        Empresa empresa = new Empresa();
        empresa.setUsuario(usuario);
        empresa.setNombre(req.nombre());
        empresa.setLocalizacion(req.localizacion());
        empresa.setTelefono(req.telefono());
        empresa.setDescripcion(req.descripcion());
        empresaRepo.save(empresa);

        return ResponseEntity.ok("Empresa registrada correctamente.");
    }

    // Aquí irán los futuros endpoints de empresa:
    // buscar candidatos, ver perfil, editar datos, etc.

    record RegistroEmpresaRequest(
        String correo,
        String clave,
        String nombre,
        String localizacion,
        String telefono,
        String descripcion
    ) {}
}
