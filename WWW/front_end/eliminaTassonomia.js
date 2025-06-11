/**
 * rimossaConSuccesso
 * Se la tassonomia viene rimossa con successo, lo stampo poi rimuovo la riga
 * @param {any} idRiga
 * @returns {any}
 */
function rimossaConSuccesso(idRiga) {
  alert("Rimossa con successo");
  $(`#riga_${idRiga}`).remove();
}

/**
 * eliminaTassonomia
 * Funziona che inizia la rimozione della tassonomia
 * @param {number} idTassonomia
 * @returns {void}
 */
function eliminaTassonomia(idTassonomia) {
  // Prima chiamata per ottenere i dati della tassonomia
  $.post(
    "../back_end/elimina_tassonomia.php",
    { idTassonomia: idTassonomia },
    function (data) {
      if (data.esito < 0) {
        alert(
          "Errore durante l'ottenimento dei dati per l'eliminazione! " +
            data.esito
        );
      } else if (data.esito == 1) {
        rimossaConSuccesso(idTassonomia);
      } else {
        // Passa i dati necessari alla funzione di pulizia
        pulisciTassonomia(data.idRadice, data.isPadre, idTassonomia);
      }
    },
    "json"
  );
}

/**
 * pulisciTassonomia
 * Funzione che richiede la rimozione degli elementi della tassonomia
 * @param {number} idRadice id della radice della tassonomia
 * @param {boolean} isPadre true = elemento è padre, false in caso contrario
 * @param {number} idTassonomia id della tassonomia da eliminare
 * @returns {void}
 */
function pulisciTassonomia(idRadice, isPadre, idTassonomia) {
  // Seconda chiamata per rimuovere l'elemento
  $.post(
    "../back_end/rimuovi_elemento.php",
    { id_elemento: idRadice, isPadre: isPadre },
    function (data) {
      if (data.success) {
        // Dopo che l'elemento è stato rimosso, chiama la funzione per eliminare definitivamente la tassonomia
        eliminaTassonomiaDefinitiva(idTassonomia);
      } else {
        alert("Errore nella rimozione dell'elemento dalla tassonomia!");
      }
    },
    "json"
  );
}

/**
 * eliminaTassonomiaDefinitiva
 * Rimuovo effettivamente la tassonomia. Qui effettuo la richiesta di cancellazione
 * @param {number} idTassonomia
 * @returns {void}
 */
function eliminaTassonomiaDefinitiva(idTassonomia) {
  // Seconda chiamata per eliminare definitivamente la tassonomia dal database
  $.post(
    "../back_end/elimina_tassonomia.php",
    { idTassonomia: idTassonomia },
    function (data) {
      if (data.esito < 0) {
        alert("Errore durante l'eliminazione definitiva della tassonomia!");
      } else {
        rimossaConSuccesso(idTassonomia);
      }
    },
    "json"
  );
}
