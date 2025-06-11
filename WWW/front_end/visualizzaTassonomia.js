// verrà utilizzato per leggere, dal query string, l'id della tassonomia

/**
 *  Passaggi:
 *      recupero l'id dal query string
 *      mando la richiesta per recuperare nome e descrizione
 *      mando la richiesta per recuperare i vari elementi
 *      ricostruisco la tassonomia in base agli id padre
 *
 *  uso un file file .php e passerò un secondo parametro (1, 2, 3) in base a cosa devo fare
 *  1 per recuperare nome e descrizione
 *  2 per gli elementi
 *  3 per controllare che non sia vuota
 */

let urlParamas = new URLSearchParams(window.location.search);
const id = urlParamas.get("id");

/**
 * sostituisciElemento
 * Passo le informazioni per sostituire l'elemento
 * @param {number} idElemento id dell'elemento da sostituire
 * @param {number} idTassonomia id della tassonomia a cui appartiene
 * @param {number} idPadre id del padre dell'elemento da sostituire
 * @returns {void}
 */
function sostituisciElemento(idElemento, idTassonomia, idPadre) {
  const $form = $("<form>", {
    method: "POST",
    action: "./sostituisciElemento.php",
  });

  $form.append(
    $("<input>", {
      type: "hidden",
      name: "idTassonomia",
      value: idTassonomia,
    })
  );

  $form.append(
    $("<input>", {
      type: "hidden",
      name: "idElemento",
      value: idElemento,
    })
  );

  $form.append(
    $("<input>", {
      type: "hidden",
      name: "idPadre",
      value: idPadre,
    })
  );

  $form.appendTo("body").submit();
}

/**
 * creaAlbero
 * Funzione che crea l'albero coi dati della tassonomia
 * @param {int} padreId id del padre (serve per i figli)
 * @param {Array} tassonomia tassonomia che andrà a riempire l'albero
 * @returns {jQuery} ritorna un pezzo di albero
 */
function creaAlbero(padreId, tassonomia) {
  let figli = tassonomia.filter((el) => el.id_padre === padreId);

  if (figli.length === 0) return "";

  let ul = $("<ul></ul>");
  figli.forEach((figlio) => {
    let li = $("<li></li>");
    if (tassonomia.some((el) => el.id_padre === figlio.id)) {
      // Nodo con figli
      let nodeCard = $(
        `<div class='node-card'><span class='toggle'>${figlio.nome}</span></div>`
      );
      let btn1 = $(
        `<button onclick="window.open ('visualizzaElemento.html?id_elemento=${figlio.id}', '_blank')" class='btn btn-primary btn-sm'>Visualizza</button>`
      );
      let btn2 = $(
        `<button onclick="sostituisciElemento(${figlio.id}, ${id}, ${figlio.id_padre})" class='btn btn-secondary btn-sm'>Sostituisci</button>`
      );
      let btn3 = $(
        `<button onclick = "aggiungiFiglio(${figlio.id})" class="btn btn-secondary btn-sm">Aggiungi figlio</button>`
      );
      let btn4 = $(
        `<button onclick = "rimuoviElemento(${figlio.id}, 1, ${id})" class="btn btn-secondary btn-sm">Rimuovi elemento</button>`
      );
      nodeCard.append(btn1, btn2, btn3, btn4);
      li.append(nodeCard);
      li.append(creaAlbero(figlio.id, tassonomia));
    } else {
      // Foglia senza figli
      let leafCard = $(
        `<div class='leaf-card'><span>${figlio.nome}</span></div>`
      );
      let btn1 = $(
        `<button onclick="window.open ('visualizzaElemento.html?id_elemento=${figlio.id}', '_blank')" class='btn btn-primary btn-sm'>Visualizza</button>`
      );
      let btn2 = $(
        `<button onclick="sostituisciElemento(${figlio.id},${id}, ${figlio.id_padre})" class='btn btn-secondary btn-sm'>Sostituisci</button>`
      );
      let btn3 = $(
        `<button onclick = "aggiungiFiglio(${figlio.id})" class="btn btn-secondary btn-sm">Aggiungi figlio</button>`
      );
      let btn4 = $(
        `<button onclick = "rimuoviElemento(${figlio.id}, 0,${id})" class="btn btn-secondary btn-sm">Rimuovi elemento</button>`
      );
      leafCard.append(btn1, btn2, btn3, btn4);
      li.append(leafCard);
    }
    ul.append(li);
  });

  return ul;
}

/**
 * popolaAlbero
 * Altro pezzo dalla costruzione dell'albero
 * @param {Array} tassonomia tassonomia che andrà a riempire l'albero
 * @returns {void}
 */
function popolaAlbero(tassonomia) {
  // Costruzione dell'albero partendo dalla radice
  let radice = tassonomia.find((el) => el.id_padre === null);
  if (radice) {
    let rootLi = $("<li></li>");
    let rootCard = $(
      `<div class='node-card'><span class='toggle'>${radice.nome}</span></div>`
    );
    let btn1 = $(
      `<button onclick="window.open ('visualizzaElemento.html?id_elemento=${radice.id}', '_blank')" class='btn btn-primary btn-sm'>Visualizza</button>`
    );
    let btn2 = $(
      `<button onclick=sostituisciElemento(${radice.id},${id},${radice.id_padre})  class='btn btn-secondary btn-sm'>Sostituisci</button>`
    );
    let btn3 = $(
      `<button onclick = "aggiungiFiglio(${radice.id})" class="btn btn-secondary btn-sm">Aggiungi figlio</button>`
    );
    let btn4 = $(
      `<button onclick = "rimuoviElemento(${radice.id}, 1, ${id})" class="btn btn-secondary btn-sm">Rimuovi elemento</button>`
    );
    rootCard.append(btn1, btn2, btn3, btn4);
    rootLi.append(rootCard);
    rootLi.append(creaAlbero(radice.id, tassonomia));
    $("#tree-container").append(rootLi);
  }
}

/**
 * getInfoTassonomia
 * Funzione che prendere le info della tassonomia
 * @param {number} id id della tassonomia di cui prendere le info
 * @returns {void}
 */
function getInfoTassonomia(id) {
  $.get(
    "/back_end/get_tassonomia.php",
    { id: id, func: 1 },
    function (data) {
      $("#titolo, #tassNome").html("Tassonomia: " + data.nome);
      $("#desc").html(data.descrizione);
    },
    "json"
  );
}

/**
 * getDatiTassonomia
 * Funzione che prendere i dati della tassonomia
 * @param {number} id id della tassonomia di cui prendere le info
 * @returns {void}
 */
function getDatiTassonomia(id) {
  $.get(
    "/back_end/get_tassonomia.php",
    { id: id, func: 2 },
    popolaAlbero,
    "json"
  );
}

/**
 * checkEmpty
 * Controlla se la tassonomia è vuota
 * @param {number} id ID della tassonomia
 * @param {function} callback Funzione chiamata al termine della richiesta, riceve in input il numero di elementi trovati
 * @returns {any}
 */

function checkEmpty(id, callback) {
  $.get(
    "/back_end/get_tassonomia.php",
    { id: id, func: 3 },
    function (data) {
      const nElementi = parseInt(data);
      callback(nElementi);
    },
    "text"
  );
}

/**
 * generaCreaRadice
 * Genere bottone per creare la radice (solo se tassonomia vuota)
 * @param {number} id id della tassonomia da generare
 * @returns {void}
 */
function generaCreaRadice(id) {
  var creaRadice = `
        <p>Tassonomia vuota</p>
        <form action="creaElemento.php" method="post">
            <input type="hidden" name="id" value=${id}>
            <input type="hidden" name="padre" value="">
            <button type="submit" >Aggiungi elemento </button>
        </form>        
    `;

  $("#tree-container").append(creaRadice);
}

$(document).ready(function () {
  getInfoTassonomia(id);

  checkEmpty(id, function (nElementi) {
    if (nElementi > 0) {
      getDatiTassonomia(id);
    } else {
      generaCreaRadice(id);
    }
  });
});

/**
 * aggiungiFiglio
 * Va sulla pagina di aggiunta del figlio passandogli i dati
 * @param {number} id_padre id del padre dell'elemento da aggiungere
 * @returns {void}
 */
function aggiungiFiglio(id_padre) {
  const id_tassonomia = id;

  const form = $("<form>", {
    method: "POST",
    action: "creaElemento.php",
  });

  $("<input>", {
    type: "hidden",
    name: "id",
    value: id_tassonomia,
  }).appendTo(form);

  $("<input>", {
    type: "hidden",
    name: "padre",
    value: id_padre,
  }).appendTo(form);

  form.appendTo("body").submit();
}

/**
 * rimuoviElemento
 * Funzione per eliminare un elemento
 * @param {number} id_elemento id dell'elemento da aggiungere
 * @param {boolean} isPadre indica se l'elemento è padre
 * @param {number} idTassonomia id della tassomomia in cui è contenuto l'elemento
 * @returns {}
 */
function rimuoviElemento(id_elemento, isPadre, idTassonomia) {
  let scelta;

  if (isPadre) {
    scelta = confirm(
      "Eliminando questo elemento, eliminerai anche i suoi figli. Confermi?"
    );
  }

  if (!scelta && isPadre) {
    alert("Eliminazione annullata");
  }

  // Inizio fase di eliminazione
  $.post(
    "../back_end/rimuovi_elemento.php",
    { id_elemento: id_elemento, isPadre: isPadre },
    function (data) {
      if (data.success) {
        // Reload forzato con cache bypass
        window.location.href = window.location.pathname + `?id=${idTassonomia}`;
      } else {
        alert("Errore nella cancellazione");
      }
    },
    "json"
  );
}

$(document).ready(function () {
  var urlParamas = new URLSearchParams(window.location.search);
  var id = urlParamas.get("id");

  $("#mostraCategorie").attr(
    "href",
    `./tabellaCategorie.html?idTassonomia=${id}`
  );
  $("#inserisciCategoria").attr(
    "href",
    `./creaCategoria.html?idTassonomia=${id}`
  );
  $("#nomiPrecedenti").attr("href", `./nomiPrecedenti.html?idTassonomia=${id}`);
});

$(document).ready(function () {
  if (!id) {
    alert("Errore: id non valido");
    window.location.href = "../index.php";
  }

  $.get(
    "../back_end/get_tassonomia.php",
    { id: id, func: 1 },
    function (data) {
      if (data.risultato == -1) {
        alert("Errore");
        window.location.href = "../index.php";
      } else {
        $("title").text(data.nome);
      }
    },
    "json"
  );
});
