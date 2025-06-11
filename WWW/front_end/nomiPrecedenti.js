/**
 * getId
 * Legge dal query string l'id passato e lo ritorna
 * @returns {number} ritorno l'id
 */
function getId() {
  // legge e ritorna l'id passato in get e letto dal querystring
  let urlParamas = new URLSearchParams(window.location.search);
  return parseInt(urlParamas.get("idTassonomia"));
}


// Quando viene caricata la pagina, aggiorno il bottone per tornare alla tassonomia
$(document).ready(function () {
    const id = getId();
    $("#indietro").attr("href", `./visualizzaTassonomia.html?id=${id}`);
});

/**
 * creaRiga
 * Creo la riga da mettere nella tabella per visualizzare i nomi precedenti 
 * @param {any} nomePrecedente
 * @returns {string} riga da mettere poi nell'html
 */
function creaRiga(nomePrecedente){

// Se c'è il nome precedente, uso quello ma in caso contrario specifico che l'elemento è stato eliminato
nomePrecedente.nome_elemento = nomePrecedente.nome_elemento == null 
  ? "<i>Elemento eliminato</i>" // <i/> i perché voglio che la scritta "Elemento eliminato" sia in corsivo
  : nomePrecedente.nome_elemento;


    // Creo e restituisco la riga
    return rigaTabella = `

        <tr>
            <td>${nomePrecedente.nome_precedente}</td>
            <td>${nomePrecedente.nome_elemento}</td>
            <td>${nomePrecedente.data_modifica}</td>
        </tr>
    `;

}



/**
 * popolaTabella
 * Si occupa di popolare la tabella
 * @param {String[]} nomiPrecedenti array con i nomi precedenti
 * @returns {void}
 */
function popolaTabella(nomiPrecedenti){

    // Stringa che conterrà tutte le righe
    let righeTabella = "";

    // Con un for su tutti i nomi precedenti, creo le varie righe
    nomiPrecedenti.forEach(nomePrecedente => {
        righeTabella += creaRiga(nomePrecedente);
    });

    // Stampo le righe
    $("#bodyTabNomiPrecedenti").append(righeTabella);

}

/**
 * stampaErrore
 * Stampa l'errore e ritorna all'index
 * @returns {void}
 */
function stampaErrore() {
  alert("Errore: id non valido");
  window.location.href = "../index.php";
}


$(document).ready(function () {

    // Prendo l'id
    const id = getId();

    // Richiedo tramite il metodo GET i nomi precedenti passando l'id della tassonomia.
    $.get("../back_end/get_nomi_precedenti.php", {idTassonomia: id},
        function (data) {
            if(data.esito == 1){
                popolaTabella(data.nomiPrecedenti);
            }else{
                stampaErrore();
            }
        },
        "json"
    );
});
