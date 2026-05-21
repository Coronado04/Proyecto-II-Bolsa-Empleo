package progra4.backend.logic;

import jakarta.persistence.*;

@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false, length = 100)
    private String correo;

    @Column(nullable = false, length = 100)
    private String clave;

    @Column(nullable = false, length = 5)
    private String rol;           // EMP | OFE | ADM

    private boolean activo = false;

    public Usuario() {}

    public Usuario(Integer id, String correo, String clave, String rol, boolean activo) {
        this.id = id;
        this.correo = correo;
        this.clave = clave;
        this.rol = rol;
        this.activo = activo;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
}
