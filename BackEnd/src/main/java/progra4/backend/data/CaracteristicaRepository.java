package progra4.backend.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import progra4.backend.logic.Caracteristica;

import java.util.List;

public interface CaracteristicaRepository extends JpaRepository<Caracteristica, Integer> {
    @Query("SELECT DISTINCT c FROM Caracteristica c WHERE c.padre IS NULL")
    List<Caracteristica> findByPadreIsNull();
}
