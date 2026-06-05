package progra4.backend.presentation.Empresa;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import progra4.backend.data.*;
import progra4.backend.logic.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/empresa")
public class EmpresaController {

    private final UsuarioRepository usuarioRepo;
    private final EmpresaRepository empresaRepo;
    private final PuestoRepository puestoRepo;
    private final CaracteristicaRepository caracteristicaRepo;

    public EmpresaController(UsuarioRepository usuarioRepo,
       EmpresaRepository empresaRepo,
       PuestoRepository puestoRepo,
        CaracteristicaRepository caracteristicaRepo) {
        this.usuarioRepo = usuarioRepo;
        this.empresaRepo = empresaRepo;
        this.puestoRepo  = puestoRepo;
        this.caracteristicaRepo = caracteristicaRepo;
    }

    private Empresa getEmpresa(String correo) {
        Usuario u = usuarioRepo.findByCorreo(correo)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return empresaRepo.findByUsuario(u)
       .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
    }

    @GetMapping("/puestos")
    public ResponseEntity<?> misPuestos(@AuthenticationPrincipal String correo) {
        Empresa empresa = getEmpresa(correo);
        List<Puesto> lista = puestoRepo.findByEmpresa(empresa);
        List<PuestoEmpresaDTO> dto = lista.stream()
                .map(PuestoEmpresaDTO::new)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/puestos")
    public ResponseEntity<?> publicarPuesto(
    @AuthenticationPrincipal String correo,
  @RequestBody Map<String, Object> body) {

        Empresa empresa = getEmpresa(correo);

        String descripcion = (String) body.get("descripcion");
        Double salario     = body.get("salario") != null
                ? Double.parseDouble(body.get("salario").toString()) : null;
        String tipo        = body.getOrDefault("tipo", "PUBLICO").toString();

        Puesto puesto = new Puesto();
        puesto.setEmpresa(empresa);
        puesto.setDescripcion(descripcion);
        puesto.setSalario(salario);
        puesto.setTipo(tipo);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> caracteristicas =
                (List<Map<String, Object>>) body.getOrDefault("caracteristicas", new ArrayList<>());

        List<PuestoCaracteristica> reqs = new ArrayList<>();
        for (Map<String, Object> item : caracteristicas) {
            if (item.get("caracteristicaId") == null) continue;
            Integer cId     = Integer.parseInt(item.get("caracteristicaId").toString());
            Integer nivel   = item.get("nivelDeseado") != null
                    ? Integer.parseInt(item.get("nivelDeseado").toString()) : 1;

            Caracteristica c = caracteristicaRepo.findById(cId)
                    .orElseThrow(() -> new RuntimeException("Caracteristica no existe: " + cId));

            PuestoCaracteristica pc = new PuestoCaracteristica();
            pc.setPuesto(puesto);
            pc.setCaracteristica(c);
            pc.setNivelDeseado(nivel);
            reqs.add(pc);
        }
        puesto.setCaracteristicas(reqs);
        puestoRepo.save(puesto);

        return ResponseEntity.ok(Map.of("mensaje", "Puesto publicado correctamente", "id", puesto.getId()));
    }
    @PutMapping("/puestos/{id}/desactivar")
    public ResponseEntity<?> desactivarPuesto(
            @AuthenticationPrincipal String correo,
            @PathVariable Integer id) {

        Empresa empresa = getEmpresa(correo);
        Puesto puesto = puestoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Puesto no encontrado"));

        if (!puesto.getEmpresa().getId().equals(empresa.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "No autorizado"));
        }

        puesto.setActivo(false);
        puestoRepo.save(puesto);
        return ResponseEntity.ok(Map.of("mensaje", "Puesto desactivado"));
    }

    @GetMapping("/caracteristicas")
    public ResponseEntity<?> caracteristicas() {
        List<Caracteristica> raices = caracteristicaRepo.findByPadreIsNull();
        return ResponseEntity.ok(raices);
    }
}