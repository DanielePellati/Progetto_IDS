<?php

/* 

    Utilizzo: 
    Recuperare i dati dal database per la pagina di visualizzazione della tassonomia

*/


include_once("connetti_database.php");
// salvo l'id della tassonomia che verrà passato in query string 
$id_tassonomia = $_GET['id'];
$scelta = $_GET["func"];

/**
 * getInfoTassonomia
 *
 * @param  \PDO $pdo Connessione al database
 * @param  int $id_tassonomia id della tassonomia di cui voglio ottenere le informazioni di base
 */
function getInfoTassonomia($pdo, $id_tassonomia){

    $query = <<<SQL
        SELECT tassonomia.nome, tassonomia.descrizione
        FROM tassonomia
        WHERE tassonomia.id = :id
    SQL;

    // preparo la query 
    $stmt = $pdo->prepare($query);      

    // assegno il valore di ":id" assegnandogli il valore passato tramite GET.
    // Tra i vantaggi c'è la prevenzione di SQL injection
    $stmt->execute(['id'=>$id_tassonomia]);

    // salvo i risultati della query in un array
    $risultati = $stmt->fetch();

    $risultatiJSON = json_encode($risultati);
    header('Content-Type: application/json');
    echo $risultatiJSON;
}


/**
 * getElementiTassonomia
 *
 * @param  \PDO $pdo Connessione al database
 * @param  int $id id della tassonomia di cui voglio ottenere la lista degli elementi
 */
function getElementiTassonomia($pdo, $id){

    $query = <<<SQL
        SELECT elemento.id, elemento.id_padre, elemento.nome 
        FROM elemento 
        WHERE elemento.id_tassonomia = :id AND elemento.id NOT IN (SELECT sinonimo FROM Sinonimi);
    SQL;

    // preparo la query 
    $stmt = $pdo->prepare($query);     
    // assegno il valore di ":id" assegnandogli il valore passato tramite GET.
    // Tra i vantaggi c'è la prevenzione di SQL injection
    $stmt->execute(['id'=>$id]);

    // salvo i risultati della query in un array
    $risultati = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $risultatiJSON = json_encode($risultati);
    header('Content-Type: application/json');
    echo $risultatiJSON;
}


if($scelta == 1){
    getInfoTassonomia($pdo, $id_tassonomia); //funzione che serve per ottenere le informazioni generali di una tassonomia (nome, descrizione)
}
elseif($scelta == 2){
    getElementiTassonomia($pdo, $id_tassonomia); //funzione che serve per ottenere tutti gli elementi di una tassonomia
}

?>