package progra4.backend.data;

import org.springframework.data.jpa.repository.JpaRepository;
import progra4.backend.logic.Caracteristica;
import java.util.List;

public interface CaracteristicaRepository extends JpaRepository<Caracteristica, Integer> {
    List<Caracteristica> findByPadreIsNull();
    List<Caracteristica> findByPadreId(Integer padreId);
}
