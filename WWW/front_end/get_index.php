<?php

/**
 * Utilizzo:
 * ottenere le informazioni di base su una tassonomia (nome, id)
 * I dati verranno passati a index.php verranno poi visualizzati
 * 
 * 
 */

require_once("connetti_database.php");

$query = "SELECT id, nome FROM tassonomia;";

// Preparo la query 
$stmt = $pdo->prepare($query);

// Eseguo la query
$stmt->execute();

// Salvo i risultati della query in un array
$risultati = $stmt->fetchAll();

// rendo il risultato un JSON. Mi serve per passarlo al file JS che fa la chiamata
$informazioniJSON = json_encode($risultati);

header('Content-Type: application/json');
echo json_encode($informazioniJSON);

?>