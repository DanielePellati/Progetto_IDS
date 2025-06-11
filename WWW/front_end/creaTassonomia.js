/**
 * salvaTassonomia
 * Invia la richiesta al server per salvare la tassonomia
 * @returns {void}
 */
function salvaTassonomia() {
  // Recupera nome e descrizione della tassonomia
  const nomeTassonomia = $("#nomeTassonomia").val();
  const descTassonomia = $("#descTassonomia").val();

  // Se il nome non viene inserito, stampo l'errore e fermo la procedura di inserimento
  if (nomeTassonomia.length == 0 || nomeTassonomia.length == undefined) {
    alert("Il nome è obbligatorio.");
    return;
  }

  // Richiesta in post alla pagina per aggiungere la tassonomia
  $.post(
    "/back_end/creaTassonomia.php",
    { nome: nomeTassonomia, desc: descTassonomia }, // gli passo nome e descrizione
    function (data) {
      if (data == -1) {
        // Se stampa -1, significa che c'è stato un problema
        alert("Errore nell'inserimento della tassonomia"); // Avverto
      } else {
        id = parseInt(data);
        window.location.href = `../index.php`; // ritorno alla homepage
      }
    },
    "text"
  );
}

// Questo serve a stampare il messaggio rosso quando l'utente passa col mouse su "Nome della tassonomia"
$(document).ready(function () {
  $("label[for='nomeTassonomia']").hover(
    function () {
      $(".messageNome").fadeIn();
    },
    function () {
      $(".messageNome").fadeOut();
    }
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
