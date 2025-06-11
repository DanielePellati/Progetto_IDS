<?php

/**
 * Recupera i nomi precedenti degli elementi associati a una tassonomia specifica.
 *
 * Endpoint: questo script riceve un parametro GET `idTassonomia`, esegue dei controlli
 * di validità e restituisce in formato JSON l'elenco dei nomi precedenti legati a quella tassonomia.
 *
 * Parametri:
 *   - idTassonomia (int): ID numerico della tassonomia da interrogare.
 *
 * Codici di esito:
 *   - -1: parametro mancante
 *   - -2: parametro non numerico
 *   - -3: errore nell'esecuzione della query
 *   -  1: successo, con array `nomiPrecedenti` contenente i risultati
 *
 * Output JSON:
 *   {
 *     "esito": int,
 *     "nomiPrecedenti": [
 *       {
 *         "nome_elemento": string,
 *         "nome_precedente": string,
 *         "data_modifica": string (formato dd-mm-yyyy)
 *       },
 *       ...
 *     ]
 *   }
 */

require_once "./connetti_database.php";

$idTassonomia = $_GET['idTassonomia'] ?? null;

// Se i controlli vanno bene passo avanti, se no esco
if (!isset($idTassonomia)) {
    $risultato = ["esito" => -1];
    echo json_encode($risultato);
    exit;
} else if (!preg_match('/^\d+$/', $idTassonomia)) {
    $risultato = ['esito' => -2];
    echo json_encode($risultato);
    exit;
}

// Recupera i nomi precedenti degli elementi associati a una tassonomia
$queryNomi = "
SELECT 
    el.nome AS nome_elemento,
    np.nome_precedente,
    DATE_FORMAT(np.data_modifica, '%d-%m-%Y') AS data_modifica
FROM 
    nomi_precedenti np
LEFT JOIN 
    elemento el ON np.id_elemento_scaduto = el.id
WHERE 
    np.id_tassonomia = :id
ORDER BY 
    np.data_modifica DESC;
";

$stmt = $pdo->prepare($queryNomi);
$stmt->bindParam(":id", $idTassonomia, PDO::PARAM_INT);

if ($stmt->execute()) {

    $nomiPrecedenti = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $risultato = ["esito" => 1, "nomiPrecedenti" => $nomiPrecedenti];
    echo json_encode($risultato);

} else {
    $risultato = ["esito" => -3];
    echo json_encode($risultato);
    exit;
}
?>