<?php


class credito extends Controller
{

    function __construct()
    {

        parent::__construct();
        //$this->view->render('principal/index');
        //echo "nuevo controlaodr";
    }

    function render()
    {
        die();
    }


    function solidario()
    {

        if (isset($_GET["cedula"]) && isset($_GET["numero"]) && isset($_GET["key"])) {
            $CEDULA = trim($_GET["cedula"]);
            $NUMERO = trim($_GET["numero"]);
            $key = trim($_GET["key"]);
            $FECHA = "";
            $INGRESOS = "";
            $instr = "";
            $tipo = "";
            $dactilar = "";
            
            $KEY = "7uXvhfOAUNbmfiKnzVlSq4uJRj0tx5G2";
            // echo json_encode($NUMERO);
            // exit();
            if ($KEY == $key) {
                if ($CEDULA != null || $CEDULA != "" || $NUMERO != null || $NUMERO != "") {

                    $longitud = strlen($CEDULA);
                    $longitud_telefono = strlen($NUMERO);
                    if ($longitud == 9) {
                        $CEDULA = "0" . $CEDULA;
                    }
                    // Principal($CEDULA, $NUMERO, $TERMINOS);
                    $function = $this->model->Consulta_Credito($CEDULA, $NUMERO, $FECHA, $INGRESOS, $instr, $tipo, $dactilar,1);
                } else {
                    $res = array(
                        "SUCCESS" => "0",
                        "MENSAJE" => "CEDULA NO VALIDA"
                    );

                    echo json_encode($res);
                    exit();
                }
            } else {
                $res = array(
                    "SUCCESS" => "0",
                    "MENSAJE" => "LOS PARAMETROS NO SON VALIDOS"
                );
                echo json_encode($res);
                exit();
            }
        } else {
            $res = array(
                "SUCCESS" => "0",
                "MENSAJE" => "URL NO VALIDA, FALTAN PARAMETROS"
            );
            echo json_encode($res);
            exit();
        }
    }

    function solidario2()
    {

        if (
            isset($_GET["cedula"]) && isset($_GET["numero"])
            && isset($_GET["fecha"])
            && isset($_GET["ingresos"])
            && isset($_GET["instr"])
            && isset($_GET["tipo"])
            && isset($_GET["dactilar"])
        ) {
            $CEDULA = trim($_GET["cedula"]);
            $NUMERO = trim($_GET["numero"]);
            $FECHA = trim($_GET["fecha"]);
            $INGRESOS = trim($_GET["ingresos"]);
            $instr = trim($_GET["instr"]);
            $tipo = trim($_GET["tipo"]);
            $dactilar = trim($_GET["dactilar"]);
            $KEY = "7uXvhfOAUNbmfiKnzVlSq4uJRj0tx5G2";

            if ($KEY == $KEY) {
                if ($CEDULA != null || $CEDULA != "" || $NUMERO != null || $NUMERO != "") {

                    $longitud = strlen($CEDULA);
                    $longitud_telefono = strlen($NUMERO);
                    if ($longitud == 9) {
                        $CEDULA = "0" . $CEDULA;
                    }
                    // Principal($CEDULA, $NUMERO, $TERMINOS);
                    $function = $this->model->Consulta_Credito($CEDULA, $NUMERO, $FECHA, $INGRESOS, $instr, $tipo, $dactilar,0);
                } else {
                    $res = array(
                        "SUCCESS" => "0",
                        "MENSAJE" => "CEDULA NO VALIDA"
                    );

                    echo json_encode($res);
                    exit();
                }
            } else {
                $res = array(
                    "SUCCESS" => "0",
                    "MENSAJE" => "LOS PARAMETROS NO SON VALIDOS"
                );
                echo json_encode($res);
                exit();
            }
        } else {
            $res = array(
                "SUCCESS" => "0",
                "MENSAJE" => "URL NO VALIDA, FALTAN PARAMETROS"
            );
            echo json_encode($res);
            exit();
        }
    }
}
