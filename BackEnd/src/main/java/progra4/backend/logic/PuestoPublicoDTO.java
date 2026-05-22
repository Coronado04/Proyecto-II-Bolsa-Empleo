package progra4.backend.logic;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class PuestoPublicoDTO {

    private Integer id;
    private String descripcion;
    private Double salario;
    private LocalDateTime fechaRegistro;
    private String empresaNombre;
    private List<CaracteristicaDTO> caracteristicas;

    public PuestoPublicoDTO(Puesto puesto) {
        this.id = puesto.getId();
        this.descripcion = puesto.getDescripcion();
        this.salario = puesto.getSalario();
        this.fechaRegistro = puesto.getFechaRegistro();
        this.empresaNombre = puesto.getEmpresa() != null ? puesto.getEmpresa().getNombre() : "";
        this.caracteristicas = puesto.getCaracteristicas() == null ? List.of() :
            puesto.getCaracteristicas().stream()
                .map(pc -> new CaracteristicaDTO(
                    pc.getCaracteristica().getId(),
                    pc.getCaracteristica().getNombre(),
                    pc.getNivelDeseado(),
                    pc.getCaracteristica().getPadre() != null
                        ? pc.getCaracteristica().getPadre().getNombre() : null
                ))
                .collect(Collectors.toList());
    }

    public Integer getId() { return id; }
    public String getDescripcion() { return descripcion; }
    public Double getSalario() { return salario; }
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public String getEmpresaNombre() { return empresaNombre; }
    public List<CaracteristicaDTO> getCaracteristicas() { return caracteristicas; }

    public static class CaracteristicaDTO {
        private Integer id;
        private String nombre;
        private Integer nivelDeseado;
        private String categoria;

        public CaracteristicaDTO(Integer id, String nombre, Integer nivelDeseado, String categoria) {
            this.id = id;
            this.nombre = nombre;
            this.nivelDeseado = nivelDeseado;
            this.categoria = categoria;
        }

        public Integer getId() { return id; }
        public String getNombre() { return nombre; }
        public Integer getNivelDeseado() { return nivelDeseado; }
        public String getCategoria() { return categoria; }
    }
}
