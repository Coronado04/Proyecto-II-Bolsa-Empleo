package progra4.backend.presentation.autenticacion;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import progra4.backend.data.UsuarioRepository;
import progra4.backend.logic.Usuario;

import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder passwordEncoder;
    private static final String SECRET_KEY = "tu_clave_secreta_muy_segura_aqui_puedes_cambiarla";
    private static final long EXPIRATION_TIME = 86400000; // 24 horas en milisegundos

    public AuthController(UsuarioRepository usuarioRepo, PasswordEncoder passwordEncoder) {
        this.usuarioRepo = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // ── POST /api/auth/login ──────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        // Buscar usuario por correo
        Optional<Usuario> usuarioOpt = usuarioRepo.findByCorreo(req.correo());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Correo no encontrado.");
        }

        Usuario usuario = usuarioOpt.get();

        // Validar contraseña
        if (!passwordEncoder.matches(req.clave(), usuario.getClave())) {
            return ResponseEntity.badRequest().body("Contraseña incorrecta.");
        }

        // Validar si usuario está activo
        if (!usuario.isActivo()) {
            return ResponseEntity.badRequest().body("Usuario inactivo. Contacte al administrador.");
        }

        // Generar JWT token
        String token = generarToken(usuario);

        return ResponseEntity.ok(token);
    }

    // Método para generar JWT
    private String generarToken(Usuario usuario) {
        Algorithm algorithm = Algorithm.HMAC512(SECRET_KEY);

        return JWT.create()
                .withSubject(usuario.getCorreo())
                .withClaim("id", usuario.getId())
                .withClaim("correo", usuario.getCorreo())
                .withClaim("rol", usuario.getRol())
                .withClaim("name", usuario.getCorreo()) // Para compatibilidad con frontend
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(algorithm);
    }

    // Record para el request
    public record LoginRequest(String correo, String clave) {}
}