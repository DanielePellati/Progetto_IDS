<?php
/**
 * Script per il recupero delle informazioni base delle tassonomie.
 *
 * Recupera l'elenco di tutte le tassonomie presenti nel database,
 * restituendo per ciascuna il nome e l'ID.
 * 
 * Il risultato è restituito in formato JSON e utilizzato da index.php.
 */


require_once("connetti_database.php");

$query = "SELECT id, nome FROM tassonomia;";

$stmt = $pdo->prepare($query);

if ($stmt->execute()) {
    // Salvo i risultati della query in un array
    $risultati = $stmt->fetchAll();

    // Converto in JSON per la risposta al client
    $informazioniJSON = json_encode($risultati);

    header('Content-Type: application/json');
    echo json_encode($informazioniJSON);
} else {
    header('Content-Type: application/json');
    echo json_encode(array('error' => '-1'));
}
?>