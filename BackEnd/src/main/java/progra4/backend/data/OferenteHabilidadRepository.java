package progra4.backend.data;

import org.springframework.data.jpa.repository.JpaRepository;
import progra4.backend.logic.Oferente;
import progra4.backend.logic.OferenteHabilidad;
import progra4.backend.logic.OferenteHabilidadId;

import java.util.List;
import java.util.Optional;

public interface OferenteHabilidadRepository
        extends JpaRepository<OferenteHabilidad, OferenteHabilidadId> {
    List<OferenteHabilidad> findByOferente(Oferente oferente);
    Optional<OferenteHabilidad> findByOferenteAndCaracteristicaId(
            Oferente oferente, Integer caracteristicaId);
}

