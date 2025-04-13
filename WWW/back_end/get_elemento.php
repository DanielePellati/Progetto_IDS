<?php


/*
Utilizzo: ottenere tutte le informazioni per comporre 
la scheda di informazioni elemento.


Inizio leggendo i valori: 
    - dal DB leggo: valore e tipo 
SELECT `valore`, `Tipo`
FROM `valore` JOIN elemento_valore JOIN elemento 
ON valore.id = elemento_valore.id_valore AND elemento.id = elemento_valore.id_elemento


*/

require_once("connetti_database.php");


/**
 * getValori
 *
 * @param  int $id id dell'elemento. Verrà usato per cercare gli attributi dell'elemento nel DB
 * @param  \PDO $pdo Connessione al database
 */
function getValori($id, $pdo){
    $query = <<<SQL
        SELECT `valore`, `tipo`
        FROM `valore` 
        JOIN elemento_valore JOIN elemento 
        ON valore.id = elemento_valore.id_valore 
        AND elemento.id = elemento_valore.id_elemento
        WHERE elemento.id = :id
    SQL;

    $stmt = $pdo->prepare($query);    
    $stmt->execute(['id'=>$id]);

    // salvo i risultati della query in un array
    $risultati = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $risultatiJSON = json_encode($risultati);
    header('Content-Type: application/json');
    echo $risultatiJSON;
}

/**
 * getNomiPrecedenti
 *
 * @param  int $id id dell'elemento. Verrà usato per cercare i nomi precedenti dell'elemento nel DB
 * @param  \PDO $pdo Connessione al database
 */
function getNomiPrecedenti($id, $pdo){
    $query = <<<SQL
        SELECT `nome_precedente`, DATE_FORMAT(data_modifica, '%d/%m/%Y') as data
        FROM `nomi_precedenti` 
        WHERE id_elemento_scaduto = :id;
    SQL;

    $stmt = $pdo->prepare($query);
    $stmt->execute(['id'=>$id]);

    $risultati = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $risultatiJSON = json_encode($risultati);

    header('Content-Type: application/json');
    echo $risultatiJSON;
}

function getSinonimi($id, $pdo){
    $query = <<<SQL
        SELECT e.id, e.nome
        FROM sinonimi AS s
        JOIN elemento AS e ON s.sinonimo = e.id
        WHERE s.principale = :id;
    SQL;

    $stmt = $pdo->prepare($query);
    $stmt->execute(['id'=>$id]);        

    $risultati = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $risultatiJSON = json_encode($risultati);

    header('Content-Type: application/json');
    echo $risultatiJSON;
}

function getValoriPrecedenti($id, $pdo){
    $query = <<<SQL
        SELECT valore.valore as valore_attuale, valori_precedenti.valore_precedente, valori_precedenti.tipo_precedente, DATE_FORMAT(valori_precedenti.data_modifica, '%d/%m/%Y') as data_modifica 
        FROM valore JOIN valori_precedenti 
        ON valore.id = valori_precedenti.id_valore_modificato 
        WHERE valori_precedenti.id = :id
    SQL;

    $stmt = $pdo->prepare($query);
    $stmt->execute(['id'=>$id]);        

    $risultati = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $risultatiJSON = json_encode($risultati);

    header('Content-Type: application/json');
    echo $risultatiJSON;

    $nome = $stmt->fetch();
}

function getIntestazione($id, $pdo){

    $query = <<<SQL
        SELECT nome, id_tassonomia FROM elemento WHERE id = :id
    SQL;

    $stmt = $pdo->prepare($query);
    $stmt->execute(['id'=>$id]);   
    
    $risultato = $stmt->fetch();
    echo $risultato[0] . "," . $risultato[1];

}


$id = $_GET['id'];
$scelta = $_GET['scelta'];


switch ($scelta) {
    case 0:
        getIntestazione($id, $pdo);
        break;
    case 1:
        //se la scelta è 1, prendo i valori 
        getValori($id, $pdo);
        break;
    case 2:
        getNomiPrecedenti($id, $pdo);
        break;    
    case 3: 
        getSinonimi($id, $pdo);
        break;
    case 4: 
        getValoriPrecedenti($id, $pdo);
        break;
    default:
        # code...
        break;
}

?>