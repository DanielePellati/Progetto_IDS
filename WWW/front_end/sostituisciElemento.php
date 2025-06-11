<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sostituisci</title>

    <link href="/bootstrap/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="./creaTassonomia.css">
    <script src="/jquery/jquery-3.7.1.min.js"></script>
    <script src="/bootstrap/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
    <!-- icone -->
</head>

<body>

    <!-- Header -->
    <header class="bg-dark text-white py-4 mb-4">
        <div class="container d-flex justify-content-between align-items-center">
            <!-- Pulsanti -->
            <div>
                <a id="indietro" id="indietro" class="conferma btn btn-outline-light me-2">
                    <i class="bi bi-arrow-left"></i> Indietro
                </a>
                <a href="../index.php" id="back_home" class="conferma btn btn-outline-light">
                    <i class="bi bi-house-fill"></i> Home
                </a>
            </div>
            <!-- Titolo -->
            <h1 class="nome_elemento mb-0 text-center flex-grow-1"></h1>
            <!-- Spazio vuoto per bilanciare layout -->
            <div style="width: 120px;"></div>
        </div>
    </header>

    <div class="card shadow rounded-4 mb-4">
        <div class="card-body">
            <h2 class="card-title mb-4">Nome dell'elemento</h2>

            <div class="mb-3">
                <label for="nomeElemento" class="form-label">Inserisci il nome dell'elemento</label>
                <input type="text" class="form-control" id="nomeElemento"
                    placeholder="Inserisci il nome dell'elemento" />
            </div>

            <div class="messageRadice message">
                Campo obbligatorio
            </div>
        </div>
    </div>

    <!-- Form 2: Valori padre/figli -->
    <div class="card shadow rounded-4 mb-4">
        <div class="card-body">
            <h2 class="card-title mb-4">Aggiungi attributi alla radice</h2>

            <div class="mb-3">
                <label for="numeroAttributi" class="form-label">Numero di attributi</label>
                <input type="number" class="form-control" id="numeroAttributi" min="0" value="1" />
            </div>

            <div id="campiAttributi" class="mb-3"></div>
        </div>
    </div>

    <!-- Form 3: Sinonimi -->
    <div class="card shadow rounded-4 mb-4">
        <div class="card-body">
            <h2 class="card-title mb-4">Aggiungi sinonimi alla radice</h2>

            <div class="mb-3">
                <label for="numeroSinonimi" class="form-label">Numero di sinonimi</label>
                <input type="number" class="form-control" id="numeroSinonimi" min="0" value="1" />
            </div>

            <div id="campiSinonimi" class="mb-3"></div>
        </div>
    </div>

    <div class="text-end mb-5">
        <button id="btn-submit" onclick="salvaElemento()" id="salvaElemento" class="btn btn-primary">Salva
            elemento</button>
    </div>

    <script>
        const idElemento = <?php echo json_encode($_POST['idElemento']) ?>;
        const id_tassonomia = <?php echo json_encode($_POST['idTassonomia']) ?>;
        const id_padre = <?php echo json_encode($_POST['idPadre']) ?>;

    </script>

    <script src="./classAttributoElemento.js"></script>
    <script src="./sostituisciElemento.js"></script>


</body>

</html>