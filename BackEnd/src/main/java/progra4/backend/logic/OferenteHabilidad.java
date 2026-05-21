package progra4.backend.logic;

import jakarta.persistence.*;

@Entity
@Table(name = "OferenteHabilidad")
public class OferenteHabilidad {

    @EmbeddedId
    private OferenteHabilidadId id = new OferenteHabilidadId();

    @ManyToOne
    @MapsId("oferenteId")
    @JoinColumn(name = "oferente_id", nullable = false)
    private Oferente oferente;

    @ManyToOne
    @MapsId("caracteristicaId")
    @JoinColumn(name = "caracteristica_id", nullable = false)
    private Caracteristica caracteristica;

    @Column(nullable = false)
    private Integer nivel;

    public OferenteHabilidad() {}

    public OferenteHabilidadId getId() { return id; }
    public void setId(OferenteHabilidadId id) { this.id = id; }

    public Oferente getOferente() { return oferente; }
    public void setOferente(Oferente oferente) {
        this.oferente = oferente;
        this.id.setOferenteId(oferente.getId());
    }

    public Caracteristica getCaracteristica() { return caracteristica; }
    public void setCaracteristica(Caracteristica caracteristica) {
        this.caracteristica = caracteristica;
        this.id.setCaracteristicaId(caracteristica.getId());
    }

    public Integer getNivel() { return nivel; }
    public void setNivel(Integer nivel) { this.nivel = nivel; }
}
