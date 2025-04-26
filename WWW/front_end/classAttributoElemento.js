class Attributo {
    constructor(valore, tipo) {
        this._valore = valore;  // Usa _valore come proprietà interna
        this._tipo = tipo;      // Usa _tipo come proprietà interna
    }

    // Getter per il valore
    get valore() {
        return this._valore;    // Restituisci la proprietà interna _valore
    }

    // Getter per il tipo
    get tipo() {
        return this._tipo;      // Restituisci la proprietà interna _tipo
    }

    toJSON() {
        return {
            valore: this.valore,
            tipo: this.tipo
        };
    }
}

window.Attributo = Attributo;
