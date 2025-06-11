/**
 * getId()
 * Legge e ritorna l'id passato in GET e letto dal querystring.
 * @returns {number} id passato in GET e letto dal querystring
 */
function getId() { 
  let urlParamas = new URLSearchParams(window.location.search);
  return parseInt(urlParamas.get("idTassonomia"));
}

/**
 * stampaErrore
 * Stampa un messaggio di errore e ritorna all'index.
 * @returns {void}
 */
function stampaErrore() {
  alert("Errore: id non valido");
  window.location.href = "../index.php";
}

$(document).ready(function () {
  $("#categoryForm").on("submit", function (e) {
    e.preventDefault();

    let urlParamas = new URLSearchParams(window.location.search);
    var idTassonomia = urlParamas.get("idTassonomia");

    const nome = $("#categoryName").val();
    const numVoci = parseInt($("#categoryNumber").val().trim(), 10);
    let listaVoci = [];

    if (nome.trim().length == 0) {
      return false;
    }

    if (
      idTassonomia === null ||
      isNaN(idTassonomia) ||
      parseInt(idTassonomia) <= 0
    ) {
      return false;
    }

    if (isNaN(numVoci) || numVoci <= 0) {
      alert("Numero di voci non valido");
      return false;
    }

    for (let i = 0; i < numVoci; i++) {
      let voce = $(`#voce-${i}`).val().trim();

      if (voce != undefined && voce.length != 0) {
        listaVoci.push(voce);
      }
    }

    if (listaVoci.length != 0) {
      let urlParamas = new URLSearchParams(window.location.search);
      var idTassonomia = urlParamas.get("idTassonomia");

      $.post(
        "../back_end/set_categoria.php",
        {
          nome: nome,
          listaVoci: JSON.stringify(listaVoci),
          idTassonomia: idTassonomia,
        },
        function (data) {
          if (data == -1) {
            stampaErrore();
          } else {
            location.replace(`./visualizzaTassonomia.html?id=${idTassonomia}`);
          }
        }
      );
    } else {
      alert("Inserisci almeno un elemento nella categoria");
    }
  });
});

/**
 * aggiungiVoce
 * Aggiunge input voci quando viene aumentato il contatore
 * @param {number} numeroScelto numero di voci scelto dall'utente
 * @param {number} numeroAttuale numero di voci attuale
 * @returns {void}
 */
function aggiungiVoce(numeroScelto, numeroAttuale) {
  const divVoci = $("#divInputVoci");

  let labelVoce;
  let inputVoce;

  for (let i = numeroAttuale; i < numeroScelto; i++) {
    labelVoce = $(`<label>`, {
      id: `labelVoce-${i}`,
      for: "categoryElement",
      class: "form-label",
    }).text(`Inserisci la ${i + 1}^ voce`);

    inputVoce = $(`<input>`, {
      type: "text",
      class: "form-control voce",
      name: `voce-${i}`,
      id: `voce-${i}`,
      placeholder: "Inserisci voce",
    });

    divVoci.append(labelVoce).append(inputVoce);
  }
}

/**
 * rimuoviVoce
 * Rimuove gli input in eccesso quando diminuisce il numero
 * @param {number} numeroAttuale numero attuale di elementi
 * @param {number} numeroScelto numero scelto di elementi
 * @returns {void}
 */
function rimuoviVoce(numeroAttuale, numeroScelto) {
  for (let i = numeroScelto; i < numeroAttuale; i++) {
    $(`#labelVoce-${i}`).remove();
    $(`#voce-${i}`).remove();
  }
}

$("#categoryNumber").on("input", function () {
  if ($(this).val() < 1) {
    $(this).val(1);
    const numeroAttuale = $('input[type="text"].voce').length;
    rimuoviVoce(numeroAttuale, 1);
  }
});

$("#categoryNumber").on("change", function () {
  const numeroScelto = parseInt($("#categoryNumber").val());
  const numeroAttuale = $('input[type="text"].voce').length;

  // se maggiore aggiungo gli elementi, se minore li rimuovo.
  numeroScelto > numeroAttuale
    ? aggiungiVoce(numeroScelto, numeroAttuale)
    : rimuoviVoce(numeroAttuale, numeroScelto);
});

$("#indietro").ready(function () {
  $("#indietro").attr("href", `./visualizzaTassonomia.html?id=${getId()}`);
});

$(".conferma").click(function (e) {
  const uscire = confirm("Vuoi uscire? Niente verrà salvato.");
  if (!uscire) {
    e.preventDefault();
  }
});
