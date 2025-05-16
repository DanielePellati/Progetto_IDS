<?php

require_once "./connetti_database.php";



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