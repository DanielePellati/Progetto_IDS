<?php

require_once("./connetti_database.php");

$idVoce = $_POST['idVoce'] ?? null;

function controllaUso($pdo, $idVoce){
    $queryControlla = <<<SQL
        SELECT 1 
        FROM `valore`
        WHERE valore.tipo = 2 AND valore.valore = :idVoce;
    SQL;

    $stmt = $pdo->prepare($queryControlla);
    $stmt->bindParam(':idVoce', $idVoce, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchColumn();
}

function eliminaVoce($pdo, $idVoce){   
    $queryElimina = <<<SQL
        DELETE FROM voci 
        WHERE id = :idVoce
    SQL;

    $stmtElimina = $pdo->prepare($queryElimina);
    $stmtElimina->bindParam(':idVoce', $idVoce, PDO::PARAM_INT);
    return $stmtElimina->execute();
}

if(isset($idVoce)){
// Controllo se l'elemento è usato. Se lo è impedisco la cancellazion, se non lo è avvio la procedura di cancellazione
if(controllaUso($pdo, $idVoce)){
    $esito = ['esito' => -2];
}else{
    if(eliminaVoce($pdo, $idVoce)){
        $esito = ['esito'=> 1]; // tutto ok
    }else{
        $esito = ['esito'=> -3];
    }
}
}else{
    $esito = ['esito'=> -1];
}

echo json_encode($esito);



?>