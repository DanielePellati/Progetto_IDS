function getId() {
  var urlParamas = new URLSearchParams(window.location.search);
  var idTassonomia = urlParamas.get("idTassonomia");
  return idTassonomia;
}

$(document).ready(function () {
  const idTassonomia = getId();
  $("#indietro").attr("href", `visualizzaTassonomia.html?id=${idTassonomia}`);
});

function eliminaElemento(idVoce) {
  $.post(
    "../back_end/elimina_voceCategoria.php",
    { idVoce: idVoce },
    function (data) {
      if (data.esito == -2) {
        alert("Cancellazione impossibile. L'elemento è in uso");
      } else if (data.esito == -1) {
        alert("Elemento da cancellare non valido");
      }else if (data.esito == -3){
        alert("Errore nella cancellazione");
      }else{
        window.location.replace(window.location.href);
      }
    },
    "json"
  );
}

function creaTabella(categorie) {
  let tabella;

  categorie.forEach((categoria) => {
    bottoneElimina = `
  <button class="btn btn-outline-primary btn-sm" onclick = "eliminaElemento(${categoria.id})" title="Elimina" style="cursor: pointer;">
    <i class="bi bi-trash"></i>
  </button>
`;

    tabella += `
            <tr>
                <td> ${categoria.nome} </td> 
                <td> ${categoria.voce} </td>
                <td> ${bottoneElimina} </td>
        `;
  });

  $("#bodyTabCategoria").append(tabella);
}

const idTassonomia = getId();

$.get(
  "../back_end/get_tab_categorie.php",
  { idTassonomia: idTassonomia },
  function (data) {
    if (data.status == -1) {
      alert("Errore nel caricamente delle categorie");
    } else {
      creaTabella(data);
    }
  },
  "json"
);
