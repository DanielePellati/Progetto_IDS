<?

/**
 * Gestione tassonomia: inserimento di nomi, attributi e sinonimi
 *
 * Questo script riceve dati tramite POST per eseguire diverse operazioni sulla tassonomia:
 *  - inserire un nuovo elemento (nome)
 *  - aggiungere attributi a un elemento esistente
 *  - aggiungere sinonimi a un elemento esistente
 *
 * Parametri POST attesi a seconda dell'operazione scelta:
 *  - scelta (int): 1 per inserire nome, 2 per aggiungere attributi, 3 per aggiungere sinonimi
 *  
 *  Per inserire un nome:
 *    - idTassonomia (int)
 *    - idPadre (int|null)
 *    - nomeElemento (string)
 *
 *  Per aggiungere attributi:
 *    - idElemento (int)
 *    - listaAttributi (JSON array di oggetti con proprietà "valore" e "tipo")
 *
 *  Per aggiungere sinonimi:
 *    - idElemento (int)
 *    - idTassonomia (int)
 *    - idPadre (int|null)
 *    - listaSinonimi (JSON array di stringhe)
 *
 * Restituisce:
 *  - id dell'elemento inserito (per scelta=1)
 *  - 1 in caso di successo (per scelta=2 e 3)
 *  - -1 in caso di errore
 */

require_once("./connetti_database.php");

$scelta; // scelta per l'operazione da eseguire (inserisci nome, inserisci attributi, interisci sinonimi)

// variabile per il nome dell'elemento
$scelta = $_POST['scelta'] ?? null;

$idElementoAggiunto;

/**
 * aggiungiNome
 *
 * @param  \PDO $pdo connessione al DB
 * @return int ritorna -1 in caso di errore, negli altri casi l'id dell'elemento inserito
 */
function aggiungiNome($pdo)
{

    $idPadre = isset($_POST['idPadre']) && $_POST['idPadre'] !== '' ? $_POST['idPadre'] : null;
    $idTassonomia = $_POST['idTassonomia'] ?? null;
    $nomeElemento = $_POST['nomeElemento'] ?? null;

    if ($nomeElemento === '') {
        return -1;
    }



    $query = "
        INSERT INTO elemento (`id_tassonomia`, `id_padre`, `nome`)
        VALUES (:idTassonomia, :idPadre, :nomeElemento)
    ";

    //preparo la query 
    $stmt = $pdo->prepare($query);
    // Collego i valori ai placeholder
    $stmt->execute([
        ':idTassonomia' => $idTassonomia,
        ':idPadre' => $idPadre,
        ':nomeElemento' => $nomeElemento
    ]);

    return $pdo->lastInsertId();
}

/**
 * aggiungiAttributi
 *
 * @param  \PDO $pdo connessione al DB
 * @return void
 */
function aggiungiAttributi($pdo)
{

    $listaAttributi = json_decode($_POST['listaAttributi']) ?? [];
    $idElemento = $_POST['idElemento'] ?? -1;

    if ($idElemento != -1) {
        $query = "
            INSERT INTO valore (`valore`, `tipo`)
            VALUES (:valore, :tipo)
        ";

        $stmt = $pdo->prepare($query);

        foreach ($listaAttributi as $attributo) {
            // Associo ed eseguo
            $stmt->bindValue(':valore', $attributo->valore);
            $stmt->bindValue(':tipo', (int) $attributo->tipo);
            $risultato = $stmt->execute();

            if ($risultato) {

                $idValore = $pdo->lastInsertId();

                // query che associa elemento e valore 
                $queryAssociativa = "
                    INSERT INTO `elemento_valore`(`id_valore`, `id_elemento`) 
                    VALUES (:idValore, :idElemento)
                ";

                try {
                    $stmtAssociativa = $pdo->prepare($queryAssociativa);

                    $stmtAssociativa->bindValue(':idValore', $idValore);
                    $stmtAssociativa->bindValue(':idElemento', $idElemento);

                    $stmtAssociativa->execute();
                } catch (Exception $e) {
                    // gestisci l'eccezione
                    echo "Errore: " . $e->getMessage() + " idValore = {$idValore} idElemento = {$idElemento}";
                }

            } else {
                echo -1;
                return;
            }
        }
    }
    echo 1;
}

/**
 * aggiungiSinonimi
 *
 * @param  \PDO $pdo connessione al DB
 * @return void
 */
function aggiungiSinonimi($pdo)
{

    // parte 1 - aggiungo il sinonimo alla lista dei nomi 
    $idElemento = $_POST['idElemento'] ?? -1;

    if ($idElemento !== -1) {
        $idPadre = isset($_POST['idPadre']) && $_POST['idPadre'] !== '' ? $_POST['idPadre'] : null;
        $idTassonomia = $_POST['idTassonomia'] ?? null;
        $listaSinonimi = json_decode($_POST['listaSinonimi']) ?? [];


        if (count($listaSinonimi) == 0) {
            echo "Errore";
        }

        $query = "
        INSERT INTO elemento (`id_tassonomia`, `id_padre`, `nome`)
        VALUES (:id_tassonomia, :id_padre, :nome)
        ";

        $stmt = $pdo->prepare($query);

        foreach ($listaSinonimi as $sinonimo) {
            $stmt->bindValue(':id_tassonomia', $idTassonomia);
            $stmt->bindValue(':id_padre', $idPadre);
            $stmt->bindValue(':nome', $sinonimo);
            $risultato = $stmt->execute();

            if ($risultato) {
                $idSinonimo = $pdo->lastInsertId();

                $querySinonimi = "
                INSERT INTO sinonimi (principale, sinonimo)
                VALUES (:idElemento, :idSinonimo)
            ";

                $stmtSinonimi = $pdo->prepare($querySinonimi);
                $stmtSinonimi->bindValue(':idElemento', $idElemento);
                $stmtSinonimi->bindValue(':idSinonimo', $idSinonimo);
                $stmtSinonimi->execute();

            }
        }

    } else {
        echo -1;
        return;
    }

    echo 1;
}



switch ($scelta) {
    case 1:
        $idElementoAggiunto = aggiungiNome($pdo);
        echo $idElementoAggiunto;
        break;
    case 2:
        aggiungiAttributi($pdo);
        break;
    case 3:
        aggiungiSinonimi($pdo);
        break;
    default:
        echo -1; //stampando -1, restituisco un errore. 
        break;
}




?>