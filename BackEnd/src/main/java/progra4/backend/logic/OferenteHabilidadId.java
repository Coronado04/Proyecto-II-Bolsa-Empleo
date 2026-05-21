package progra4.backend.logic;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class OferenteHabilidadId implements Serializable {

    private Integer oferenteId;
    private Integer caracteristicaId;

    public OferenteHabilidadId() {}

    public OferenteHabilidadId(Integer oferenteId, Integer caracteristicaId) {
        this.oferenteId = oferenteId;
        this.caracteristicaId = caracteristicaId;
    }

    public Integer getOferenteId() { return oferenteId; }
    public void setOferenteId(Integer oferenteId) { this.oferenteId = oferenteId; }

    public Integer getCaracteristicaId() { return caracteristicaId; }
    public void setCaracteristicaId(Integer caracteristicaId) { this.caracteristicaId = caracteristicaId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OferenteHabilidadId)) return false;
        OferenteHabilidadId that = (OferenteHabilidadId) o;
        return Objects.equals(oferenteId, that.oferenteId) &&
                Objects.equals(caracteristicaId, that.caracteristicaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(oferenteId, caracteristicaId);
    }
}
