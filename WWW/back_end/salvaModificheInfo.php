<?php

// Includo il file di connessione al database
require_once "./connetti_database.php";

// Recupero i dati dalla richiesta POST. Se non sono presenti, li imposto come null
$nuovoNome = $_POST['nome'] ?? null;  // Nome che voglio aggiornare
$nuovaDesc = $_POST['descrizione'] ?? null;  // Descrizione che voglio aggiornare
$idTassonomia = $_POST['idTassonomia'] ?? null;  // ID della tassonomia da aggiornare

// Se l'ID della tassonomia non è presente, invio una risposta JSON con un errore
if (!$idTassonomia) {
    header('Content-Type: application/json');  // Specifico che la risposta sarà in formato JSON
    echo json_encode(['risultato' => -1, 'idTassonomia' => $idTassonomia]);  // Rispondo con un errore
    exit();  // Termino l'esecuzione del codice
}

// Creo la query SQL di base per l'aggiornamento
$query = "UPDATE tassonomia SET ";

// Creo un array per raccogliere le condizioni SET (i campi da aggiornare)
$setClauses = [];

// Se il nuovo nome è stato fornito, aggiungo una clausola SET per il nome
if ($nuovoNome) {
    $setClauses[] = "nome = :nuovoNome";  // Aggiungo la condizione per il nome
}

// Se la nuova descrizione è stata fornita, aggiungo una clausola SET per la descrizione
if ($nuovaDesc) {
    $setClauses[] = "descrizione = :nuovaDesc";  // Aggiungo la condizione per la descrizione
}

// Se non ci sono dati da aggiornare, rispondo con un errore
if (empty($setClauses)) {
    echo json_encode(['risultato' => -2]);  // Invia un messaggio di errore
    exit();  // Termino l'esecuzione
}

// Aggiungo la parte finale della query SQL, includendo la condizione per l'ID della tassonomia
$query .= implode(", ", $setClauses) . " WHERE id = :idTassonomia";

// Preparo la query per l'esecuzione
$stmt = $pdo->prepare($query);

// Binding dei parametri (associo i valori alle variabili dei segnaposto nella query SQL)
if ($nuovoNome) {
    $stmt->bindValue(":nuovoNome", $nuovoNome, PDO::PARAM_STR);  // Associo il valore di :nuovoNome
}
if ($nuovaDesc) {
    $stmt->bindValue(":nuovaDesc", $nuovaDesc, PDO::PARAM_STR);  // Associo il valore di :nuovaDesc
}
$stmt->bindValue(":idTassonomia", $idTassonomia, PDO::PARAM_INT);  // Associo l'ID della tassonomia

// Eseguo la query
if ($stmt->execute()) {
    header('Content-Type: application/json');  // Specifico che la risposta sarà in formato JSON
    echo json_encode(['risultato' => 1]);  // Rispondo con successo
} else {
    header('Content-Type: application/json');  // Specifico che la risposta sarà in formato JSON
    $errorInfo = $stmt->errorInfo();  // Recupero le informazioni sull'errore
    echo json_encode(['risultato' => -3, 'errore' => $errorInfo[2]]);  // Rispondo con il messaggio di errore
}

?>