package progra4.backend.presentation.publico;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import progra4.backend.data.PuestoRepository;
import progra4.backend.logic.Puesto;

import java.util.List;

@RestController
@RequestMapping("/api/publico")
@CrossOrigin(origins = "*")
public class publicoController {

    @Autowired
    PuestoRepository puestoRepository;

    @GetMapping
    public List<Puesto> listar() {
        return puestoRepository
                .findTop5ByTipoAndActivoTrueOrderByFechaRegistroDesc("PUBLICO");
    }
}