<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="creaTassonomia.css">
    <!-- Bootstrap CSS -->
    <link href="/bootstrap/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
</head>

<body>
    <!-- Header -->
    <header class="bg-dark text-white py-4 mb-4">
        <div class="container d-flex justify-content-between align-items-center">
            <!-- Pulsanti -->
            <div>
                <a id="home" class="btn btn-outline-light esci">
                    <i class="bi bi-house-fill"></i> Home
                </a>
            </div>
            <!-- Titolo -->
            <h1 class="nome_elemento mb-0 text-center flex-grow-1"></h1>
            <!-- Spazio vuoto per bilanciare layout -->
            <div style="width: 120px;"></div>
        </div>
    </header>

  <div class="container mt-5">

    <!-- Form 1: Tassonomia -->
    <div class="card shadow rounded-4 mb-4">
      <div class="card-body">
        <h2 class="card-title mb-4">Modifica tassonomia</h2>

        <form id="form-tassonomia">
          <div class="mb-3">
            <label for="nomeTassonomia" class="form-label">Nome della Tassonomia</label>
            <input type="text" class="form-control" id="nomeTassonomia" placeholder="Inserisci il nome" required />
          </div>
        </form>

        <div class="mb-3">
          <label for="descTassonomia" class="form-label">Descrizione della Tassonomia</label>
          <input type="text" class="form-control" id="descTassonomia" placeholder="Inserisci la descrizione" />
        </div>
      </div>
    <div class="text-end mb-5">
      <button id="btn-submit" onclick="salvaModifiche()" style = "margin-right: 5px" class="btn btn-primary">Salva modifiche</button>
    </div>
  </div>
  </div>
</body>

<script>
    const idTassonomia = <?php echo $_POST['idTassonomia'] ?? null ?>
</script>
<script src="../jquery/jquery-3.7.1.min.js"></script>
<script src="./modificaInfoTassonomia.js"></script>

</html>