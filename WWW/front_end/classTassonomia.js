/**
 * Rappresenta una tassonomia composta da un insieme di elementi.
 */
class Tassonomia {
  /**
   * constructor
   * Crea una nuova Tassonomia.
   * @param {string} nome - Il nome della tassonomia.
   * @param {string} descrizione - La descrizione della tassonomia.
   * @param {Elemento[]} [listaElementi=[]] - Lista degli elementi associati alla tassonomia.
   */
  constructor(nome, descrizione, listaElementi) {
    this._nome = nome;
    this._descrizione = descrizione;
    this._listaElementi = listaElementi || [];
  }

  /** 
   * get nome
   * @returns {string} Il nome della tassonomia */
  get nome() {
    return this._nome;
  }

  /** 
   * get descrizione
   * @returns {string} La descrizione della tassonomia */
  get descrizione() {
    return this._descrizione;
  }

  /**
   * get listaElementi 
   * @returns {Elemento[]} La lista degli elementi associati */
  get listaElementi() {
    return this._listaElementi;
  }

  /**
   * set nome
   * Imposta un nuovo nome per la tassonomia.
   * @param {string} nuovoNome - Il nuovo nome.
   */
  set nome(nuovoNome) {
    this._nome = nuovoNome;
  }

  /**
   * set descrizione
   * Imposta una nuova descrizione.
   * @param {string} nuovaDescrizione - La nuova descrizione.
   */
  set descrizione(nuovaDescrizione) {
    this._descrizione = nuovaDescrizione;
  }

  /**
   * set listaElementi
   * Imposta una nuova lista di elementi.
   * @param {Elemento[]} nuovaListaElementi - La nuova lista di elementi.
   */
  set listaElementi(nuovaListaElementi) {
    this._listaElementi = nuovaListaElementi;
  }

  /**
   * toJSON
   * Restituisce la rappresentazione JSON dell'istanza.
   * @returns {{nomeTassonomia: string, descrizione: string, elementi: Object[]}} Oggetto JSON della tassonomia.
   */
  toJSON() {
    return {
      nomeTassonomia: this._nome,
      descrizione: this._descrizione,
      elementi: this._listaElementi.map(el => el.toJSON())
    };
  }
}
