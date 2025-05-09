<?php

require_once("./connetti_database.php");

/**
 * Ottiene la lista di tutti i discendenti (figli, nipoti, ecc.) di un elemento
 * includendo anche se stesso, tramite una query ricorsiva.
 *
 * @param PDO $pdo Istanza della connessione al database
 * @param int $idElemento ID dell'elemento radice
 * @return array|false Array di ID dei discendenti o false in caso di errore
 */
function getListaFigli($pdo, $idElemento)
{
    $query = "
    WITH RECURSIVE discendenti AS (
        SELECT id
        FROM elemento
        WHERE id = :idElemento
        UNION ALL
        SELECT e.id
        FROM elemento e
        JOIN discendenti d ON e.id_padre = d.id
    )
    SELECT id FROM discendenti
    UNION
    SELECT sinonimi.sinonimo FROM sinonimi
    WHERE sinonimi.principale = :idElemento;
    ";

    // Prepara ed esegue la query ricorsiva
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":idElemento", $idElemento, PDO::PARAM_INT);

    if (!$stmt->execute())
        return -1;

    // Ritorna un array semplice contenente solo gli ID
    return array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'id');
}

/**
 * Filtra dalla lista di ID gli elementi che sono sinonimi, mantenendo solo quelli principali.
 *
 * @param PDO $pdo Istanza della connessione al database
 * @param array $listaIDs Lista di ID da filtrare
 * @return array|false Lista di ID principali (non sinonimi), oppure false in caso di errore
 */
function filtraSinonimi($pdo, $listaIDs)
{
    if (empty($listaIDs))
        return [];

    // Crea i segnaposto dinamici per la clausola IN
    $placeholders = implode(',', array_map(fn($i) => ":id$i", array_keys($listaIDs)));

    $query = "
        SELECT id FROM elemento
        WHERE id IN ($placeholders)
        AND id NOT IN (
            SELECT sinonimo FROM sinonimi
        );
    ";

    $stmt = $pdo->prepare($query);

    // Associa ogni ID al rispettivo placeholder
    foreach ($listaIDs as $k => $id) {
        $stmt->bindValue(":id$k", $id, PDO::PARAM_INT);
    }

    if (!$stmt->execute())
        return -1;

    return array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'id');
}

/**
 * Ottiene l'elenco degli ID dei valori associati agli elementi forniti.
 *
 * @param PDO $pdo Istanza della connessione al database
 * @param array $listaIDsPrincipali Lista di ID degli elementi principali
 * @return array|false Lista degli ID dei valori associati o false in caso di errore
 */
function getValoriAssociati($pdo, $listaIDsPrincipali)
{
    // Questo serve perché quando cancello una foglia, passo un solo valore
    if (!is_array($listaIDsPrincipali)) {
        $listaIDsPrincipali = [$listaIDsPrincipali];
    }

    if (empty($listaIDsPrincipali))
        return [];

    $placeholders = [];
    $params = [];

    // Crea segnaposto e array di parametri per bindParam
    foreach ($listaIDsPrincipali as $k => $id) {
        $ph = ":idPrincipale$k";
        $placeholders[] = $ph;
        $params[$ph] = $id;
    }

    $query = "
        SELECT valore.id
        FROM valore
        JOIN elemento_valore ON valore.id = elemento_valore.id_valore
        WHERE elemento_valore.id_elemento IN (" . implode(',', $placeholders) . ");
    ";

    $stmt = $pdo->prepare($query);

    // Esegue la query con i parametri bindati dinamicamente
    if (!$stmt->execute($params))
        return -1;

    return array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'id');
}


function copia_E_rimuoviElementi($pdo, $listaIDs)
{

    // Questo serve perché quando cancello una foglia, passo un solo valore
    if (!is_array($listaIDs)) {
        $listaIDs = [$listaIDs];
    }

    // Verifica che l'array non sia vuoto
    if (empty($listaIDs)) {
        return false; // Non si può procedere senza ID
    }

    // Genera i placeholders dinamici e l'array di parametri
    $placeholders = [];
    $params = [];

    foreach ($listaIDs as $index => $id) {
        $placeholder = ":id" . $index;
        $placeholders[] = $placeholder;
        $params[$placeholder] = $id;
    }

    // Combina i placeholders in una stringa
    $strPlaceholders = implode(',', $placeholders);

    // Costruzione della query con il valore di $strPlaceholders
    $queryCopiaRimuovi = "
        BEGIN;
            INSERT INTO nomi_precedenti (nome_precedente, id_tassonomia, data_modifica, id_elemento_scaduto)
            SELECT nome, id_tassonomia, CURRENT_TIMESTAMP, NULL
            FROM elemento
            WHERE id IN ($strPlaceholders);  -- Usa $strPlaceholders
    
            DELETE FROM elemento
            WHERE id IN ($strPlaceholders);  -- Usa ancora $strPlaceholders
        COMMIT;";

    // Preparazione e esecuzione della query
    $stmt = $pdo->prepare($queryCopiaRimuovi);
    if (!$stmt->execute($params)) {
        return false; // Errore nell'esecuzione della query
    }

    return true; // Operazione completata con successo
}

function rimuoviSinonimi($pdo, $arrayIDsSinonimi)
{
    if (empty($arrayIDsSinonimi)) {
        return true; //se la lista dei sinonimi è vuota, ho eliminato tutti i sinonimi
    }

    $placeholders = [];
    $params = [];
    foreach ($arrayIDsSinonimi as $index => $id) {
        $placeholder = ":id" . $index;
        $placeholders[] = $placeholder;
        $params[$placeholder] = $id;
    }

    $strPlaceholders = implode(",", $placeholders);

    $queryRimuoviSinonimi = "
        DELETE FROM elemento
        WHERE id IN ($strPlaceholders)
    ";

    $stmt = $pdo->prepare($queryRimuoviSinonimi);
    if (!$stmt->execute($params)) {
        return false;
    }
    return true;
}

function rimuoviValori($pdo, $listaValori)
{

    // Se non ci sono valori da eliminare, considero l'operazione completata con successo
    if (empty($listaValori)) {
        return true; // Se la lista dei valori è vuota, ho eliminato tutti i valori (perché non ci sono)
    }

    $placeholders = [];
    $params = [];
    foreach ($listaValori as $index => $id) {
        $placeholder = ":id" . $index;
        $placeholders[] = $placeholder;
        $params[$placeholder] = $id;
    }

    $strPlaceholders = implode(",", $placeholders);

    $queryRimuoviValori = "
        DELETE from valore 
        WHERE id IN ($strPlaceholders)
    ";

    $stmt = $pdo->prepare($queryRimuoviValori);
    return $stmt->execute($params);

}

// Funzione per ottenere la lista dei sinonimi di un singolo elemento
function getSinonimi($pdo, $idElemento)
{
    $querySinonimi = "
    
        SELECT sinonimo 
        FROM `sinonimi`
        WHERE sinonimi.principale = :idElemento;
    ";

    $stmt = $pdo->prepare($querySinonimi);
    $stmt->bindParam(":idElemento", $idElemento);
    $stmt->execute();
    return array_column($stmt->fetchAll(PDO::FETCH_NUM), 0);
}


function eliminaNodo($pdo, $idElemento)
{

    // Inizio leggendo la lista degli elementi da eliminare
    // Faccio una query per ottenere tutta la lista di ID degli: 
    // 1) Elementi da cancellare    
    // 2) Gli elementi sinonimi di quelli da cancellare

    // Ottieni tutti gli ID degli elementi figli, inclusi i sinonimi
    $arrayIdCompleto = getListaFigli($pdo, $idElemento);
    if ($arrayIdCompleto == -1)
        return false;

    // Filtra i sinonimi, tenendo solo gli ID principali
    $arrayElementiPrincipali = filtraSinonimi($pdo, $arrayIdCompleto);
    if ($arrayElementiPrincipali == -1)
        return false;

    // Ottieni tutti i valori associati agli ID principali
    $arrayIDsValori = getValoriAssociati($pdo, $arrayElementiPrincipali);
    if ($arrayIDsValori == -1)
        return false;

    /**
     * Arrivato qui ho 3 array:
     *  1 - tutti gli ID 
     *  2 - tutti gli ID principali 
     *  3 - tutti gli ID dei valori associati 
     * */


    // eseguo la procedura di spostamento degli elementi nella tabelle coi rimossi e cancellazione
    if (!copia_E_rimuoviElementi($pdo, $arrayElementiPrincipali)) {
        return false;
    }

    /***
     *
     * Calcolo la lista dei soli ID sinonimi così da poterli eliminare.
     * Lo faccio facendo la differenza insiemistica tra l'array contenente tutti gli IDs e quello contenente gli ID degli elementi principali
     * 
     */

    $arrayIDsSinonimi = array_values(array_diff($arrayIdCompleto, $arrayElementiPrincipali));


    if (!rimuoviSinonimi($pdo, $arrayIDsSinonimi)) {
        return false;
    }

    /**
     * 
     * Rimuovo ora i valori che non servono più
     * Per farlo uso l'array di ID calcolato prima
     * 
     */

    if(!rimuoviValori($pdo, $arrayIDsValori)){
        return false;
    }

    return true;
}

function eliminaFoglia($pdo, $idElemento)
{
    /**
     * 
     * In questo caso non devo cercare la lista dei figli (essendo che è una foglia)
     * Parto quindi cercando i sinonimi dell'elemento (così da cancellarli)
     */

    $arrayIDsSinonimi = getSinonimi($pdo, $idElemento);

    // Ottieni tutti i valori associati all'id
    $arrayIDsValori = getValoriAssociati($pdo, $idElemento);
    if ($arrayIDsValori == -1)
        return false;

    // Ottenuta la lista degli elementi e quella dei sinonimi, posso iniziare la fase di rimozione dell'elemento
    // eseguo la procedura di spostamento degli elementi nella tabelle coi rimossi e cancellazione
    if (!copia_E_rimuoviElementi($pdo, $idElemento)) {
        return false;
    }

    // rimuovere dopo
    if (!rimuoviSinonimi($pdo, $arrayIDsSinonimi)) {
        return false;
    }

    if(!rimuoviValori($pdo, $arrayIDsValori)){
        return false;
    }

    return true;
}


$isPadre = $_POST['isPadre'] ?? null;
$idElemento = $_POST['id_elemento'] ?? null;


if (isset($isPadre) && isset($idElemento)) {
    $risultato = $isPadre ? eliminaNodo($pdo, $idElemento) : eliminaFoglia($pdo, $idElemento);
    echo json_encode(["success" => $risultato]); //Stampo il risultato per capire se l'eliminazione è riuscita o no. 
}


?>