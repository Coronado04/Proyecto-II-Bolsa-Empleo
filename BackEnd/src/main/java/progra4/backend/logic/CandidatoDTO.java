package progra4.backend.logic;

public class CandidatoDTO {
    private Oferente oferente;
    private int cumplidas;
    private int totalRequeridas;
    private double porcentaje;

    public CandidatoDTO() {}

    public CandidatoDTO(Oferente oferente, int cumplidas, int totalRequeridas, double porcentaje) {
        this.oferente = oferente;
        this.cumplidas = cumplidas;
        this.totalRequeridas = totalRequeridas;
        this.porcentaje = porcentaje;
    }

    public Oferente getOferente() { return oferente; }
    public void setOferente(Oferente oferente) { this.oferente = oferente; }

    public int getCumplidas() { return cumplidas; }
    public void setCumplidas(int cumplidas) { this.cumplidas = cumplidas; }

    public int getTotalRequeridas() { return totalRequeridas; }
    public void setTotalRequeridas(int totalRequeridas) { this.totalRequeridas = totalRequeridas; }

    public double getPorcentaje() { return porcentaje; }
    public void setPorcentaje(double porcentaje) { this.porcentaje = porcentaje; }
}
