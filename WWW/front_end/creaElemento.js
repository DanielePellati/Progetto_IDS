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
            class="form-control form-${tipo}"
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
  $("#numeroAttributi").on("input", function () {
    const num = parseInt($("#numeroAttributi").val()) || 0; // Ottieni il numero di campi da visualizzare
    creaFormElemento(num, $containerAttributi, "attributo"); // Aggiungi o rimuovi campi in base al numero
  });

  creaFormElemento(numDefaultFields, $containerSinonimi, "sinonimo");

  $("#numeroSinonimi").on("input", function () {
    const num2 = parseInt($("#numeroSinonimi").val()) || 0;
    creaFormElemento(num2, $containerSinonimi, "sinonimo");
  });
});

// crea le option per scegliere la categoria
function creaOpzioniSelect(data, strOpzioni) {
  data.forEach((elemento) => {
    strOpzioni += `
    <option value = ${elemento.id}> ${elemento.nome}</option>
    `;
  });

  return strOpzioni;
}

// crea le option per scegliere l'elemento di una categoria
function creaOpzioniCategoria(data, strOpzioni) {
  data.forEach((elemento) => {
    strOpzioni += `
    <option value = ${elemento.id}> ${elemento.voce}</option>
    `;
  });

  return strOpzioni;
}

// crea l'elenco di select per scegliere il categoriale
function creaCategoriale(idElemento, oldInput) {
  var divCategoriale = $("<div>", {
    id: `div-attributo-${idElemento}`,
  });

  var selectCategoriale = $("<select>", {
    class: "form-select sceltaCategoria",
    id: `input-attributo-${idElemento}`,
    name: `attributo-${idElemento}`,
  });

  var opzioniSelect = "<option value = 0>Scegli categoria</option>";

  $.get(
    "../back_end/get_categorie.php",
    { id_tassonomia: id_tassonomia, scelta: 0 },
    function (data) {
      opzioniSelect = creaOpzioniSelect(data, opzioniSelect);
      selectCategoriale.html(opzioniSelect); // imposta le option
      divCategoriale.html(selectCategoriale.prop("outerHTML")); // inserisce l'intero select
      oldInput.replaceWith(divCategoriale);
    },
    "json"
  );
}

// ottiene e poi stampa a schermo le informazioni delle categorie
function getInfoCategoria(idCategoria, idElemento) {
  $.get(
    "../back_end/get_categorie.php",
    { id_tassonomia: id_tassonomia, id_categoria: idCategoria, scelta: 1 },
    function (data) {
      var divCategoriale = $(`#div-attributo-${idElemento}`);
      var selectCategoria = $("<select>", {
        class: "form-select form-attributo",
        id: `input-categoria-${idElemento}`,
        name: `input-categoria-${idElemento}`,
      });

      var opzioniSelect = "<option value = 0>Scegli elemento</option>";
      opzioniSelect = creaOpzioniCategoria(data, opzioniSelect);
      selectCategoria.html(opzioniSelect); // imposta le option
      divCategoriale.append(selectCategoria.prop("outerHTML")); // inserisce l'intero select
    },
    "json"
  );
}

// in base alla scelta della categoria, faccio scegliere all'utente l'elemento
$(document).on("change", ".sceltaCategoria", function () {
  let idCategoria = $(this).val();
  let idElemento = $(this).attr("id").split("-")[2];

  $(`#input-categoria-${idElemento}`).remove();

  if (idCategoria > 0) {
    getInfoCategoria(idCategoria, idElemento);
  }
});

// in base alla scelta, aggiorna l'input (stringa, numero e categoriale)
$(document).on("change", ".sceltaAttributo", function () {
  let id = $(this).attr("id").split("-")[2];

  $(`#input-categoria-${id}`).remove();

  const tipo = parseInt($(this).val());
  let oldInput = $(`#input-attributo-${id}`);
  let newInput;

  if (tipo == 0) {
    newInput = $("<input>", {
      type: "text",
      id: oldInput.attr("id"),
      name: oldInput.attr("name"),
      class: "form-control form-attributo",
      placeholder: `Inserisci il valore ${parseInt(id) + 1}`,
    });
  } else if (tipo == 1) {
    newInput = $("<input>", {
      type: "number",
      id: oldInput.attr("id"),
      name: oldInput.attr("name"),
      placeholder: `Inserisci il valore ${parseInt(id) + 1}`,
      class: "form-control form-sinonimo",
    });
  } else if (tipo == 2) {
    creaCategoriale(id, oldInput);
    return;
  }
  oldInput.replaceWith(newInput);
});

// quando l'utente passa col mouse sul form apparirà in rosso la scritta "campo obbligatorio"
$("label[for='nomeElemento']").hover(
  function () {
    $(".messageRadice").fadeIn();
  },
  function () {
    $(".messageRadice").fadeOut();
  }
);

// legge tutti gli attributi per ottenere la lista
function getListaAttributi() {
  let listaAttributi = [];
  let attributo;
  let valore, tipo;
  let numAttributi = $("#numeroAttributi").val();
  let input;

  // ottengo la lista partendo da interi e stringhe
  for (let i = 0; i < numAttributi; i++) {
    input = $(`#input-attributo-${i}`);

    tipo = input.attr("type");
    if (tipo === "text" || tipo === "number") {
      tipo = tipo === "text" ? 0 : tipo === "number" ? 1 : tipo;
      valore = input.val();
      if (valore != undefined && valore.length != 0) {
        attributo = new Attributo(valore, tipo);
        listaAttributi.push(attributo);
      }
    }
  }

  for (let i = 0; i < numAttributi; i++) {
    input = $(`#input-categoria-${i}`);

    if (input.val() != 0 && input.val() != undefined) {
      valore = input.val();
      attributo = new Attributo(valore, 2);
      listaAttributi.push(attributo);
    }
  }

  return listaAttributi;
}

function getListaSinonimi() {
  let listaSinonimi = [];
  let numSinonimi = $("#numeroSinonimi").val();
  let inputSinonimo;

  for (let i = 0; i < numSinonimi; i++) {
    inputSinonimo = $(`#input-sinonimo-${i}`);
    if (inputSinonimo.val() != undefined && inputSinonimo.val().length != 0) {
      listaSinonimi.push(inputSinonimo.val());
    }
  }
  return listaSinonimi;
}

// aggiunge al DB gli attributi agli elementi
function aggiungiAttributi(listaAttributi, idElemento) {
  $.post(
    "../back_end/set_elemento.php",
    {
      listaAttributi: JSON.stringify(listaAttributi),
      idElemento: idElemento,
      scelta: 2,
    },
    function (data) {
      if (data == -1) {
        alert("Errore nell'aggiunta degli attributi");
      }
    }
  );
}

function aggiungiSinonimi(listaSinonimi, idTassonomia, idElemento) {
  $.post(
    "../back_end/set_elemento.php",
    {
      listaSinonimi: JSON.stringify(listaSinonimi),
      idTassonomia: idTassonomia,
      idPadre: padre,
      idElemento: idElemento,
      scelta: 3
    },
    function (data, textStatus, jqXHR) {
      
    },
    
  );
}

// entro in questa funzione se è stato cliccato "salva elemento"
function salvaElemento() {
  const nomeElemento = $("#nomeElemento").val();
  let listaAttributi = [];
  let listaSinonimi = [];

  if (nomeElemento.length == 0 || nomeElemento.length == undefined) {
    alert("Il campo 'nome' è obbligatorio");
  } else {
    listaAttributi = getListaAttributi();
    listaSinonimi = getListaSinonimi();

    $.post(
      "../back_end/set_elemento.php",
      {
        nomeElemento: nomeElemento,
        idPadre: padre,
        idTassonomia: id_tassonomia,
        scelta: 1,
      },
      function (idElemento) {
        if (idElemento != -1) {
          
          aggiungiAttributi(listaAttributi, idElemento);
          aggiungiSinonimi(listaSinonimi, id_tassonomia, idElemento);

          window.location.replace(
            `./visualizzaElemento.html?id_elemento=${idElemento}`
          );
        } else {
          alert("Errore");
        }
      }
    );
  }
}
