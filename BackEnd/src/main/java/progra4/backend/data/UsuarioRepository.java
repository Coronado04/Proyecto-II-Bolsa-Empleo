package progra4.backend.data;

import org.springframework.data.jpa.repository.JpaRepository;
import progra4.backend.logic.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByCorreo(String correo);
    java.util.List<Usuario> findByRolAndActivoFalse(String rol);
}
