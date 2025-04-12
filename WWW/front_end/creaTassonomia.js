$(document).ready(function () {
  // Gestione del submit del form
  $("#form-tassonomia").on("submit", function (e) {
    // Previene il comportamento di default del submit (evita il refresh della pagina)
    e.preventDefault();

    // Recupera nome e descrizione della tassonomia
    const nomeTassonomia = $("#nomeTassonomia").val();
    const descTassonomia = $("#descTassonomia").val();

    if (nomeTassonomia.length == 0 || nomeTassonomia.length == undefined) {
      alert("Inserisci il nome");
      return;
    }

    // Recupera il valore inserito nel campo di input con id "numeroVoci"
    const numeroVoci = $("#numeroVoci").val();

    $.post(
      "/back_end/creaTassonomia.php",
      { nome: nomeTassonomia, desc: descTassonomia },
      function (data) { alert(data) },
      "dataType"
    );

    // Ripristina il modulo (svuota i campi di input)
    this.reset();
  });
});
