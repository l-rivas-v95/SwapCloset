package org.swapcloset.backend.modelos;

public enum TipoProducto {
    intercambio("Intercambio"),
    prestamo("Préstamo");

    private final String tipo;

    TipoProducto(String label) {
        this.tipo = label;
    }

    public String getTipo() {
        return tipo;
    }
}
