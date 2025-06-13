/**
 * getId
 * Legge e ritorna l'id passato in GET e letto dal querystring.
 * @returns {number} id passato in GET e letto dal querystring
 */
function getId() {
  var urlParamas = new URLSearchParams(window.location.search);
  var idTassonomia = urlParamas.get("idTassonomia");
  return idTassonomia;
}

$(document).ready(function () {
  const idTassonomia = getId();
  $("#indietro").attr("href", `visualizzaTassonomia.html?id=${idTassonomia}`);
});

/**
 * eliminaCategoria
 * Richiedo l'eliminazione della categoria
 * @param {number} idCategoria id della categoria da eliminare
 * @returns {void}
 */
function eliminaCategoria(idCategoria) {
  // Inizio prendendo gli id di tutti gli elementi di una categoria
  // Controllo che non siano nella tabella valore
  // Se lo sono: blocco l'eliminazione.
  // Se non lo sono: procedo all'eliminazione

  $.post(
    "../back_end/rimuovi_categoria.php",
    { idCategoria: idCategoria },
    function (data) {
      if (data.risultato == -1) alert("Errore: categoria non valida");
      else if (data.risultato == -2) alert("Errore nella ricerca degli ids");
      else if (data.risultato == -3)
        alert("Errore nel controllo della categoria");
      else if (data.risultato == -4)
        alert(
          "Impossibile cancellare la categoria: almeno un elemento è in uso"
        );
      else if (data.risultato == -5) alert("Errore nella cancellazione");
      else if(data.risultato == 0){
        $(`#cat-${idCategoria}`).remove();
      }
    },
    "json"
  );
}

/**
 * creaTabella
 * Creo e stampo la tabella con le categorie
 * @param {Object[]} categorie array la lista delle categorie
 * @returns {void}
 */
function creaTabella(categorie) {
  let tabella;
  let bottoneElimina;
  let bottoneVisualizza;

  categorie.forEach((categoria) => {
    bottoneVisualizza = `
    <a 
      class = "btn btn-outline-primary btn-sm" 
      href="visualizzaCategoria.html?idCategoria=${categoria.id}" 
      title="visualizza"
      >
      <i class="bi bi-eye"></i>
      </a>
    `;

    bottoneElimina = `<button class="btn btn-outline-primary btn-sm" onclick = "eliminaCategoria(${categoria.id})" title="Elimina" style="cursor: pointer;">
    <i class="bi bi-trash"></i>
  </button>
`;

    tabella += `
            <tr id = "cat-${categoria.id}">
                <td> ${categoria.nome} </td> 
                <td> ${bottoneVisualizza} </td>
                <td> ${bottoneElimina} </td>
        `;
  });

  $("#bodyTabCategoria").append(tabella);
}

const idTassonomia = getId();

/**
 * stampaErrore
 * Stampa l'errore e ritorna all'index
 * @returns {void}
 */
function stampaErrore() {
  alert("Errore nel caricamente delle categorie");
  window.location.href = "../index.php";
}

$.get(
  "../back_end/get_tab_categorie.php",
  { idTassonomia: idTassonomia },
  function (data) {
    if (data.status == -1) {
      stampaErrore();
    } else {
      creaTabella(data);
    }
  },
  "json"
);
