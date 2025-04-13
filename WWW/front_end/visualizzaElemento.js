let urlParamas = new URLSearchParams(window.location.search);
var id = urlParamas.get("id_elemento");


/**
 * Description
 * 
 * @typedef {string} Categoriale - Valore categoriale
 * 
 * @typedef {Object} Attributo
 * @property {int | string | Categoriale} Attributo
 * @param {Array <Attributo>} data - L'Array conteiene tutti gli attributi dell'elemento di cui si sta leggendo la scheda
 * 
 */
function popolaTabellaValori(data) {
    // Tag di apertura per la tabella 
    let strTagApertura = `
    <div class="mb-5">
      <h3>Valori</h3>
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
            <tr>
              <th>Valore</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
    `;

    // Tag di chiusura per la tabella
    let strTagChiusura = `
          </tbody>
        </table>
      </div>
    </div>
    `;


    let rigaTabella = "";

    data.forEach(valore => {
        rigaTabella += `
        
            <tr>
                <td>${valore.valore}</td>
                <td>${valore.tipo}</td>
            </tr>
        `
    });

    let tabella = strTagApertura + rigaTabella + strTagChiusura;

    $(".valori").append(tabella);
}

function popolaTabellaNomiPrecedenti(data) {

    let strTagApertura = `
    
    <div class="mb-5">
      <h3>Nomi precedenti</h3>
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
            <tr>
              <th>Nome precedente</th>
              <th>Data modifica</th>
            </tr>
          </thead>
          <tbody>        
    `;

    // Tag di chiusura per la tabella
    let strTagChiusura = `
          </tbody>
        </table>
      </div>
    </div>
    `;

    let rigaTabella= "";
    
    data.forEach(elemento => {
        rigaTabella += `
        
            <tr>
                <td>${elemento.nome_precedente}</td>
                <td>${elemento.data}</td>
            </tr>            
        `;
    });


    let tabella = strTagApertura + rigaTabella + strTagChiusura;

    $(".nomi_precedenti").append(tabella);

}

function popolaTabellaSinonimi(data) {
    

    let strTagApertura = `
    
    <div class="mb-5">
      <h3>Sinonimi</h3>
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
            <tr>
              <th>Nome sinonimo</th>
            </tr>
          </thead>
          <tbody>        
    `;

    // Tag di chiusura per la tabella
    let strTagChiusura = `
          </tbody>
        </table>
      </div>
    </div>
    `;    
    
    let rigaTabella= "";

    data.forEach(sinonimo => {

        // <a href = 'visualizzaElemento?id_elemento=${sinonimo.id}'>

        rigaTabella += `
        
        <tr>
            <td>${sinonimo.nome}</td>
        </tr>            
    `;
    });

    let tabella = strTagApertura + rigaTabella + strTagChiusura;
    $(".sinonimi").append(tabella);

}

function popolaTabellaValoriPrecedenti(data) {

    let strTagApertura = `
    <div class="mb-5">
      <h3>Attributi precedenti</h3>
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
            <tr>
              <th>Valore precedente</th>
              <th>Valore attuale</th>
              <th>Tipo Precedente </th>              
              <th>Data modifica</th>
            </tr>    
          </thead>
          <tbody>   
    `
  
    // Tag di chiusura per la tabella
    let strTagChiusura = `
          </tbody>
        </table>
      </div>
    </div>
    `;  

  let rigaTabella = "";

  data.forEach(valori_precedenti => {
      rigaTabella += `
      
        <tr>
          <td>${valori_precedenti.valore_precedente}</td>
          <td>${valori_precedenti.valore_attuale}</td>
          <td>${valori_precedenti.tipo_precedente}</td>
          <td>${valori_precedenti.data_modifica}</td>
        </tr>
      `
  });

  let tabella = strTagApertura + rigaTabella + strTagChiusura;
  $(".valori_precedenti").append(tabella);


}


/**
 * Description
 * @param {Array} data - array che può contenere valori degli attributi, nomi precedenti, sinonimi, attributi precedenti 
 * @param {int} sceltaTabella - valore che permette di capire quale funzione chiamare, così da popolare ogni volta la tabella corretta
 */
function creaTabella(data, sceltaTabella) {

    switch (sceltaTabella) {
        case 1: // tabella valori
            popolaTabellaValori(data);
            break;
        case 2: 
            popolaTabellaNomiPrecedenti(data);
            break;
        case 3: 
            popolaTabellaSinonimi(data);
            break;
        case 4: 
            popolaTabellaValoriPrecedenti(data);
            break;
        default:
            break;
    }
}

function creaIntestazione(data){
  var dataSplitted = data.split(",");
  $(".nome_elemento").html(dataSplitted[0]);
  $("#indietro").attr("href", `visualizzaTassonomia.html?id=${dataSplitted[1]}`);
}


/**
 * Description
 * @param {int} id - id dell'elemento. Serve per la query
 * 
 */
function getValori(id){

    $.get("/back_end/get_elemento.php",
        {id: id, scelta: 0},
        function(data){
            creaIntestazione(data);
        },
    );

    $.get("/back_end/get_elemento.php",
        {id: id, scelta: 1},
        function(data){
            creaTabella(data, 1);
        },
        "json"
    );

    $.get("/back_end/get_elemento.php", {id: id, scelta: 2},
        function (data) {
            creaTabella(data, 2);
        },
        "json"
    );

    $.get("/back_end/get_elemento.php", {id: id, scelta: 3},
        function (data) {
            creaTabella(data, 3);
        },
        "json"
    );


    $.get("/back_end/get_elemento.php", {id: id, scelta: 4},
      function (data) {
          creaTabella(data, 4);
      },
      "json"
  );
}

$(document).ready(function () {
    getValori(id);
});