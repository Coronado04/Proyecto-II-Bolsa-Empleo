package progra4.backend.presentation.publico;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import progra4.backend.data.EmpresaRepository;
import progra4.backend.data.OferenteRepository;
import progra4.backend.data.UsuarioRepository;
import progra4.backend.logic.Empresa;
import progra4.backend.logic.Oferente;
import progra4.backend.logic.Usuario;

import java.util.Map;

@RestController
@RequestMapping("/api/publico/registro")
public class RegistroController {

    private final UsuarioRepository  usuarioRepo;
    private final EmpresaRepository  empresaRepo;
    private final OferenteRepository oferenteRepo;
    private final PasswordEncoder    passwordEncoder;

    public RegistroController(UsuarioRepository usuarioRepo,
                              EmpresaRepository empresaRepo,
                              OferenteRepository oferenteRepo,
                              PasswordEncoder passwordEncoder) {
        this.usuarioRepo     = usuarioRepo;
        this.empresaRepo     = empresaRepo;
        this.oferenteRepo    = oferenteRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // ── POST /api/publico/registro/empresa ───────────────────
    @PostMapping("/empresa")
    public ResponseEntity<?> registrarEmpresa(@RequestBody Map<String, String> body) {
        String correo       = body.get("correo");
        String clave        = body.get("clave");
        String nombre       = body.get("nombre");
        String localizacion = body.get("localizacion");
        String telefono     = body.get("telefono");
        String descripcion  = body.get("descripcion");

        // Campos obligatorios
        if (correo == null || correo.isBlank() || clave == null || clave.isBlank()
                || nombre == null || nombre.isBlank())
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Correo, clave y nombre son obligatorios."));

        // Correo duplicado
        if (usuarioRepo.findByCorreo(correo).isPresent())
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El correo ya está registrado."));

        // Teléfono duplicado (solo si viene)
        if (telefono != null && !telefono.isBlank() && empresaRepo.existsByTelefono(telefono))
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El teléfono ya está registrado."));

        Usuario u = new Usuario();
        u.setCorreo(correo);
        u.setClave(passwordEncoder.encode(clave));
        u.setRol("EMP");
        u.setActivo(false);
        usuarioRepo.save(u);

        Empresa e = new Empresa();
        e.setUsuario(u);
        e.setNombre(nombre);
        e.setLocalizacion(localizacion);
        e.setTelefono(telefono);
        e.setDescripcion(descripcion);
        empresaRepo.save(e);

        return ResponseEntity.ok(
                Map.of("mensaje", "Empresa registrada. Espere la aprobación del administrador."));
    }
    @PostMapping("/oferente")
    public ResponseEntity<?> registrarOferente(@RequestBody Map<String, String> body) {
        String correo         = body.get("correo");
        String clave          = body.get("clave");
        String identificacion = body.get("identificacion");
        String nombre         = body.get("nombre");
        String primerApellido = body.get("primerApellido");
        String nacionalidad   = body.get("nacionalidad");
        String telefono       = body.get("telefono");
        String residencia     = body.get("residencia");

        if (correo == null || correo.isBlank() || clave == null || clave.isBlank()
                || identificacion == null || identificacion.isBlank()
                || nombre == null || nombre.isBlank()
                || primerApellido == null || primerApellido.isBlank())
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Correo, clave, identificación, nombre y apellido son obligatorios."));

        if (usuarioRepo.findByCorreo(correo).isPresent())
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El correo ya está registrado."));

        if (oferenteRepo.existsByIdentificacion(identificacion))
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "La identificación ya está registrada."));

        if (telefono != null && !telefono.isBlank() && oferenteRepo.existsByTelefono(telefono))
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El teléfono ya está registrado."));

        Usuario u = new Usuario();
        u.setCorreo(correo);
        u.setClave(passwordEncoder.encode(clave));
        u.setRol("OFE");
        u.setActivo(false);
        usuarioRepo.save(u);

        Oferente o = new Oferente();
        o.setUsuario(u);
        o.setIdentificacion(identificacion);
        o.setNombre(nombre);
        o.setPrimerApellido(primerApellido);
        o.setNacionalidad(nacionalidad);
        o.setTelefono(telefono);
        o.setResidencia(residencia);
        oferenteRepo.save(o);

        return ResponseEntity.ok(
                Map.of("mensaje", "Oferente registrado. Espere la aprobación del administrador."));
    }
}