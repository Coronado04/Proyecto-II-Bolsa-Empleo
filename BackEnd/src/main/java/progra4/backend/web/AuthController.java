package progra4.backend.web;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import progra4.backend.data.UsuarioRepository;
import progra4.backend.logic.Usuario;
import progra4.backend.security.JwtUtil;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UsuarioRepository usuarioRepo,
                          PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.usuarioRepo = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String correo = body.get("correo");
        String clave  = body.get("clave");
        Optional<Usuario> opt = usuarioRepo.findByCorreo(correo);
        if (opt.isEmpty())
            return ResponseEntity.status(401).body(Map.of("error","Usuario no encontrado"));
        Usuario u = opt.get();
        if (!u.isActivo())
            return ResponseEntity.status(403).body(Map.of("error","Usuario no autorizado por el administrador"));
        if (!passwordEncoder.matches(clave, u.getClave()))
            return ResponseEntity.status(401).body(Map.of("error","Clave incorrecta"));
        String token = jwtUtil.generateToken(u.getCorreo(), u.getRol());
        return ResponseEntity.ok(Map.of("token",token,"rol",u.getRol(),"correo",u.getCorreo()));
    }
}
