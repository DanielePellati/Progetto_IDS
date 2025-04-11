<?php
// Definizione dei parametri di connessione al database
$server = "localhost"; // Nome del server (non utilizzato nella connessione effettiva)
//$port = "3306"; // Porta del database MySQL (commentata e non utilizzata)
$user = "root"; // Nome utente per l'accesso al database
$pass = "root"; // Password dell'utente
$db = "progetto_IGS"; // Nome del database da utilizzare

// Tentativo di connessione al database utilizzando PDO
try {
    // Creazione di una nuova istanza PDO per la connessione al database
    // L'host è impostato su "db" perché il database è in un ambiente Docker e "db" è il nome del servizio definito in Docker Compose
    $pdo = new PDO('mysql:host=db;dbname=progetto_IGS', 'root', 'root');

    // Impostazione dell'attributo PDO per generare eccezioni in caso di errori
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Messaggio di conferma nel caso in cui la connessione abbia successo
    //echo "Connessione riuscita!";
} catch (PDOException $e) {
    // In caso di errore, viene catturata l'eccezione e stampato un messaggio di errore con il dettaglio dell'errore
    //echo "Connessione fallita: " . $e->getMessage();
}
?>
