/**
 * Rappresenta un attributo con un valore e un tipo associato.
 */
class Attributo {
  /**
   * constructor
   * Crea un nuovo Attributo.
   * @param {*} valore - Il valore dell'attributo.
   * @param {string} tipo - Il tipo dell'attributo.
   */
  constructor(valore, tipo) {
    this._valore = valore;
    this._tipo = tipo;
  }

  /**
   * get valore
   * Ottiene il valore dell'attributo.
   * @returns {*} Il valore corrente.
   */
  get valore() {
    return this._valore;
  }

  /**
   * get tipo
   * Ottiene il tipo dell'attributo.
   * @returns {string} Il tipo corrente.
   */
  get tipo() {
    return this._tipo;
  }

  /**
   * set valore
   * Imposta un nuovo valore per l'attributo.
   * @param {*} nuovoValore - Il nuovo valore da assegnare.
   */
  set valore(nuovoValore) {
    this._valore = nuovoValore;
  }

  /**
   * set tipo
   * Imposta un nuovo tipo per l'attributo.
   * @param {string} nuovoTipo - Il nuovo tipo da assegnare.
   */
  set tipo(nuovoTipo) {
    this._tipo = nuovoTipo;
  }

  /**
   * toJSON
   * Ritorna una rappresentazione JSON dell'attributo.
   * @returns {{valore: *, tipo: string}} Oggetto JSON con valore e tipo.
   */
  toJSON() {
    return {
      valore: this.valore,
      tipo: this.tipo,
    };
  }
}