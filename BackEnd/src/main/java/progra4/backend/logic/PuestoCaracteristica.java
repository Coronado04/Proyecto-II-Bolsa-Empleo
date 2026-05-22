package progra4.backend.logic;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
@JsonIgnoreProperties({
        "puesto"
})
@Entity
@Table(name = "puestocaracteristica")
@IdClass(PuestoCaracteristicaId.class)
public class PuestoCaracteristica {

    @Id
    @ManyToOne
    @JoinColumn(name = "puesto_id", nullable = false)
    private Puesto puesto;

    @Id
    @ManyToOne
    @JoinColumn(name = "caracteristica_id", nullable = false)
    private Caracteristica caracteristica;

    @Column(name = "nivel_deseado", nullable = false)
    private Integer nivelDeseado;

    public PuestoCaracteristica() {}

    public Puesto getPuesto() { return puesto; }
    public void setPuesto(Puesto puesto) { this.puesto = puesto; }

    public Caracteristica getCaracteristica() { return caracteristica; }
    public void setCaracteristica(Caracteristica caracteristica) { this.caracteristica = caracteristica; }

    public Integer getNivelDeseado() { return nivelDeseado; }
    public void setNivelDeseado(Integer nivelDeseado) { this.nivelDeseado = nivelDeseado; }
}