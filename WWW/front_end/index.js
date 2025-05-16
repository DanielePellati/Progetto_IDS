// invia richiesta per prendere i dati delle tassonomie
// ricevi i dati delle tassonomie
// popola la tabella con i dati ottenuti
// nome tassonomia + link per visualizzare la tassonomia con l'id in query string

var templateRiga = `
    <tr>
        <td>
            {nome}
        </td>
        <td>
            <a href="/front_end/visualizzaTassonomia.html?id={id}" class="btn btn-outline-primary btn-sm" title="Visualizza">
                <i class="bi bi-eye"></i>
            </a>
        </td>
        <td>
          <a onclick = "modificaInfoTassonomia({idTassonomia})" style="cursor: pointer;" class="btn btn-outline-primary btn-sm" title="Modifica">
            <i class = "bi bi-pencil"></i>
        </td>
        <td>
            <a onclick = "eliminaTassonomia({idTassonomia})" style="cursor: pointer;" class="btn btn-outline-primary btn-sm" title="Elimina">
                <i class="bi bi-trash"></i>
            </a>
        </td>
    </tr>
`;

let riga;

$(document).ready(function () {
  $.get(
    "/back_end/get_index.php",
    function (data) {
      var tassonomie = JSON.parse(data);

      $.each(tassonomie, function (_, tassonomia) {
        riga = templateRiga
          .replace("{nome}", tassonomia.nome)
          .replace("{id}", tassonomia.id)
          .replace("{idTassonomia}", tassonomia.id);
        $("#scelta_tassonomia").append(riga);
      });
    },
    "json"
  );
});

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
      } else if (data.esito == 4) {
        rimossaConSuccesso();
      } else {
        // Passa i dati necessari alla funzione di pulizia
        pulisciTassonomia(data.idRadice, data.isPadre, idTassonomia);
      }
    },
    "json"
  );
}

function pulisciTassonomia(idRadice, isPadre, idTassonomia) {
  // Seconda chiamata per rimuovere l'elemento e i suoi figli
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

function eliminaTassonomiaDefinitiva(idTassonomia) {
  // Seconda chiamata per eliminare definitivamente la tassonomia dal database
  $.post(
    "../back_end/elimina_tassonomia.php",
    { idTassonomia: idTassonomia },
    function (data) {
      if (data.esito < 0) {
        alert("Errore durante l'eliminazione definitiva della tassonomia!");
      } else {
        rimossaConSuccesso();
      }
    },
    "json"
  );
}

function rimossaConSuccesso() {
  alert("Rimossa con successo");
  window.location.replace(window.location.href);
}

function modificaInfoTassonomia(idTassonomia) {
  const $form = $("<form>", {
    method: "POST",
    action: "../front_end/modificaInfoTassonomia.php",
  });

  $form.append(
    $("<input>", {
      type: "hidden",
      name: "idTassonomia",
      value: `${idTassonomia}`,
    })
  );

  $form.appendTo("body").submit();
}
