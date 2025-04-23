<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>

  <link href="/bootstrap/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="./creaTassonomia.css">
  <script src="/jquery/jquery-3.7.1.min.js"></script>
  <script src="/bootstrap/bootstrap.bundle.min.js"></script>

</head>
<body>
  <div class="card shadow rounded-4 mb-4">
    <div class="card-body">
      <h2 class="card-title mb-4">Nome dell'elemento</h2>

      <div class="mb-3">
        <label for="nomeElemento" class="form-label">Inserisci il nome dell'elemento</label>
        <input type="text" class="form-control" id="nomeElemento" placeholder="Inserisci il nome dell'elemento" />
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
        <input type="number" class="form-control" id="numeroFigli" min="0" value="1" />
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
      <button id="btn-submit" onclick="salvaElemento()" class="btn btn-primary">Salva elemento</button>
    </div>

</body>
</html>




<script>
    const id_tassonomia = <?php echo json_encode($_POST['id']) ?>;
    const padre = <?php echo json_encode($_POST['padre']) ?>;
</script>

<script src="./creaElemento.js"></script>

