function creaFormElemento(num, $container, tipo) {
  // Trova quanti input sono già presenti nel contenitore
  const currentFields =
    $container.find("input").length +
    $container.find(".sceltaCategoria").length;
  // Aggiungi i nuovi campi se necessario
  for (let i = currentFields; i < num; i++) {
    // Crea il nuovo campo di input e aggiungilo al contenitore
    var strValori = `
    <div class="mb-2" id="${tipo}-${i}">
        <label for="${tipo}-${i}" class="form-label">Valore ${i + 1}</label>
        <div class="row g-2">
        <div class="col-12">
            <input
            type="text"
            class="form-control"
            id="input-${tipo}-${i}"
            name="${tipo}-${i}"
            placeholder="Inserisci il valore ${i + 1}"
            />
      </div>
      `;

    var strTipi = `
      
        <div class="col-4">
            <select class="form-select sceltaAttributo" id="type-attributo-${i}" name="type-attributo-${i}">
            <option value="0">Stringa</option>
            <option value="1">Intero</option>
            <option value="2">Categoriale</option>
            </select>
        </div>
    </div>
  </div>`;

    var strDaStampare = "";

    if (tipo == "attributo") {
      strDaStampare = strValori + strTipi;
    } else {
      strDaStampare = strValori + `</div>`;
    }

    $container.append(strDaStampare);
  }

  // Rimuovi i campi in eccesso se il numero è stato ridotto
  for (let i = num; i < currentFields; i++) {
    $container.find(`#${tipo}-${i}`).remove();
  }
}

$(document).ready(function () {
  const $containerAttributi = $("#campiAttributi");
  const $containerSinonimi = $("#campiSinonimi");
  // Aggiungi una riga di input di default al caricamento della pagina (1 campo iniziale)
  const numDefaultFields = 1;

  creaFormElemento(numDefaultFields, $containerAttributi, "attributo");
  // Gestione input dinamici per aggiungere o rimuovere campi
  $("#numeroFigli").on("input", function () {
    const num = parseInt($("#numeroFigli").val()) || 0; // Ottieni il numero di campi da visualizzare
    creaFormElemento(num, $containerAttributi, "attributo"); // Aggiungi o rimuovi campi in base al numero
  });

  creaFormElemento(numDefaultFields, $containerSinonimi, "sinonimo");

  $("#numeroSinonimi").on("input", function () {
    const num2 = parseInt($("#numeroSinonimi").val()) || 0;
    creaFormElemento(num2, $containerSinonimi, "sinonimo");
  });
});

function salvaElemento() {
  const nomeElemento = $("#nomeElemento").val();
  let listaAttributi = [];
  let listaSinonimi = [];

  if (nomeElemento.length == 0 || nomeElemento.length == undefined) {
    alert("Il campo 'nome' è obbligatorio");
  } else {
    alert("Avvio processo per salvare un elemento");
  }
}

$("label[for='nodoRadice']").hover(
  function () {
    $(".messageRadice").fadeIn();
  },
  function () {
    $(".messageRadice").fadeOut();
  }
);

function creaOpzioniSelect(data, strOpzioni) {
  data.forEach((categoria) => {
    strOpzioni += `
    <option value = ${categoria.id}> ${categoria.nome}</option>
    `;
  });

  return strOpzioni;
}

function creaCategoriale(idElemento, oldInput) {
  selectCategoriale = $("<select>", {
    class: "form-select sceltaCategoria",
    id: `input-attributo-${idElemento}`,
    name: `select-categoriale-${idElemento}`,
  });

  var opzioniSelect = "<option value = 0>Scegli categoria</option>";

  $.get(
    "../back_end/get_categorie.php",
    { id_tassonomia: id_tassonomia, scelta: 0 },
    function (data) {
      opzioniSelect = creaOpzioniSelect(data, opzioniSelect);
      selectCategoriale.html(opzioniSelect);
      oldInput.replaceWith(selectCategoriale);
    },
    "json"
  );
}

function getInfoCategoria(idCategoria) {
  $.get(
    "../back_end/get_categorie.php",
    { id_tassonomia: id_tassonomia, id_categoria: idCategoria, scelta: 1 },
    function (data, textStatus, jqXHR) {},
    "dataType"
  );
}

$(document).on("change", ".sceltaCategoria", function () {
  let idCategoria = $(this).val();
  if (idCategoria > 0) {
    getInfoCategoria(idCategoria);
  }
});

$(document).on("change", ".sceltaAttributo", function () {
  let id = $(this).attr("id").split("-")[2];

  const tipo = parseInt($(this).val());
  let oldInput = $(`#input-attributo-${id}`);
  let newInput;

  if (tipo == 0) {
    newInput = $("<input>", {
      type: "text",
      id: oldInput.attr("id"),
      name: oldInput.attr("name"),
      class: oldInput.attr("class"),
      placeholder: `Inserisci il valore ${parseInt(id) + 1}`,
    });
  } else if (tipo == 1) {
    newInput = $("<input>", {
      type: "number",
      id: oldInput.attr("id"),
      name: oldInput.attr("name"),
      placeholder: `Inserisci il valore ${parseInt(id) + 1}`,
      class: oldInput.attr("class"),
    });
  } else if (tipo == 2) {
    creaCategoriale(id, oldInput);
    return;
  }
  oldInput.replaceWith(newInput);
});
