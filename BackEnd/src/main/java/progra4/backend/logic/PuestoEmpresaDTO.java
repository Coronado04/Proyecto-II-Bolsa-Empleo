package progra4.backend.logic;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class PuestoEmpresaDTO {

    private Integer id;
    private String descripcion;
    private Double salario;
    private String tipo;
    private boolean activo;
    private LocalDateTime fechaRegistro;
    private List<CaracteristicaReqDTO> caracteristicas;

    public PuestoEmpresaDTO(Puesto p) {
        this.id            = p.getId();
        this.descripcion   = p.getDescripcion();
        this.salario       = p.getSalario();
        this.tipo          = p.getTipo();
        this.activo        = p.isActivo();
        this.fechaRegistro = p.getFechaRegistro();
        this.caracteristicas = p.getCaracteristicas() == null ? List.of() :
                p.getCaracteristicas().stream()
                        .map(pc -> new CaracteristicaReqDTO(
                                pc.getCaracteristica().getId(),
                                pc.getCaracteristica().getNombre(),
                                pc.getNivelDeseado()))
                        .collect(Collectors.toList());
    }

    // Getters
    public Integer getId()                             { return id; }
    public String getDescripcion()                     { return descripcion; }
    public Double getSalario()                         { return salario; }
    public String getTipo()                            { return tipo; }
    public boolean isActivo()                          { return activo; }
    public LocalDateTime getFechaRegistro()            { return fechaRegistro; }
    public List<CaracteristicaReqDTO> getCaracteristicas() { return caracteristicas; }

    // ── Inner DTO ──────────────────────────────────────────────
    public static class CaracteristicaReqDTO {
        private Integer id;
        private String nombre;
        private Integer nivelDeseado;

        public CaracteristicaReqDTO(Integer id, String nombre, Integer nivelDeseado) {
            this.id           = id;
            this.nombre       = nombre;
            this.nivelDeseado = nivelDeseado;
        }

        public Integer getId()          { return id; }
        public String getNombre()       { return nombre; }
        public Integer getNivelDeseado(){ return nivelDeseado; }
    }
}