<?php
/**
 * Script per la gestione dell'eliminazione di una tassonomia.
 * 
 * Riceve tramite POST:
 * - 'idTassonomia' (int): ID della tassonomia da controllare ed eventualmente eliminare.
 * 
 * Funzionalità:
 * - Controlla se la tassonomia ha elementi.
 * - Se ha elementi, restituisce l'id della radice e se è padre (ha figli).
 * - Se non ha elementi, elimina la tassonomia.
 * 
 * Restituisce un JSON con un campo 'esito' che può assumere valori:
 * -  1 : eliminazione avvenuta con successo
 * -  0 : tassonomia popolata, con dati su radice e figli
 * - -1 : errore nel controllo elementi
 * - -2 : errore nel recupero della radice
 * - -3 : errore nel controllo dei figli
 * - -4 : errore nell'eliminazione della tassonomia
 * 
 * @param int $_POST['idTassonomia'] ID della tassonomia da gestire.
 * @return void Stampa un JSON con l'esito dell'operazione e informazioni aggiuntive.
 */



require_once("./connetti_database.php");

$idTassonomia = $_POST['idTassonomia'] ?? null;

// Inizio controllando che la tassonomia abbia degli elementi
// Se non ne ha, procedo all'eliminazione
// Se ne ha, rispondo con l'id della radice e se è padre

/**
 * controllaElementi
 *
 * @param  \PDO $pdo connessione al database
 * @param  int $idTassonomia id della tassonomia. Serve per specificare su quali elementi fare il controllo
 * @return bool | int se va tutto bene ritorno un bool, in caso di problemi un valore negativo
 */
function controllaElementi($pdo, $idTassonomia)
{

    // Controllo che la tassonomia abbia elementi
    $queryCheckElementi = <<<SQL
        SELECT 1 
        FROM elemento
        WHERE id_tassonomia = :idTassonomia
        LIMIT 1
    SQL;

    // preparo e associo placholder e valore reale
    $stmt = $pdo->prepare($queryCheckElementi);
    $stmt->bindParam(':idTassonomia', $idTassonomia);

    // Eseguo la query
    // Se la query viene eseguita correttamente, ritorno il risultato del controllo
    if ($stmt->execute()) {
        $isPopolata = (bool) $stmt->fetchColumn();
        return $isPopolata;
    }

    // Se arrivo qui, l'if di prima era false (perché non ha fatto il return) e quindi c'è stato un errore. 
    // Ritorno un errore con codice -1
    return -1;

}

/**
 * getRadiceTassonomia
 *
 * @param  mixed $pdo 
 * @param  mixed $idTassonomia
 * @return int ritorno l'id della radice o "-1" in caso di problemi
 */
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

/**
 * checkFigli
 *
 * @param  \PDO $pdo connessione al DB
 * @param  int $idRadice id della radice su cui fare il controllo. 
 * @return bool | int ritorno se ha figli. -1 in caso di problemi
 */
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

// Elimino effettivamente la tassonomia
/**
 * elimina_tassonomia
 *
 * @param  \PDO $pdo connessione al DB
 * @param  int $idTassonomia id della tassonomia da elimina
 * @return int ritorno 1 se va tutto bene o -4 se da problemi
 */
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

    return 1;
}

// Controllo che la tassonomia sia popolata
$isPopolata = controllaElementi($pdo, $idTassonomia);

// Viene dato errore
if ($isPopolata === -1) {
    echo json_encode(['esito' => -1]); // rispondo con un esito negativo
} elseif ($isPopolata) {
    $idRadice = getRadiceTassonomia($pdo, $idTassonomia); // Prendo la radice della tassomomia
    if ($idRadice == -1) { // se da problemi 
        echo json_encode(['esito' => -2]); // rispondo con esito negativo
    } else {
        $isPadre = checkFigli($pdo, $idRadice);
        if ($isPadre == -1) {
            echo json_encode(['esito' => -3, 'idRadice' => $idRadice, 'isPadre' => $isPadre]);
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