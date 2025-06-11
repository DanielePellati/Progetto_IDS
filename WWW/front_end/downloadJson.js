/**
 * getTassonomia
 * Funzione asincrona che, dato un ID di tassonomia, esegue una chiamata AJAX GET
 * per recuperare i dati della tassonomia (nome, descrizione, ecc.) dal backend.
 * Restituisce una Promise che risolve con i dati in formato JSON.
 * @param {number} idTassonomia id della tassonomia da ottenere
 * @returns {Object} risultati della chiamata in JSON. 
 */
async function getTassonomia(idTassonomia) {
  return await $.get(
    "../back_end/get_tassonomia.php", // URL della risorsa PHP che gestisce la richiesta
    { id: idTassonomia, func: 1 }, // Parametri inviati: id della tassonomia e flag funzione
    "json" // Tipo di dato atteso come risposta
  );
}

/**
 * getElementi
 * Funzione asincrona che recupera la lista degli elementi associati alla tassonomia
 * tramite chiamata AJAX GET al backend, usando l'id tassonomia e un flag funzione diverso.
 * Restituisce una Promise con la lista degli elementi in JSON.
 * @param {number} idTassonomia id della tassonomia di cui voglio gli elementi
 * @returns {Object} risultati della chiamata in JSON. 
 */
async function getElementi(idTassonomia) {
  return await $.get(
    "../back_end/get_tassonomia.php", // Stesso endpoint, ma flag funzione diverso per distinguere l'operazione
    { id: idTassonomia, func: 2 },
    "json"
  );
}

/**
 * getAttributiElemento
 * Funzione asincrona che, dato l'id di un elemento, richiede al backend gli attributi di quell'elemento.
 * Utilizza un endpoint diverso ("get_elemento.php") con parametro scelta=1 per richiedere gli attributi.
 * Restituisce una Promise che risolve con gli attributi in formato JSON.
 * @param {number} idTassonomia
 * @returns {void}
 */
async function getAttributiElemento(idElemento) {
  return await $.get(
    "../back_end/get_elemento.php",
    { id: idElemento, scelta: 1 },
    "json"
  );
}

/**
 * getSinonimiElementi
 * Funzione che richiede i sinonimi degli elementi
 * @param {number} idElemento id dell'elemento principale così da avere sinonimi
 * @returns {Object} risultati della chiamata in JSON. 
 */
async function getSinonimiElementi(idElemento) {
  return await $.get(
    "../back_end/get_elemento.php",
    { id: idElemento, scelta: 3 },
    "json"
  );
}

/**
 * getNomiPrecedenti
 * Funzione che richiede i nomi precedenti
 * @param {number} idElemento
 * @returns {Object} risultati della chiamata in JSON. 
 */
async function getNomiPrecedenti(idElemento) {
  return await $.get(
    "../back_end/get_elemento.php",
    { id: idElemento, scelta: 2 },
    "json"
  );
}

/**
 * creaJSON
 * Funzione principale asincrona che coordina la costruzione del modello dati JSON
 * partendo dall'id della tassonomia.
 * La funzione crea un oggetto tassonomia e una lista di elementi con i loro attributi associati.
 * @param {number} idTassonomia
 * @returns {void} 
 */
async function creaJSON(idTassonomia) {
  // Crea un nuovo oggetto Tassonomia (presumibilmente definito altrove nel codice)
  var tassonomia = new Tassonomia();

  // Richiede e attende i dati della tassonomia dal backend
  const datiTassonomia = await getTassonomia(idTassonomia);
  // Assegna nome e descrizione all'oggetto tassonomia
  tassonomia.nome = datiTassonomia.nome;
  tassonomia.descrizione = datiTassonomia.descrizione;

  // Richiede e attende la lista degli elementi associati alla tassonomia
  const datiElementi = await getElementi(idTassonomia);

  // Mappa ogni dato elemento ricevuto dal backend in un nuovo oggetto Elemento
  // con id, nome e riferimento all'id del padre (idPadre)
  const listaElementi = datiElementi.map((d) => {
    let elemento = new Elemento();
    elemento.id = d.id;
    elemento.nome = d.nome;
    elemento.idPadre = d.id_padre;
    return elemento;
  });

  // Per ogni elemento nella lista, esegue una chiamata asincrona per ottenere gli attributi associati
  for (let elemento of listaElementi) {
    // Attende la risposta con gli attributi per l'elemento corrente
    let attributi = await getAttributiElemento(elemento.id);

    // Definisce una lista di tipi fissi utilizzata per convertire il tipo numerico in stringa
    const tipi = ["stringa", "intero", "categoriale"];
    // Per ogni attributo ricevuto, crea un nuovo oggetto Attributo con valore e tipo tradotto
    elemento.listaAttributi = attributi.map(
      (attr) => new Attributo(attr.valore, tipi[attr.tipo] ?? attr.tipo)
    );
  }

  for (let elemento of listaElementi) {
    let sinonimi = (await getSinonimiElementi(elemento.id)) || []; // fallback se ritorna null
    let l_sinonimi = sinonimi
      .filter((s) => s && s.nome && s.nome.trim() !== "")
      .map((s) => s.nome);

    if (l_sinonimi.length > 0) {
      elemento.listaSinonimi = l_sinonimi;
    }
  }

  for (let elemento of listaElementi) {
    let nomiPrecedenti = (await getNomiPrecedenti(elemento.id)) || [];

    elemento.listaNomiPrecedenti = nomiPrecedenti.map(
      (np) => new NomePrecedente(np.nome_precedente, np.data)
    );
  }

  // aggiungo la lista degli elementi alla tassonomia
  tassonomia._listaElementi = listaElementi;

  const jsonString = JSON.stringify(tassonomia, null, 2); // Il tuo JSON formattato

  // Creo un blob con il contenuto JSON
  const blob = new Blob([jsonString], { type: "application/json" });

  // Creo un URL temporaneo per il blob
  const url = URL.createObjectURL(blob);

  // Creo un elemento <a> invisibile per il download
  const a = document.createElement("a");
  a.href = url;
  a.download = `${tassonomia.nome.toLowerCase()}.json`; // nome del file da scaricare

  // Simulo il click sul link per far partire il download
  a.click();

  // Rilascio l'URL creato per liberare memoria
  URL.revokeObjectURL(url);
}
