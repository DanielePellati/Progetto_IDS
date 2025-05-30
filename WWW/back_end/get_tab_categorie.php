<?php

require_once("./connetti_database.php");


$idTassonomia = (isset($_GET['idTassonomia']) && ctype_digit($_GET['idTassonomia']))
    ? (int) $_GET['idTassonomia']
    : 0;


if ($idTassonomia > 0) {
    $query = "
        SELECT categorie.nome, categorie.id 
        FROM categorie 
        WHERE categorie.id_tassonomia = 14
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
    echo json_encode(["status" => -1]);
}
?>