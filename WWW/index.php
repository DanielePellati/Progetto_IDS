<!DOCTYPE html>
<html lang="it">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestione Tassonomie</title>
    <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <!-- Bootstrap CSS -->
    <link href="bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.css" rel="stylesheet">
    <!-- jQuery -->
    <script src="jquery/jquery-3.7.1.min.js"></script>
    <script src="/front_end/index.js"></script>
    <link rel="stylesheet" href="/front_end/index.css">
</head>

<body class="bg-light">
    <div class="container my-5">
        <h2 class="mb-4">Gestione Tassonomie</h2>

        <div class="mb-3">
            <a href="/front_end/creaTassonomia.html" class="btn btn-success" id="btn-aggiungi"> Aggiungi Tassonomia</a>
        </div>

        <table id="scelta_tassonomia" class="table table-bordered table-striped text-center">
            <thead class="table-dark">
                <tr>
                    <th>Nome Tassonomia</th>
                    <th>Visualizza</th>
                    <th>Modifica</th>
                    <th>Elimina</th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </div>

    <!-- Bootstrap JS -->
    <script src="bootstrap/bootstrap.bundle.min.js"></script>
</body>

</html>