package progra4.backend.presentation.publico;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import progra4.backend.data.CaracteristicaRepository;
import progra4.backend.data.PuestoRepository;
import progra4.backend.logic.CaracteristicaArbolDTO;
import progra4.backend.logic.PuestoPublicoDTO;
import java.util.List;

@RestController
@RequestMapping("/api/publico")
public class PublicoController {
    private final PuestoRepository puestoRepo;
    private final CaracteristicaRepository caracteristicaRepo;

    public PublicoController(PuestoRepository puestoRepo, CaracteristicaRepository caracteristicaRepo) {
        this.puestoRepo = puestoRepo;
        this.caracteristicaRepo = caracteristicaRepo;
    }

    @GetMapping("/puestos/recientes")
    public ResponseEntity<List<PuestoPublicoDTO>> recientes() {
        return ResponseEntity.ok(puestoRepo
            .findTop5ByTipoAndActivoTrueOrderByFechaRegistroDesc("PUBLICO")
            .stream().map(PuestoPublicoDTO::new).toList());
    }

    @GetMapping("/puestos/buscar")
    public ResponseEntity<List<PuestoPublicoDTO>> buscar(@RequestParam(required=false) List<Integer> ids) {
        List<PuestoPublicoDTO> lista;
        if (ids == null || ids.isEmpty())
            lista = puestoRepo.findTop5ByTipoAndActivoTrueOrderByFechaRegistroDesc("PUBLICO")
                    .stream().map(PuestoPublicoDTO::new).toList();
        else
            lista = puestoRepo.findPublicosByCaracteristicas(ids)
                    .stream().map(PuestoPublicoDTO::new).toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/caracteristicas")
    public ResponseEntity<List<CaracteristicaArbolDTO>> caracteristicas() {
        return ResponseEntity.ok(caracteristicaRepo.findByPadreIsNull()
            .stream().map(CaracteristicaArbolDTO::new).toList());
    }
}
