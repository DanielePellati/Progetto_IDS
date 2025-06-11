<?php

require_once "./connetti_database.php";

/**
 * Gestisce la richiesta di eliminazione di una categoria.
 *
 * Riceve un ID via POST, controlla se le voci associate sono in uso, 
 * ed eventualmente elimina la categoria dal database.
 * 
 * Ritorna un JSON con l'esito dell'operazione:
 * - -1: ID non valido
 * - -2: Errore durante il recupero degli ID delle voci
 * - -3: Errore nella query di controllo
 * - -4: La categoria non può essere eliminata (è in uso)
 * - -5: Errore durante l'eliminazione
 * - altrimenti, nessun output in caso di eliminazione riuscita
 *
 * Richiede una connessione PDO ($pdo) e un parametro POST 'idCategoria'.
 */


/**
 * getIDsVoci
 *
 * @param  \PDO $pdo connessione al DB
 * @param  int $idCategoria id della categoria da cui ottengo gli ID delle voci
 * @return array | int ritorno o l'array con gli IDs o un numero di errore
 */
function getIDsVoci($pdo, $idCategoria)
{
    $query = <<<SQL
        SELECT voci.id 
        FROM voci
        WHERE voci.id_categoria = :idCategoria
    SQL;

    $stmt = $pdo->prepare($query);

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':idCategoria', $idCategoria, PDO::PARAM_INT);

    if ($stmt->execute()) {
        $risultato = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $risultato[] = $row['id']; // array PHP
        }

        return $risultato;
    } else {
        return -2;
    }
}

/**
 * controllaCategoria
 *
 * @param  \PDO $pdo connessione al DB
 * @param  array $arrayIdsVoci array contenente gli IDs da controllare.
 * @return bool | int Se anche solo uno è utilizzato, ritorno true. Se ci sono errori, ritorno un codice di errore
 */
function controllaCategoria($pdo, $arrayIdsVoci)
{

    $strIdsCategoria = implode(',', $arrayIdsVoci);

    $query = <<<SQL
        SELECT 1
        FROM valore
        WHERE valore.tipo = 2 AND valore.valore IN ($strIdsCategoria)
    SQL;

    $stmt = $pdo->prepare($query);
    if ($stmt->execute()) {
        return $stmt->fetchColumn();
    } else {
        // Gestisce l'errore nell'esecuzione della query
        return -3;
    }
}


/**
 * eliminaCategoria
 *
 * @param  \PDO $pdo connessione al DB
 * @param  int $idCategoria della categoria da rimuovere
 * @return bool ritorno il risultato dell'eliminazione
 */
function eliminaCategoria($pdo, $idCategoria){
    $query = <<<SQL
        DELETE FROM categorie
        WHERE id = :idCategoria;
    SQL;

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':idCategoria', $idCategoria, PDO::PARAM_INT);
    return $stmt->execute();
}

$idCategoria = $_POST['idCategoria'] ?? null;

header('Content-Type: application/json');

if (!preg_match('/^\d+$/', $idCategoria)) {
    echo json_encode(["risultato" => -1, "categoria" => $idCategoria]);
    exit();
}


$arrayIdsVoci = getIDsVoci($pdo, $idCategoria);
if ($arrayIdsVoci == -2) {
    echo json_encode(["risultato" => $arrayIdsVoci]);
    exit();
}

$risultato = controllaCategoria($pdo, $arrayIdsVoci);

if($risultato == -3){
    echo json_encode(["risultato"=> $risultato]);
}else if($risultato){
    echo json_encode(["risultato"=> -4]); // Se la query trova qualcosa, mando l'errore.
    exit();
}else{
    $risultato = eliminaCategoria($pdo, $idCategoria);
    if(!$risultato){
        echo json_encode(["-5"=> $risultato]);
    }
}

?>