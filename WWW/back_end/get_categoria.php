<?

require_once("./connetti_database.php");

$idCategoria = $_GET['idCategoria'] ?? null;
$scelta = $_GET['scelta'] ?? null;


function getInfoCategoria($pdo, $idCategoria)
{

    $query = <<<SQL
        SELECT categorie.id_tassonomia, categorie.nome
        FROM categorie
        WHERE categorie.id = :idCategoria;
    SQL;

    if (!preg_match('/^\d+$/', $idCategoria)) {
        return ["risultato" => -3, "categoria" => $idCategoria];
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
    if($stmt->execute()){
        $risultato = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $risultato;
    }else{
        return ["risultato" => -5];
    }
}



// Lo metto qui perché verrà sempre stampato del JSON
header('Content-Type: application/json');

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