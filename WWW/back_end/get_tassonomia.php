<?php
/**
 * Restituisce le categorie associate a una tassonomia specificata tramite parametro GET.
 * 
 * Se il parametro 'idTassonomia' è valido, esegue una query sul database per ottenere
 * l'elenco delle categorie appartenenti a quella tassonomia e restituisce i risultati in formato JSON.
 * In caso contrario, restituisce un errore JSON con status -1.
 * 
 * @param int $_GET['idTassonomia'] ID della tassonomia per cui recuperare le categorie
 * @return string JSON con la lista delle categorie o un messaggio di errore
 */


include_once("connetti_database.php");
// salvo l'id della tassonomia che verrà passato in query string 
$id_tassonomia = isset($_GET['id']) ? $_GET['id'] : (isset($_POST['id']) ? $_POST['id'] : null);
$scelta = isset($_GET['func']) ? $_GET['func'] : (isset($_POST['func']) ? $_POST['func'] : null);

/**
 * getInfoTassonomia
 *
 * @param  \PDO $pdo Connessione al database
 * @param  int $id_tassonomia id della tassonomia di cui voglio ottenere le informazioni di base
 */
function getInfoTassonomia($pdo, $id_tassonomia)
{

    if (!isset($id_tassonomia)) {
        header('Content-Type: application/json');
        echo json_encode(["risultato" => -1, "id" => $id_tassonomia]);
        return;
    }

    $query = <<<SQL
        SELECT tassonomia.nome, tassonomia.descrizione
        FROM tassonomia
        WHERE tassonomia.id = :id
    SQL;

    // preparo la query 
    $stmt = $pdo->prepare($query);

    // assegno il valore di ":id" assegnandogli il valore passato tramite GET.
    // Tra i vantaggi c'è la prevenzione di SQL injection
    if ($stmt->execute(['id' => $id_tassonomia])) {
        // salvo i risultati della query in un array
        $risultati = $stmt->fetch();

        $risultatiJSON = json_encode($risultati);
        header('Content-Type: application/json');
        echo $risultatiJSON;
    } else {
        echo json_encode(["risultato" => -1]);
    }
}


/**
 * getElementiTassonomia
 *
 * @param  \PDO $pdo Connessione al database
 * @param  int $id id della tassonomia di cui voglio ottenere la lista degli elementi
 */
function getElementiTassonomia($pdo, $id)
{

    $query = <<<SQL
        SELECT elemento.id, elemento.id_padre, elemento.nome 
        FROM elemento 
        WHERE elemento.id_tassonomia = :id AND elemento.id NOT IN (SELECT sinonimo FROM Sinonimi)
        ORDER BY elemento.id_padre
    SQL;

    // preparo la query 
    $stmt = $pdo->prepare($query);
    // assegno il valore di ":id" assegnandogli il valore passato tramite GET.
    // Tra i vantaggi c'è la prevenzione di SQL injection
    $stmt->execute(['id' => $id]);

    // salvo i risultati della query in un array
    $risultati = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $risultatiJSON = json_encode($risultati);
    header('Content-Type: application/json');
    echo $risultatiJSON;
}

/**
 * getNumeroElementi
 *
 * @param  \PDO $pdo connessione al DB
 * @param  int $id id della tassonomia su cui contare il numero di elementi
 * @return void
 */
function getNumeroElementi($pdo, $id)
{
    $query = <<<SQL
        SELECT COUNT(*) AS nElementi
        FROM elemento AS e
        WHERE e.id_tassonomia = :id
    SQL;

    $stmt = $pdo->prepare($query);
    $stmt->execute(['id' => $id]);
    $risultato = $stmt->fetch();
    echo $risultato[0];
}


switch ($scelta) {
    case '1':
        # code...
        getInfoTassonomia($pdo, $id_tassonomia); //funzione che serve per ottenere le informazioni generali di una tassonomia (nome, descrizione)        
        break;
    case '2':
        getElementiTassonomia($pdo, $id_tassonomia); //funzione che serve per ottenere tutti gli elementi di una tassonomia
        break;
    case '3':
        getNumeroElementi($pdo, $id_tassonomia); // funzione per ottenere il numero di elementi (mi serve per sapere se la tassonomia è vuota)
        break;
    default:
        # code...
        break;
}



?>