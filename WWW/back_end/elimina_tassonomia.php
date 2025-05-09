<?php

require_once("./connetti_database.php");

$idTassonomia = $_POST['idTassonomia'] ?? null;

// Inizio controllando che la tassonomia abbia degli elementi
// Se non ne ha, procedo all'eliminazione
// Se ne ha, rispondo con l'id della radice e se è padre

function controllaElementi($pdo, $idTassonomia)
{
    $queryCheckElementi = <<<SQL
        SELECT 1 
        FROM elemento
        WHERE id_tassonomia = :idTassonomia
        LIMIT 1
    SQL;

    $stmt = $pdo->prepare($queryCheckElementi);
    $stmt->bindParam(':idTassonomia', $idTassonomia);

    if ($stmt->execute()) {
        $isPopolata = (bool) $stmt->fetchColumn();
        return $isPopolata;
    }

    return -1;

}

function getRadiceTassonomia(PDO $pdo, $idTassonomia)
{
    // Questa query mi da l'id della radice
    $queryGetIdRadice = <<<SQL
    SELECT id
    FROM elemento 
    WHERE id_tassonomia = :id
    AND id_padre IS NULL
    AND id NOT IN (
        SELECT sinonimo 
        FROM sinonimi
    );
    SQL;

    $stmtGetIdRadice = $pdo->prepare($queryGetIdRadice);
    $stmtGetIdRadice->bindParam(':id', $idTassonomia, PDO::PARAM_INT);
    if ($stmtGetIdRadice->execute()) {
        return $stmtGetIdRadice->fetchColumn();
    } else {
        return -1;
    }
}

function checkFigli(PDO $pdo, $idRadice)
{
    
    // Ora mi serve sapere se ha o no figli
    $queryControllaFigli = <<<SQL
    SELECT 1
    FROM elemento
    WHERE id_padre = :idRadice
    LIMIT 1;
    SQL;

    $stmtControllaFigli = $pdo->prepare($queryControllaFigli);
    $stmtControllaFigli->bindParam(':idRadice', $idRadice, PDO::PARAM_INT);

    if ($stmtControllaFigli->execute()) {
        return $stmtControllaFigli->fetchColumn();
    } else {
        return -1;
    }
}

function elimina_tassonomia($pdo, $idTassonomia)
{
    $query = <<<SQL
        DELETE FROM tassonomia
        WHERE id = :idTassonomia
    SQL;

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':idTassonomia', $idTassonomia, PDO::PARAM_INT);

    if (!$stmt->execute()) {
        return -4;
    }

    return 4;
}

$isPopolata = controllaElementi($pdo, $idTassonomia);

if ($isPopolata === -1) {
    echo json_encode(['esito' => -1]);
} elseif ($isPopolata) {
    $idRadice = getRadiceTassonomia($pdo, $idTassonomia);
    if ($idRadice == -1) {
        echo json_encode(['esito' => -2]);
    } else {
        $isPadre = checkFigli($pdo, $idRadice);
        if ($isPadre == -1) {
            echo json_encode(['esito' => -3, 'idRadice' =>$idRadice, 'isPadre' => $isPadre]);
        } else {
            $risultati = [
                'esito' => 0,
                'idRadice' => $idRadice,
                'isPadre' => $isPadre
            ];
            echo json_encode($risultati);
        }
    }
} else {

    // La chiamo ora che sono sicuro che la tassonomia sia vuota
    $risultato = elimina_tassonomia($pdo, $idTassonomia);
    $risultati = ['esito' => $risultato];
    echo json_encode($risultati);
}







?>