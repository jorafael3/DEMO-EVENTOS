<?php

$EV = [
    [
        "id" => 1,
        "nombre" => "Expo Cartimex 2025",
        "fecha" => "2025-03-10",
        "lugar" => "Centro de Convenciones",
        "descripcion" => "Un evento empresarial para conectar negocios.",
        "imagenMapa" => "https://feriadelbaulcci.wordpress.com/wp-content/uploads/2011/04/plano-feria-olivos-cubierto-12.jpg", // Ruta de la imagen del mapa
        "ubicaciones" => [
            [ "id" => "A1", "nombre" => "Stand A1", "precio" => "$200", "estado" => "Disponible", "x" => 50, "y" => 100 ],
            [ "id" => "A2", "nombre" => "Stand A2", "precio" => "$250", "estado" => "Reservado", "x" => 150, "y" => 100 ],
        ],
    ],
    [
        "id" => 2,
        "nombre" => "Tech Innovate 2025",
        "fecha" => "2025-04-20",
        "lugar" => "Parque Tecnológico",
        "descripcion" => "Descubre las últimas innovaciones tecnológicas.",
        "imagenMapa" => "/path/to/mapa_tech_innovate.png", // Ruta de la imagen del mapa
        "ubicaciones" => [
            [ "id" => "B1", "nombre" => "Mesa B1", "precio" => "$150", "estado" => "Disponible", "x" => 80, "y" => 120 ],
            [ "id" => "B2", "nombre" => "Mesa B2", "precio" => "$150", "estado" => "Disponible", "x" => 200, "y" => 120 ],
        ],
    ],
];

$EV = json_encode($EV);

if (isset($_GET["eventid"])) {

    $EVENTOID = $_GET["eventid"];
    if (trim($EVENTOID) != "") {
        
    } else {
        die();
    }
} else {
    die();
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Asistente</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Registro de Asistente</h1>

        <h4>Evento:
            <span class="text-muted" id="nevent"></span>
        </h4>
        <h4>Fecha:
            <span class="text-muted" id="fevent"></span>
        </h4>
        <div class="row">
            <!-- Campo de Cédula -->
            <div class="mb-3 col-md-6">
                <label for="cedula" class="form-label">Cédula</label>
                <input type="text" id="cedula" name="cedula" class="form-control" maxlength="10" pattern="\d{10}" title="Debe contener 10 dígitos numéricos" required>
            </div>
            <!-- Campo de Nombre -->
            <div class="mb-3 col-md-6">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" id="nombre" name="nombre" class="form-control" required>
            </div>
            <div class="mb-3 col-md-6">
                <label for="apellidos" class="form-label">Apellidos</label>
                <input type="text" id="apellidos" name="apellidos" class="form-control" required>
            </div>
            <!-- Campo de Ciudad -->
            <div class="mb-3 col-md-6">
                <label for="ciudad" class="form-label">Ciudad</label>
                <input type="text" id="ciudad" name="ciudad" class="form-control" required>
            </div>

            <div class="mb-3 col-md-6">
                <label for="correo" class="form-label">Correo Electrónico</label>
                <input type="email" id="correo" name="correo" class="form-control" required>
            </div>
            <!-- Campo de Teléfono -->
            <div class="mb-3 col-md-6">
                <label for="telefono" class="form-label">Teléfono</label>
                <input type="tel" id="telefono" name="telefono" class="form-control" pattern="\d{10}" title="Debe contener 10 dígitos numéricos" required>
            </div>
        </div>

        <!-- Botón de Enviar -->
        <button id="btn_g" onclick="Guardar_registro()" class="btn btn-primary w-100">Registrar</button>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
<script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.70/jquery.blockUI.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script src="funciones/functions.js"></script>
<?php require 'funciones/registro_js.php'; ?>


</html>