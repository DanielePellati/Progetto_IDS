var nomePrecedente, descrizionePrecedente;

/**
 * backHome
 * Fa tornare l'utente alla homepage
 * @returns {void}
 */
function backHome() {
  // Reindirizza alla pagina ../index.php
  window.location.href = "../index.php";

  // Manipola la cronologia per impedire che l'utente torni indietro
  history.pushState(null, "", location.href);
  window.onpopstate = function () {
    history.go(1); // Impedisce all'utente di tornare indietro
  };
}

$(".esci").on("click", function () {
  const scelta = window.confirm("Vuoi uscire? Le modifiche verranno scartate");

  // se l'utente vuol effettivamente uscire
  if (scelta) {
    backHome();
  }
});

/**
 * impostaValori
 * Imposto i valori negli input
 * @param {string} nomePrecedente nome attuale (letto dal DB)
 * @param {string} descrizionePrecedente descrizione attuale (letto dal DB)
 * @returns {void}
 */
function impostaValori(nomePrecedente, descrizionePrecedente) {
  $("#nomeTassonomia").val(nomePrecedente);
  $("#descTassonomia").val(descrizionePrecedente);
}

/**
 * risultatiModifica
 * Verifico i risultati
 * @param {Object | Object[]} data Risultato della chiamata
 * @returns {void}
 */
function risultatiModifica(data) {
  switch (data.risultato) {
    case 1:
      backHome(); // Modifica riuscita, torno alla home
      break;
    case -1:
      alert("Numero sbagliato di tassonomia " + data.idTassonomia);
      break;
    case -2:
      alert("Non è stato modificato niente");
      break;
    case -3:
      alert("Errore nella query di modifica " + data.errore);
      break;
  }
}

/**
 * salvaModifiche
 * Legge i nuovi valori e dopo averli verificati fa una richiesta per l'inserimento
 * @returns {void}
 */
function salvaModifiche() {
  const nomeTassonomia = $("#nomeTassonomia").val();
  const descTassonomia = $("#descTassonomia").val();
  let scelta;

  if (nomeTassonomia.length == 0 || nomeTassonomia.length == undefined) {
    alert("Errore: campo nome obbligatorio");
    $("#nomeTassonomia").val(nomePrecedente);
  } else {
    if (
      nomeTassonomia.trimEnd() !== nomePrecedente &&
      descTassonomia.trimEnd() !== descrizionePrecedente
    ) {
      scelta = 1; // modifica di entrambi
    } else if (nomeTassonomia.trimEnd() != nomePrecedente) {
      scelta = 2; // modifica del nome
    } else if (descTassonomia.trimEnd != descrizionePrecedente) {
      scelta = 3; // modifica della descrizione
    } else {
      backHome(); // se nessuno dei due cambia, do semplicemente la modifica come riuscita e torno alla home
    }

    switch (scelta) {
      case 1:
        $.post(
          "../back_end/salvaModificheInfo.php",
          {
            nome: nomeTassonomia,
            descrizione: descTassonomia,
            idTassonomia: idTassonomia,
          },
          function (data) {
            risultatiModifica(data);
          },
          "json"
        ).fail(function (jqXHR, textStatus, errorThrown) {
          alert(
            "1 - Errore nella richiesta: " + textStatus + ": " + errorThrown
          );
        });
        break;
      case 2:
        $.post(
          "../back_end/salvaModificheInfo.php",
          { nome: nomeTassonomia, idTassonomia: idTassonomia },
          function (data) {
            risultatiModifica(data);
          },
          "json"
        ).fail(function (jqXHR, textStatus, errorThrown) {
          alert(
            "2 - Errore nella richiesta: " + textStatus + ": " + errorThrown
          );
        });
        break;
      case 3:
        $.post(
          "../back_end/salvaModificheInfo.php",
          { descrizione: descTassonomia, idTassonomia: idTassonomia },
          function (data) {
            risultatiModifica(data);
          },
          "json"
        ).fail(function (jqXHR, textStatus, errorThrown) {
          alert(
            "3 - Errore nella richiesta: " + textStatus + ": " + errorThrown
          );
        });
        break;
    }
  }
}

$(document).ready(function () {
  if (!idTassonomia) {
    alert("Errore: id non valido");
    backHome();
  }

  $.post(
    "../back_end/get_tassonomia.php",
    { id: idTassonomia, func: 1 },
    function (data) {
      nomePrecedente = data.nome;
      descrizionePrecedente = data.descrizione;
      impostaValori(nomePrecedente, descrizionePrecedente);
      impostaTitle(nomePrecedente);
    },
    "json"
  );
});

$(document).ready(function () {
  $("#back_home").click(function (e) {
    const uscire = confirm("Vuoi uscire? Niente verrà salvato.");
    if (!uscire) {
      e.preventDefault();
    }
  });
});

/**
 * impostaTitle
 * Imposto il titolo alla pagina HTML
 * @param {string} titolo
 * @returns {void}
 */
function impostaTitle(titolo) {
  $("title").text(titolo);
}
