<?

require_once("./connetti_database.php");


/**
 * inserisciCategoria
 *
 * @param  \PDO $pdo connessione al database
 * @param  string $nome nome della categoria da creare
 * @param  int $idTassonomia id della tassonomia a cui associarla
 * @return int ritorno l'id della nuova tassonomia o -1 in caso di errori
 */
function inserisciCategoria($pdo, $nome, $idTassonomia): int
{

    $query = "
    INSERT INTO categorie (`nome`, `id_tassonomia`)
    VALUES (:nome, :idTassonomia)
    ";

    $stmt = $pdo->prepare($query);

    $risultato = $stmt->execute([':nome' => $nome, ':idTassonomia' => $idTassonomia]);

    if ($risultato) {
        return $pdo->lastInsertId();
    } else {
        return -1;
    }

}

/**
 * inserisciVoci
 *
 * @param  \PDO $pdo connessione al db
 * @param  array $listaVoci lista delle voci da inserire
 * @param  int $idCategoria della categoria a cui associare le voci
 * @return bool ritorno il risultato dell'inserimento
 */
function inserisciVoci($pdo, $listaVoci, $idCategoria): bool
{
    $placeholders = [];
    $data = [':categoria' => $idCategoria];

    foreach ($listaVoci as $i => $voce) {
        $placeholders[] = "(:categoria, :voce$i)";
        $data[":voce$i"] = $voce;
    }

    $query = "
        INSERT INTO voci (id_categoria, voce)
        VALUES " . implode(", ", $placeholders);

    $stmt = $pdo->prepare($query);
    $risultato = $stmt->execute($data);

    return $risultato;

}


/**
 * controllaDati
 *
 * @param  \PDO $pdo connessione al DB
 * @return bool restituisce il risultato del controllo sui dati (se sono inseriti correttamente)
 */
function controllaDati($pdo)
{

    $nome = "";
    $listaVoci = [];
    $idTassonomia = 0;

    if (isset($_POST['nome'])) {
        $nome = $_POST['nome'];
        if (empty($nome)) {
            return false;
        }
    } else {
        return false;
    }

    if (isset($_POST['listaVoci'])) {
        $listaVoci = json_decode($_POST['listaVoci'], true);
        if (empty($listaVoci)) {
            return false;
        }
    } else {
        return false;
    }

    if (isset($_POST['idTassonomia']) && is_numeric($_POST['idTassonomia']) && $_POST['idTassonomia'] > 0) {
        $idTassonomia = (int)$_POST['idTassonomia'];
    } else {
        return false;
    }
    

    $idCategoriaInserita = inserisciCategoria($pdo, $nome, $idTassonomia);

    if ($idCategoriaInserita == -1) {
        return false;
    } else {
        $risultato = inserisciVoci($pdo, $listaVoci, $idCategoriaInserita);
        if (!$risultato) {
            return false;
        }
    }

    return true;
}


$datiControllati = controllaDati($pdo);

if (!$datiControllati) {
    echo -1;
}else{
    echo 1;
}






?>