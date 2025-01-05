<?php

$url_Guardar_registro = constant('URL') . 'principal/Guardar_registro/';

?>
<script>
    var url_Guardar_registro = '<?php echo $url_Guardar_registro ?>';
    var ARRAY_EVENTO;

    function Cargar() {
        let event = '<?php echo $EVENTOID ?>';
        let array = '<?php echo $EV ?>';
        array = JSON.parse(array)

        array = array.filter(i => i.id == event);
        console.log("🚀 ~ Cargar ~ array:", array)
        ARRAY_EVENTO = array;

        $("#nevent").text(array[0]["nombre"]);
        $("#fevent").text(array[0]["fecha"]);
    }
    Cargar();

    function Guardar_registro() {
        let cedula = $("#cedula").val();
        let nombre = $("#nombre").val();
        let apellido = $("#apellidos").val();
        let ciudad = $("#ciudad").val();
        let correo = $("#correo").val();
        let telefono = $("#telefono").val();


        let param = {
            cedula: cedula,
            nombre: nombre,
            apellido: apellido,
            ciudad: ciudad,
            correo: correo,
            telefono: telefono,
            DATA: ARRAY_EVENTO
        }
        console.log("🚀 ~ Guardar_registro ~ param:", param);


        if (cedula.trim() == "") {
            Mensaje("Ingrese un numero de cédula valido", "", "error");
            return;
        }

        if (nombre.trim() == "") {
            Mensaje("Ingrese un nombre valido", "", "error");
            return;
        }

        if (apellido.trim() == "") {
            Mensaje("Ingrese un apellido valido", "", "error");
            return;
        }

        if (ciudad.trim() == "") {
            Mensaje("Ingrese una ciudad valida", "", "error");
            return;
        }

        if (telefono.trim() == "") {
            Mensaje("Ingrese un telefono valida", "", "error");
            return;
        }

        if (correo.trim() == "") {
            Mensaje("Ingrese un correo valido", "", "error");
            return;
        }

        AjaxSendReceiveData(url_Guardar_registro, param, function(x) {
            console.log("🚀 ~ AjaxSendReceiveData ~ x:", x)

            if (x[0] == 1) {
                Mensaje("Registro exitoso", "se enviara un correo con la informacion necesaria", "success");
                setTimeout(() => {
                    location.reload();
                }, 2000);
                $("#btn_g").prop("disabled", true)
            } else {
                Mensaje("Error", "se enviara un correo con la informacion necesaria", "error");

            }

        })


    }
</script>