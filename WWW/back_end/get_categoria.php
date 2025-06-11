<?

/**
 * Script per ottenere informazioni o elementi di una categoria.
 *
 * Parametri GET:
 * - idCategoria (int): ID della categoria da interrogare.
 * - scelta (string): indica cosa restituire:
 *     - '1' -> informazioni generali della categoria (id tassonomia, nome)
 *     - '2' -> elenco delle voci associate alla categoria
 *
 * Risposte JSON:
 * - Per '1' o '2': array con i dati richiesti o array con chiave "risultato" e codice errore.
 * - Codici di errore possibili:
 *   - -1: parametro scelta mancante
 *   - -2: valore scelta non valido
 *   - -3: idCategoria non valido (non numerico)
 *   - -4: errore esecuzione query getInfoCategoria
 *   - -5: errore esecuzione query getElementiCategoria
 */


require_once("./connetti_database.php");

// leggo dell'id della categoria e la scelta di cosa fare
$idCategoria = $_GET['idCategoria'] ?? null;
$scelta = $_GET['scelta'] ?? null;


/**
 * getInfoCategoria
 *
 * @param  \PDO $pdo connessione al DB
 * @param  int $idCategoria id della categoria di cui voglio le informazioni
 * @return array array da encodare in json. Contiene i risultati.  
 */
function getInfoCategoria($pdo, $idCategoria)
{
    // query per ottenere le informazioni
    $query = <<<SQL
        SELECT categorie.id_tassonomia, categorie.nome
        FROM categorie
        WHERE categorie.id = :idCategoria;
    SQL;

    // Controllo l'id passato sia effettivamente un numero
    if (!preg_match('/^\d+$/', $idCategoria)) {
        return ["risultato" => -3, "categoria" => $idCategoria]; // In caso contrario, ritorno errore e l'id passato
    }

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':idCategoria', $idCategoria, PDO::PARAM_INT);
    if ($stmt->execute()) {
        $risultato = $stmt->fetch(PDO::FETCH_ASSOC);
        return $risultato;
    } else {
        return ["risultato" => -4];
    }

}

// Ottengo gli elementi della categoria
/**
 * getElementiCategoria
 *
 * @param  \PDO $pdo connessione al DB
 * @param  int $idCategoria id della categoria di cui voglio ottenere gli elementi
 * @return array array con le info della tassonomia/il codice di errore
 */
function getElementiCategoria($pdo, $idCategoria)
{
    $query = <<<SQL
        SELECT voci.id, voci.voce
        FROM voci
        WHERE voci.id_categoria = :idCategoria
    SQL;

    if (!preg_match('/^\d+$/', $idCategoria)) {
        return ["risultato" => -3, "categoria" => $idCategoria];
    }

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':idCategoria', $idCategoria, PDO::PARAM_INT);
    if ($stmt->execute()) {
        $risultato = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $risultato;
    } else {
        return ["risultato" => -5];
    }
}



// Lo metto qui perché verrà sempre stampato del JSON
header('Content-Type: application/json');

// se la scelta è 1, prendo le informazioni della categoria
switch ($scelta) {
    case '1':
        $risultato = getInfoCategoria($pdo, $idCategoria);
        echo json_encode($risultato);
        break;
    case '2':
        $risultato = getElementiCategoria($pdo, $idCategoria);
        echo json_encode($risultato);
        break;
    case null:
        echo json_encode(["risultato" => -1]); // Casistica: scelta null
        break;
    default:
        echo json_encode(["risultato" => -2]); // Casistica: scelta non valida
        break;
}
?>