<?php

/**
 * Restituisce le categorie associate a una tassonomia specifica.
 *
 * Endpoint: accetta un parametro GET `idTassonomia`, verifica che sia un intero positivo,
 * e restituisce in formato JSON tutte le categorie appartenenti a quella tassonomia.
 *
 * Parametri:
 *   - idTassonomia (int): ID numerico della tassonomia di riferimento.
 *
 * Codici di esito:
 *   - status = -1: parametro mancante o non valido
 *   - status assente (default): successo, restituisce array di categorie
 *
 * Output JSON:
 *   [
 *     {
 *       "nome": string,
 *       "id": int
 *     },
 *     ...
 *   ]
 */


require_once("./connetti_database.php");

// Se viene passato correttamente l'id della tassonomia lo imposto, se no lo metto a 0
$idTassonomia = (isset($_GET['idTassonomia']) && ctype_digit($_GET['idTassonomia']))
    ? (int) $_GET['idTassonomia']
    : 0;


// Se l'utente ha inserito correttamente viene avviato il processo di raccolta dei valori
if ($idTassonomia > 0) {
    $query = "
        SELECT categorie.nome, categorie.id 
        FROM categorie 
        WHERE categorie.id_tassonomia = :id
        GROUP BY categorie.id;
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute([':id' => $idTassonomia]);

    // salvo i risultati della query in un array
    $risultati = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $risultatiJSON = json_encode($risultati);
    header('Content-Type: application/json');
    echo $risultatiJSON;
} else {
    echo json_encode(["status" => -1]); // Se non mette i corretti valori, ritorno l'errore
}
?>
