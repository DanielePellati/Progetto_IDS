function leggiValori(tipo, campo) {
  const valoriInseriti = $(`#campi${campo}`).find("input").length;
  let valori = [];

  for (i = 0; i < valoriInseriti; i++) {
    const valore = $(`#input-${tipo}-${i}`).val();
    if (valore.length != 0 && valore.length != undefined) {
      valori.push(valore);
    }
  }

  return valori;
}

function leggiInformazioniRadice(id) {
  let elemento;

  let nome = $("#nodoRadice").val();

  let attributi = leggiValori("attributo", "Attributi");
  let sinonimi = leggiValori("sinonimo", "Sinonimi");

  elemento = new Elemento(nome, attributi, sinonimi);
}

function salvaTassonomia() {
  // Gestione del submit del form

  // Recupera nome e descrizione della tassonomia
  const nomeTassonomia = $("#nomeTassonomia").val();
  const descTassonomia = $("#descTassonomia").val();
  
  
  let nome = $("#nodoRadice").val();
  if(nome.length == 0 || nome.length == undefined){
    const risposta = confirm("Sicuro di voler creare la radice senza darle un nome?");
    if(!risposta)
        return risposta;
  }



  if (nomeTassonomia.length == 0 || nomeTassonomia.length == undefined) {
    alert("Inserisci il nome");
    return;
  }

  $.post(
    "/back_end/creaTassonomia.php",
    { nome: nomeTassonomia, desc: descTassonomia },
    function (data) {
      risultato = leggiInformazioniRadice(parseInt(data));
      if(!risultato)
        return;
    },
    "text"
  );

  // Ripristina il modulo (svuota i campi di input)
  this.reset();
}

/// Funzione per creare dinamicamente i campi del form
function creaFormElemento(num, $container, tipo) {
  // Trova quanti input sono già presenti nel contenitore
  const currentFields = $container.find("input").length;

  // Aggiungi i nuovi campi se necessario
  for (let i = currentFields; i < num; i++) {
    // Crea il nuovo campo di input e aggiungilo al contenitore
    $container.append(`
      <div class="mb-2" id="${tipo}-${i}">
        <label for="${tipo}-${i}" class="form-label">Valore ${i + 1}</label>
        <input
          type="text"
          class="form-control"
          id="input-${tipo}-${i}"
          name="${tipo}-${i}"
          placeholder="Inserisci valore ${i + 1}"
        />
      </div>
    `);
  }

  // Rimuovi i campi in eccesso se il numero è stato ridotto
  for (let i = num; i < currentFields; i++) {
    $container.find(`#${tipo}-${i}`).remove();
  }
}

// Funzione per inizializzare il form con una riga di input di default
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

$(document).ready(function () {
  $("label[for='nomeTassonomia']").hover(
    function () {
      $(".messageNome").fadeIn();
    },
    function () {
      $(".messageNome").fadeOut();
    }
  );

  $("label[for='nodoRadice']").hover(
    function () {
      $(".messageRadice").fadeIn();
    },
    function () {
      $(".messageRadice").fadeOut();
    }
  );
});
