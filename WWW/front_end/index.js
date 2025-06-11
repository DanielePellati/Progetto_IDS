/**
invia richiesta per prendere i dati delle tassonomie
ricevi i dati delle tassonomie
popola la tabella con i dati ottenuti
nome tassonomia + link per visualizzare la tassonomia con l'id in query string
*/

var templateRiga = `
    <tr id = riga_{id}>
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
        <td>
          <a onclick = "creaJSON({idTassonomia})" style="cursor: pointer;" class="btn btn-outline-primary btn-sm" title="Scarica">
              <i class="bi bi-download"></i>
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

      if (tassonomie.error == -1) {
        alert("Errore");
      } else {
        $.each(tassonomie, function (_, tassonomia) {
          riga = templateRiga
            .replace("{nome}", tassonomia.nome)
            .replaceAll("{id}", tassonomia.id)
            .replaceAll("{idTassonomia}", tassonomia.id);
          $("#scelta_tassonomia").append(riga);
        });
      }
    },
    "json"
  );
});

/**
 * modificaInfoTassonomia
 * @param {number} idTassonomia id della tassonomia di cui voglio modificare le informazioni
 * @returns {void}
 */
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
