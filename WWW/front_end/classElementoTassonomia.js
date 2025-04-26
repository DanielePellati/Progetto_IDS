class Elemento{
    constructor(nome, attributi = [], sinonimi = []){
        this.nome = nome;
        this.attributi = attributi instanceof Array ? attributi : [];
        this.sinonimi = sinonimi;
    }

    toJSON() {
        return JSON.stringify({
          nome: this.nome,
          attributi: this.attributi,
          sinonimi: this.sinonimi
        }, null, 2); // 'null, 2' per indentazione leggibile
      }
}

window.Elemento = Elemento