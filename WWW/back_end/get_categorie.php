<?php
/**
 * Script per il recupero di categorie e voci associate a tassonomie.
 *
 * Questo script permette di:
 * - Ottenere le categorie di una tassonomia (scelta = 0)
 * - Ottenere le voci di una specifica categoria (scelta = 1)
 * 
 * Riceve i parametri tramite GET:
 * - id_tassonomia (int): ID della tassonomia
 * - id_categoria (int, opzionale): ID della categoria (necessario se scelta = 1)
 * - scelta (int): tipo di richiesta (0 o 1)
 *
 * Restituisce i dati in formato JSON.
 */

require_once("connetti_database.php");

if (isset($_GET['id_tassonomia'])) {
    $idTassonomia = $_GET['id_tassonomia'];
}
if (isset($_GET['id_categoria'])) {
    $idCategoria = $_GET['id_categoria'];
}

$scelta = $_GET['scelta'];

/**
 * getNomeCategoria
 *
 * @param  \PDO connessione al DB
 * @param  int $idTassonomia id della tassonomia. Serve filtrare tra tutte le categorie
 * @return void
 */
function getNomeCategoria($pdo, $idTassonomia)
{
    $query = <<<SQL
    SELECT categorie.id, categorie.nome 
    FROM categorie 
    WHERE categorie.id_tassonomia = :id_tassonomia;
SQL;


    $stmt = $pdo->prepare($query);
    $stmt->execute(['id_tassonomia' => $idTassonomia]);
    // salvo i risultati della query in un array
    $risultati = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $risultatiJSON = json_encode($risultati);
    header('Content-Type: application/json');
    echo $risultatiJSON;
}

/**
 * getElementiCategoria
 *
 * @param  \PDO $pdo connessione al DB
 * @param  int $idCategoria id della categoria da cui prendere i dati
 * @param  int $idTassonomia
 * @return void
 */
function getElementiCategoria($pdo, $idCategoria, $idTassonomia)
{
    $query = <<<SQL
        SELECT voci.id, voci.voce 
        FROM voci JOIN categorie 
        ON voci.id_categoria = categorie.id
        WHERE categorie.id_tassonomia = :id_tassonomia AND categorie.id = :id_categoria;
    SQL;

    $stmt = $pdo->prepare($query);
    $stmt->execute(['id_tassonomia' => $idTassonomia, 'id_categoria' => $idCategoria]);

    // salvo i risultati della query in un array
    $risultati = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $risultatiJSON = json_encode($risultati);
    header('Content-Type: application/json');
    echo $risultatiJSON;
}

switch ($scelta) {
    case 0:
        getNomeCategoria($pdo, $idTassonomia); //se passo 0, ottengo le informazioni su tutte le categorie
        break;
    case 1:
        getElementiCategoria($pdo, $idCategoria, $idTassonomia); // se passo 1, ottengo i dati di una specifica categoria
        break;
    default:
        # code...
        break;
}
?>