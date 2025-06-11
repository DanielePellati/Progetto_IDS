/**
 * Rappresenta un elemento con nome, id padre, attributi, sinonimi e nomi precedenti.
 */
class Elemento {
  /**
   * constructor
   * Crea un nuovo elemento.
   * @param {number|string} id - Identificativo univoco dell'elemento (non incluso nel JSON).
   * @param {string} nome - Nome dell'elemento.
   * @param {number|string|null} idPadre - Identificativo del genitore dell'elemento.
   * @param {Attributo[]} [listaAttributi=[]] - Lista degli attributi associati all'elemento.
   * @param {string[]} [listaSinonimi=[]] - Lista di sinonimi per l'elemento.
   * @param {Elemento[]} [listaNomiPrecedenti=[]] - Lista di nomi precedenti dell'elemento (come elementi).
   */
  constructor(id, nome, idPadre, listaAttributi, listaSinonimi, listaNomiPrecedenti) {
    this._id = id; // id da escludere nel JSON
    this._nome = nome;
    this._idPadre = idPadre;
    this._listaAttributi = listaAttributi || [];
    this._listaSinonimi = listaSinonimi || [];
    this._listaNomiPrecedenti = listaNomiPrecedenti || [];
  }

  /** 
   * get nome
   * @returns {string} Nome corrente dell'elemento 
   * */
  get nome() {
    return this._nome;
  }

  /** 
   * get idPadre
   * @returns {number|string|null} Id del genitore */
  get idPadre() {
    return this._idPadre;
  }

  /** 
   * get listaAttributi
   * @returns {Attributo[]} Lista degli attributi */
  get listaAttributi() {
    return this._listaAttributi;
  }

  /** 
   * get listaSinonimi
   * @returns {string[]} Lista dei sinonimi */
  get listaSinonimi() {
    return this._listaSinonimi;
  }

  /** 
   * get listaNomiPrecedenti
   * @returns {Elemento[]} Lista dei nomi precedenti come elementi */
  get listaNomiPrecedenti() {
    return this._listaNomiPrecedenti;
  }

  /**
   * get id
   *  @returns {number|string} Id interno dell'elemento */
  get id() {
    return this._id;
  }

  /** 
   * set nome
   * @param {string} nuovoNome - Nuovo nome da assegnare */
  set nome(nuovoNome) {
    this._nome = nuovoNome;
  }

  /** @param {number|string|null} nuovoIdPadre - Nuovo id padre */
  set idPadre(nuovoIdPadre) {
    this._idPadre = nuovoIdPadre;
  }

  /** 
   * set listaAttributi
   * @param {Attributo[]} nuovaListaAttributi - Nuova lista di attributi */
  set listaAttributi(nuovaListaAttributi) {
    this._listaAttributi = nuovaListaAttributi;
  }

  /** 
   * set listaSinonimi
   * @param {string[]} nuovaListaSinonimi - Nuova lista di sinonimi */
  set listaSinonimi(nuovaListaSinonimi) {
    this._listaSinonimi = nuovaListaSinonimi;
  }

  /**
   * set listaNomiPrecedenti
   *  @param {Elemento[]} nuovaListaNomiPrecedenti - Nuova lista di nomi precedenti */
  set listaNomiPrecedenti(nuovaListaNomiPrecedenti) {
    this._listaNomiPrecedenti = nuovaListaNomiPrecedenti;
  }

  /** 
   * set id
   * @param {number|string} id - Imposta un nuovo id interno */
  set id(id) {
    this._id = id;
  }

  /**
   * toJSON
   * Converte l'elemento in un oggetto JSON escludendo l'id interno.
   * Esegue la serializzazione di attributi e nomi precedenti.
   * @returns {Object} Rappresentazione JSON dell'elemento.
   */
  toJSON() {
    return {
      nomeElemento: this._nome,
      idPadre: this._idPadre,
      attributi: this._listaAttributi.map(attr => attr.toJSON()),
      sinonimi: this._listaSinonimi,
      nomiPrecedenti: this._listaNomiPrecedenti.map(np => np.toJSON())
    };
  }
}
