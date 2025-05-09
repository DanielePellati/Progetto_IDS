function salvaTassonomia(){
    // Recupera nome e descrizione della tassonomia
    const nomeTassonomia = $("#nomeTassonomia").val();
    const descTassonomia = $("#descTassonomia").val();

    if (nomeTassonomia.length == 0 || nomeTassonomia.length == undefined) {
      $('#result').html(`
        <div class="alert alert-danger" role="alert">
            Inserisci correttamente tutti i campi.
        </div>
    `);
      return;
    }

    $.post(
      "/back_end/creaTassonomia.php",
      { nome: nomeTassonomia, desc: descTassonomia },
      function (data) {
        id = parseInt(data);
        window.location.href =`../index.php`
      },
      "text"
    );
}

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
