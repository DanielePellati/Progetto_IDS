<?

require_once("./connetti_database.php");

$scelta; // scelta per l'operazione da eseguire (inserisci nome, inserisci attributi, interisci sinonimi)

// variabile per il nome dell'elemento
$scelta = $_POST['scelta'] ?? null;

$idElementoAggiunto;

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
    // Ora colleghi i valori ai placeholder
    $stmt->execute([
        ':idTassonomia' => $idTassonomia,
        ':idPadre' => $idPadre,
        ':nomeElemento' => $nomeElemento
    ]);

    return $pdo->lastInsertId();
}

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


}

function aggiungiSinonimi($pdo)
{

    // parte 1 - aggiungo il sinonimo alla lista dei nomi 
    $idElemento = $_POST['idElemento'] ?? -1;

    if ($idElemento !== -1) {
        $idPadre = isset($_POST['idPadre']) && $_POST['idPadre'] !== '' ? $_POST['idPadre'] : null;
        $idTassonomia = $_POST['idTassonomia'] ?? null;
        $listaSinonimi = json_decode($_POST['listaSinonimi']) ?? [];


        if(count($listaSinonimi) == 0){
            echo "PORCODIOCANE";
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
    default:
        echo -1; //stampando -1, restituisco un tipo di errore. 
        break;
}




?>