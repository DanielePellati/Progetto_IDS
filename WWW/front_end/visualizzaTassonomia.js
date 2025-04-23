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
var id = urlParamas.get("id");

function creaAlbero(padreId, tassonomia) {
  let figli = tassonomia.filter(el => el.id_padre === padreId);

  if (figli.length === 0) return '';

  let ul = $("<ul></ul>");
  figli.forEach(figlio => {
      let li = $("<li></li>");
      if (tassonomia.some(el => el.id_padre === figlio.id)) {
          // Nodo con figli
          let nodeCard = $(`<div class='node-card'><span class='toggle'>${figlio.nome}</span></div>`);
          let btn1 = $(`<button onclick="window.open ('visualizzaElemento.html?id_elemento=${figlio.id}', '_blank')" class='btn btn-primary btn-sm'>Visualizza</button>`);
          let btn2 = $("<button class='btn btn-secondary btn-sm'>Modifica</button>");
          let btn3 = $(`<button onclick = "aggiungiFiglio(${figlio.id})" class="btn btn-secondary btn-sm">Aggiungi figlio</button>`)
          nodeCard.append(btn1, btn2, btn3);
          li.append(nodeCard);
          li.append(creaAlbero(figlio.id, tassonomia));
      } else {
          // Foglia senza figli
          let leafCard = $(`<div class='leaf-card'><span>${figlio.nome}</span></div>`);
          let btn1 = $(`<button onclick="window.open ('visualizzaElemento.html?id_elemento=${figlio.id}', '_blank')" class='btn btn-primary btn-sm'>Visualizza</button>`);
          let btn2 = $("<button class='btn btn-secondary btn-sm'>Modifica</button>");
          let btn3 = $(`<button onclick = "aggiungiFiglio(${figlio.id})" class="btn btn-secondary btn-sm">Aggiungi figlio</button>`)
          leafCard.append(btn1, btn2, btn3);
          li.append(leafCard);
      }
      ul.append(li);
  });

  return ul;
}

function popolaAlbero(tassonomia){
      // Costruzione dell'albero partendo dalla radice
      let radice = tassonomia.find(el => el.id_padre === null);
      if (radice) {
          let rootLi = $("<li></li>");
          let rootCard = $(`<div class='node-card'><span class='toggle'>${radice.nome}</span></div>`);
          let btn1 = $(`<button onclick="window.open ('visualizzaElemento.html?id_elemento=${radice.id}', '_blank')" class='btn btn-primary btn-sm'>Visualizza</button>`);
          let btn2 = $("<button class='btn btn-secondary btn-sm'>Modifica</button>");
          let btn3 = $(`<button onclick = "aggiungiFiglio(${radice.id})" class="btn btn-secondary btn-sm">Aggiungi figlio</button>`)
          rootCard.append(btn1, btn2, btn3);
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

function checkEmpty(id, callback){
    $.get(
        "/back_end/get_tassonomia.php",
        { id: id, func: 3 },
        function(data){
            const nElementi = parseInt(data);
            callback(nElementi);
        },
        "text"
    );
}

function generaCreaRadice(id){
    
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
    checkEmpty(id, function(nElementi){
        if(nElementi > 0){
            getInfoTassonomia(id);
            getDatiTassonomia(id);
        }
        else{
            generaCreaRadice(id);
        }
    });
});

function aggiungiFiglio(id_padre){
    const id_tassonomia = id;
    
    const form = $('<form>',{

        method: 'POST',
        action: 'creaElemento.php'
    });

    $('<input>', {
        type: 'hidden',
        name: 'id',
        value: id_tassonomia
    }).appendTo(form);

    $('<input>', {
        type: 'hidden',
        name: 'padre',
        value: id_padre
    }).appendTo(form);

    form.appendTo('body').submit();
}

$(document).ready(function () {
    $("#mostraCategorie").attr('href', `./mostraCategorie.html?idTassonomia=${id}`);
});
