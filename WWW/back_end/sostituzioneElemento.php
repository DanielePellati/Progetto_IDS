<?php

/**
 * Gestione sostituzione nome elemento con storico e pulizia dati associati
 *
 * Questo script permette di aggiornare il nome di un elemento esistente nella tassonomia,
 * salvandone il nome precedente nella tabella 'nomi_precedenti', eliminando i sinonimi
 * collegati e rimuovendo i valori (attributi) associati all'elemento.
 *
 * Riceve tramite POST i seguenti parametri:
 *  - scelta (int): indica l'operazione da eseguire (1 = sostituzione nome)
 *  - id_elemento (int): id dell'elemento da modificare
 *  - nuovoNome (string): nuovo nome da assegnare all'elemento
 *
 * Restituisce un JSON con:
 *  - risultato (int):
 *      1 = successo
 *      -1 = id_elemento non valido o mancante
 *      -2 = scelta mancante o non gestita
 *      -3 = nuovoNome mancante o vuoto
 *      -4 = errore in transazione PDO, con messaggio in 'errore'
 */


require_once "./connetti_database.php";

/**
 * copia_e_sostiusciNome
 *
 * @param  \PDO $pdo connessione al DB
 * @param  int $idElemento id dell'elemento da sostituire
 * @return array ritorno un array con risultato ed eventuali errori
 */
function copia_e_sostiusciNome($pdo, $idElemento)
{
    // Prende il nuovo nome passato tramite POST
    $nuovoNome = $_POST['nuovoNome'];

    // Verifica che il nuovo nome sia stato fornito e non sia vuoto
    if (isset($nuovoNome) && $nuovoNome != '') {
        try {
            // Inizio della transazione: tutte le operazioni saranno atomiche
            $pdo->beginTransaction();

            // 1. Salva lo stato attuale dell'elemento nella tabella 'nomi_precedenti'
            // Serve a tenere traccia dei cambiamenti di nome
            $stmt1 = $pdo->prepare("
                INSERT INTO nomi_precedenti (id_elemento_scaduto, nome_precedente, data_modifica, id_tassonomia)
                SELECT id, nome, NOW(), id_tassonomia
                FROM elemento
                WHERE id = :id
            ");
            $stmt1->bindParam(":id", $idElemento, PDO::PARAM_INT);
            $stmt1->execute();

            // 2. Aggiorna il nome dell'elemento con il nuovo nome fornito
            $stmt2 = $pdo->prepare("
                UPDATE elemento
                SET nome = :nuovoNome
                WHERE id = :id
            ");
            $stmt2->bindParam(":nuovoNome", $nuovoNome, PDO::PARAM_STR);
            $stmt2->bindParam(":id", $idElemento, PDO::PARAM_INT);
            $stmt2->execute();

            // 3. Elimina dalla tabella 'elemento' tutti i sinonimi legati a questo elemento
            // (ovvero, quelli indicati come 'sinonimo' nella tabella 'sinonimi')
            $stmt3 = $pdo->prepare("
                DELETE FROM elemento
                WHERE id IN (
                    SELECT sinonimo
                    FROM sinonimi
                    WHERE principale = :id
                )
            ");
            $stmt3->bindParam(":id", $idElemento, PDO::PARAM_INT);
            $stmt3->execute();

            // 4. Elimina i valori (attributi) associati all'elemento
            // Si cancella dalla tabella 'valore' solo se collegati all'elemento tramite 'elemento_valore'
            $stmt4 = $pdo->prepare("
                DELETE valore
                FROM valore
                JOIN elemento_valore ON valore.id = elemento_valore.id_valore
                WHERE elemento_valore.id_elemento = :id
            ");
            $stmt4->bindParam(":id", $idElemento, PDO::PARAM_INT);
            $stmt4->execute();

            // Tutte le operazioni sono andate a buon fine: conferma definitiva
            $pdo->commit();

            // Ritorna un risultato positivo
            return ["risultato" => 1];

        } catch (PDOException $e) {
            // In caso di errore in qualunque punto: annulla tutto
            $pdo->rollBack();

            // Ritorna un errore con il messaggio dell'eccezione
            return ["risultato" => -4, "errore" => $e->getMessage()];
        }

    } else {
        // Il nuovo nome non è stato fornito correttamente
        return ["risultato" => -3, "nuovoNome" => $nuovoNome];
    }
}




// Se la scelta non è inserita, metto a null
$scelta = $_POST['scelta'] ?? null;
$idElemento = $_POST['id_elemento'] ?? null;

// questo if gestisce l'inserimento di un ID non valido
if (filter_var($idElemento, FILTER_VALIDATE_INT) !== false && $idElemento > 1) {
    switch ($scelta) {
        case 1:
            header('Content-Type: application/json');
            $risultato = copia_e_sostiusciNome($pdo, $idElemento);
            echo json_encode($risultato);
            break;
        case null:
            header('Content-Type: application/json');
            $risultato = ["risultato" => -2];
            echo json_encode($risultato); // Stampo il risultato con l'errore "-2"
        default:
            break;
    }
} else {
    header('Content-Type: application/json');
    $risultato = ["risultato" => -1, "id" => $idElemento];
    echo json_encode($risultato);
}






?>