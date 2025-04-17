class Elemento{
    constructor(nome, attributi = [], sinonimi = []){
        this.nome = nome;
        this.attributi = attributi;
        this.sinonimi = sinonimi;
    }

    aggiungiAttributo(attributo){
        this.attributi.push(attributo);
    }

    aggiungiSinomino(sinonimo){
        this.sinonimi.push(sinonimo);
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