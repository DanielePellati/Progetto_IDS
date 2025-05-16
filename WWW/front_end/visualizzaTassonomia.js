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

function getDatiTassonomia(id) {
  $.get(
    "/back_end/get_tassonomia.php",
    { id: id, func: 2 },
    popolaAlbero,
    "json"
  );
}

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
  checkEmpty(id, function (nElementi) {
    if (nElementi > 0) {
      getInfoTassonomia(id);
      getDatiTassonomia(id);
    } else {
      generaCreaRadice(id);
    }
  });
});

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
});
