package progra4.backend.logic;

import java.util.List;
import java.util.stream.Collectors;

public class CaracteristicaArbolDTO {

    private Integer id;
    private String nombre;
    private List<CaracteristicaArbolDTO> hijos;

    public CaracteristicaArbolDTO(Caracteristica c) {
        this.id = c.getId();
        this.nombre = c.getNombre();
        this.hijos = c.getHijos() == null ? List.of() :
            c.getHijos().stream()
                .map(CaracteristicaArbolDTO::new)
                .collect(Collectors.toList());
    }

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
    public List<CaracteristicaArbolDTO> getHijos() { return hijos; }
}
