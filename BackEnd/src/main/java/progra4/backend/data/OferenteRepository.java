package progra4.backend.data;

import org.springframework.data.jpa.repository.JpaRepository;
import progra4.backend.logic.Oferente;
import progra4.backend.logic.Usuario;

import java.util.Optional;

public interface OferenteRepository extends JpaRepository<Oferente, Integer> {
    Optional<Oferente> findByUsuario(Usuario usuario);
    boolean existsByIdentificacion(String identificacion);
    boolean existsByTelefono(String telefono);
}