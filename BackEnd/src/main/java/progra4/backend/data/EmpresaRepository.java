package progra4.backend.data;

import org.springframework.data.jpa.repository.JpaRepository;
import progra4.backend.logic.Empresa;
import progra4.backend.logic.Usuario;


import java.util.Optional;

public interface EmpresaRepository extends JpaRepository<Empresa, Integer> {
    Optional<Empresa> findByUsuario(Usuario usuario);
    boolean existsByTelefono(String telefono);
}