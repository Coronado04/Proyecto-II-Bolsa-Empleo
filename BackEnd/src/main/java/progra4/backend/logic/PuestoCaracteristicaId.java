package progra4.backend.logic;

import java.io.Serializable;
import java.util.Objects;

public class PuestoCaracteristicaId implements Serializable {
    private Integer puesto;
    private Integer caracteristica;

    public PuestoCaracteristicaId() {}

    public PuestoCaracteristicaId(Integer puesto, Integer caracteristica) {
        this.puesto = puesto;
        this.caracteristica = caracteristica;
    }

    public Integer getPuesto() { return puesto; }
    public void setPuesto(Integer puesto) { this.puesto = puesto; }

    public Integer getCaracteristica() { return caracteristica; }
    public void setCaracteristica(Integer caracteristica) { this.caracteristica = caracteristica; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PuestoCaracteristicaId that = (PuestoCaracteristicaId) o;
        return Objects.equals(puesto, that.puesto) &&
                Objects.equals(caracteristica, that.caracteristica);
    }

    @Override
    public int hashCode() {
        return Objects.hash(puesto, caracteristica);
    }
}