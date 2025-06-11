/**
 * Rappresenta un nome precedente associato a una data di modifica.
 */
class NomePrecedente {
  /**
   * constructor
   * Crea un nuovo NomePrecedente.
   * @param {string} nome - Il nome precedente.
   * @param {string|Date} dataModifica - La data in cui il nome è stato modificato.
   */
  constructor(nome, dataModifica) {
    this._nome = nome;
    this._dataModifica = dataModifica;
  }

  /** 
   * get nome
   * @returns {string} Il nome precedente */
  get nome() {
    return this._nome;
  }

  /** 
   * get dataModifica
   * @returns {string|Date} La data di modifica del nome */
  get dataModifica() {
    return this._dataModifica;
  }

  /**
   * set nome
   * Imposta un nuovo nome precedente.
   * @param {string} nuovoNome - Il nuovo nome precedente.
   */
  set nome(nuovoNome) {
    this._nome = nuovoNome;
  }

  /**
   * set dataModifica
   * Imposta una nuova data di modifica.
   * @param {string|Date} nuovaData - La nuova data di modifica.
   */
  set dataModifica(nuovaData) {
    this._dataModifica = nuovaData;
  }

  /**
   * toJSON
   * Restituisce la rappresentazione JSON dell'istanza.
   * @returns {{nome: string, dataModifica: string|Date}} Oggetto JSON con nome e data di modifica.
   */
  toJSON() {
    return {
      nome: this._nome,
      dataModifica: this._dataModifica,
    };
  }
}
