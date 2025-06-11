/**
 * getId
 * legge e ritorna l'id passato in get e letto dal querystring
 * @returns {number} restituisce l'id
 */
function getId() {
  let urlParamas = new URLSearchParams(window.location.search);
  return parseInt(urlParamas.get("idCategoria"));
}

/**
 * popolaTabella
 * Riempie la tabella
 * @param {Array} categoria contiene le informazioni della categoria passati dal DB
 * @returns {void}
 */
function popolaTabella(categoria) {
  let tabella;
  let bottoneElimina;

  categoria.forEach((voce) => {
    bottoneElimina = `
    <button 
        class="btn btn-outline-primary btn-sm" 
        onclick = "eliminaElemento(${voce.id})" 
        title="Elimina"
        style="cursor: pointer;">
            <i
             class="bi bi-trash">
            </i>
    </button>`;

    tabella += `
        <tr>
            <td> ${voce.voce} </td> 
            <td> ${bottoneElimina} </td>
        `;
  });

  $("#bodyTabCategoria").append(tabella);
}

/**
 * eliminaElemento
 * Procedura di eliminazione di una voce della categoria
 * @param {number} idVoce id della voce da cancellare
 * @returns {void}
 */
function eliminaElemento(idVoce) {
  $.post(
    "../back_end/elimina_voceCategoria.php",
    { idVoce: idVoce },
    function (data) {
      if (data.esito == -2) {
        alert("Cancellazione impossibile. L'elemento è in uso");
      } else if (data.esito == -1) {
        alert("Elemento da cancellare non valido");
      } else if (data.esito == -3) {
        alert("Errore nella cancellazione");
      } else {
        window.location.replace(window.location.href);
      }
    },
    "json"
  );
}

/**
 * creaTabella
 * Inizia la procedura di creazione della tabella
 * @returns {void}
 */
function creaTabella() {
  const idCategoria = getId();

  $.get(
    "../back_end/get_categoria.php",
    { idCategoria: idCategoria, scelta: 2 },
    function (data) {
      if (data.risultato == -3) {
        alert("Errore: id categoria non valido");
      } else if (data.risultato == -5) {
        alert("Errore nella query");
      }

      popolaTabella(data);
    },
    "json"
  );
}

/**
 * impostaInformazioni
 * Imposta il titolo e i bottoni della pagina
 * @param {Object} info informazioni da mettere nei vari bottoni
 * @returns {void}
 */
function impostaInformazioni(info) {
  $("title").text(info.nome);

  const indietro = `./tabellaCategorie.html?idTassonomia=${info.id_tassonomia}`;
  $("#indietro").attr("href", indietro);

  creaTabella();
}

/**
 * stampaErrore
 * Stampa un messaggio di errore e torna all'index
 * @param {string} msg
 * @returns {void}
 */
function stampaErrore(msg) {
  alert(msg);
  window.location.href = "../index.php";
}

$(document).ready(function () {
  const idCategoria = getId();

  // prendo due informazioni: nome categoria (<title>) e id categoria (bottone indietro)
  $.get(
    "../back_end/get_categoria.php",
    { idCategoria: idCategoria, scelta: 1 },
    function (data) {
      if (data.risultato == -1) {
        stampaErrore("Errore: scelta = null");
      } else if (data.risultato == -2) {
        stampaErrore("Errore: scelta non valida. Valori validi: 1, 2");
      } else if (data.risultato == -3) {
        stampaErrore(
          "Errore: id categoria non valido. Categoria = " + data.categoria
        );
      } else if (data.risultato == -4) {
        stampaErrore("Errore nella query");
      } else {
        impostaInformazioni(data);
      }
    },
    "json"
  );
});
