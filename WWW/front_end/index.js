// invia richiesta per prendere i dati delle tassonomie 
// ricevi i dati delle tassonomie 
// popola la tabella con i dati ottenuti 
// nome tassonomia + link per visualizzare la tassonomia con l'id in query string 


var templateRiga = `
    <tr>
        <td>
            {nome}
        </td>
        <td>
            <a href="/front_end/visualizzaTassonomia.html?id={id}" class="btn btn-outline-primary btn-sm" title="Visualizza">
                <i class="bi bi-eye"></i>
            </a>
        </td>
    </tr>
`;


let riga; 

$(document).ready(function () {
    $.get("/back_end/get_index.php", function (data) {
        
        var tassonomie = JSON.parse(data);
        
        $.each(tassonomie, function (_, tassonomia) { 
            riga = templateRiga
                .replace("{nome}", tassonomia.nome)
                .replace("{id}", tassonomia.id);
            $("#scelta_tassonomia").append(riga);
        });
      }, 'json');
});