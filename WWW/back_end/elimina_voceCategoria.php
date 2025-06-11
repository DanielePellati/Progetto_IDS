<?php
/**
 * Script per la cancellazione di una voce da una categoria.
 * 
 * Riceve tramite POST:
 * - 'idVoce' (int): ID della voce da cancellare.
 * 
 * Funzionalità:
 * - Controlla se la voce è in uso (presente nella tabella `valore` con tipo = 2).
 * - Se la voce è in uso, impedisce la cancellazione e restituisce un codice di errore.
 * - Se la voce non è in uso, procede con l'eliminazione.
 * 
 * Restituisce un JSON con un campo 'esito' che può assumere valori:
 * -  1 : eliminazione avvenuta con successo
 * - -1 : idVoce non impostato correttamente
 * - -2 : voce in uso, impossibile eliminare
 * - -3 : errore nell'esecuzione della query di eliminazione
 * 
 * @param int $_POST['idVoce'] ID della voce da cancellare.
 * @return void Stampa un JSON con l'esito dell'operazione.
 */

require_once("./connetti_database.php");

// leggo l'id della voce da cancellare
$idVoce = $_POST['idVoce'] ?? null;

// Controllo che la voce della categoria sia in uso
/**
 * controllaUso
 *
 * @param  \PDO connessione al DB
 * @param  int $idVoce id della voce da controllare.
 * @return bool restituisce se la voce è in uso o no
 */
function controllaUso($pdo, $idVoce)
{
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

// Elimina effettivamente la voce
/**
 * eliminaVoce
 *
 * @param  \PDO $pdo connessione al DB
 * @param  int $idVoce id della voce de eliminare
 * @return bool ritorno il risultato della query (true se è tutto ok, false in caso contrario)
 */
function eliminaVoce($pdo, $idVoce)
{
    $queryElimina = <<<SQL
        DELETE FROM voci 
        WHERE id = :idVoce
    SQL;

    $stmtElimina = $pdo->prepare($queryElimina);
    $stmtElimina->bindParam(':idVoce', $idVoce, PDO::PARAM_INT);
    return $stmtElimina->execute();
}

if (isset($idVoce)) {
    // Controllo se l'elemento è usato. Se lo è impedisco la cancellazion, se non lo è avvio la procedura di cancellazione
    if (controllaUso($pdo, $idVoce)) {
        $esito = ['esito' => -2]; // Errore: è utilizzata
    } else {
        if (eliminaVoce($pdo, $idVoce)) {
            $esito = ['esito' => 1]; // tutto ok
        } else {
            $esito = ['esito' => -3]; // Errore nella query
        }
    }
} else {
    $esito = ['esito' => -1]; // Errore: idVoce non è impostato correttamente
}

echo json_encode($esito); // stampo l'esito
?>