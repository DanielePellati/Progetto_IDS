<?php

    // crea una nuova tassonomia vuota. Leggerà il nome da JS 

    require_once("connetti_database.php");

    $nome = $_POST['nome'];
    $desc = $_POST['desc'];


    $query = "
        INSERT INTO `tassonomia`(`nome`, `descrizione`) 
        VALUES (:nome, :desc) 
    ";


    $stmt = $pdo->prepare($query);
    $risultato = $stmt->execute(['nome' => $nome, 'desc' => $desc]);

    echo $risultato;
?>