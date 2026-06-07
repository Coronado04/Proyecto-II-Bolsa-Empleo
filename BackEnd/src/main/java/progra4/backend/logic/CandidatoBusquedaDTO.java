package progra4.backend.logic;

import java.util.List;

public class CandidatoBusquedaDTO {
    private Integer id;
    private String nombre;
    private String primerApellido;
    private String nacionalidad;
    private String telefono;
    private String residencia;
    private boolean tieneCurriculum;
    private List<HabilidadDTO> habilidades;

    public static class HabilidadDTO {
        private String caracteristica;
        private int nivel;
        public HabilidadDTO(String caracteristica, int nivel) {
            this.caracteristica = caracteristica;
            this.nivel = nivel;
        }
        public String getCaracteristica() { return caracteristica; }
        public int getNivel() { return nivel; }
    }

    public CandidatoBusquedaDTO(Oferente o, List<HabilidadDTO> habilidades) {
        this.id              = o.getId();
        this.nombre          = o.getNombre();
        this.primerApellido  = o.getPrimerApellido();
        this.nacionalidad    = o.getNacionalidad();
        this.telefono        = o.getTelefono();
        this.residencia      = o.getResidencia();
        this.tieneCurriculum = o.getCurriculum() != null && !o.getCurriculum().isBlank();
        this.habilidades     = habilidades;
    }

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
    public String getPrimerApellido() { return primerApellido; }
    public String getNacionalidad() { return nacionalidad; }
    public String getTelefono() { return telefono; }
    public String getResidencia() { return residencia; }
    public boolean isTieneCurriculum() { return tieneCurriculum; }
    public List<HabilidadDTO> getHabilidades() { return habilidades; }
}