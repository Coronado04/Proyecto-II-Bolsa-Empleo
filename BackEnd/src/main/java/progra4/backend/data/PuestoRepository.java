package progra4.backend.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import progra4.backend.logic.Empresa;
import progra4.backend.logic.Puesto;

import java.util.List;

public interface PuestoRepository extends JpaRepository<Puesto, Integer> {

    List<Puesto> findByEmpresa(Empresa empresa);

    List<Puesto> findTop5ByTipoAndActivoTrueOrderByFechaRegistroDesc(String tipo);

    @Query("SELECT DISTINCT p FROM Puesto p JOIN p.caracteristicas pc " +
           "WHERE p.tipo = 'PUBLICO' AND p.activo = true " +
           "AND pc.caracteristica.id IN :ids")
    List<Puesto> findPublicosByCaracteristicas(List<Integer> ids);

    @Query("SELECT p FROM Puesto p WHERE YEAR(p.fechaRegistro) = :anio AND MONTH(p.fechaRegistro) = :mes ORDER BY p.fechaRegistro ASC")
    List<Puesto> findByAnioAndMes(int anio, int mes);

    List<Puesto> findAllByOrderByFechaRegistroDesc();
}
