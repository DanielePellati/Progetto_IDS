<?php
    /**
     * Inserisce una nuova tassonomia nel database.
     * 
     * Riceve tramite POST i dati:
     * - 'nome': nome della tassonomia
     * - 'desc': descrizione della tassonomia
     * 
     * Effettua l'inserimento nella tabella `tassonomia` e restituisce:
     * - l'ID della tassonomia appena inserita in caso di successo,
     * - '-1' in caso di errore.
     * 
     * @param string $_POST['nome'] Nome della tassonomia.
     * @param string $_POST['desc'] Descrizione della tassonomia.
     * 
     * @return string ID inserito oppure '-1' in caso di errore.
     */

    // crea una nuova tassonomia vuota. Leggerà il nome da JS 

    // aggiungo la connessione al DB
    require_once("connetti_database.php");

    $nome = $_POST['nome']; // leggo dalla chiamata il nome della tassonomia
    $desc = $_POST['desc']; // e la sua descrizione

    // query di inserimento della tassonomia. 
    // "nome" e "desc" sono placholder.
    $query = "
            INSERT INTO `tassonomia`(`nome`, `descrizione`) 
            VALUES (:nome, :desc) 
        ";

    // preparo la query
    $stmt = $pdo->prepare($query);
    // eseguo la query facendo il binding dei parametri (associo placeholder e valore)
    $risultato = $stmt->execute(['nome' => $nome, 'desc' => $desc]);

    // se la query risulta ($risultato = true), rispondo con l'id appena inserito 
    if ($risultato) {
        echo $pdo->lastInsertId();
    } else {
        echo -1; // se la query da problemi, ritorno -1 così da segnarlarlo
    }
?>