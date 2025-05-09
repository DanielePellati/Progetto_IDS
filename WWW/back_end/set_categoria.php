<?

require_once("./connetti_database.php");


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