<?php

require('public/fpdf/WriteHTML.php');
require('funciones.php');

class CreditoModel extends Model
{
    private $funciones;

    public function __construct()
    {
        parent::__construct();
        $this->funciones = new Funciones();
    }

    function Consulta_Credito($CEDULA, $NUMERO, $FECHA, $INGRESOS, $instr, $tipo, $dactilar, $TIPO_CONSULTA)
    {

        if (!$this->funciones->validarCedulaEcuatoriana($CEDULA)) {
            $_inci = array(
                "SUCCESS" => false,
                "ERROR_TYPE" => "CEDULA NO VALIDA",
                "ERROR_CODE" => "CEDULA ENVIADA:" . $CEDULA,
                "ERROR_TEXT" => "",
            );
            //Enviar_correo_incidencias($_inci);
            echo json_encode($_inci);
            exit();
        }

        date_default_timezone_set('America/Guayaquil');
        $ID_UNICO = $CEDULA . "_" . date('YmdHis');
        $URL = "SOLIDARIO";
        $GC = $this->Guardar_Cedula($CEDULA, $NUMERO, "", $ID_UNICO, $URL);

        $API = $this->funciones->CONSULTA_API_REG_DEMOGRAFICO(trim($CEDULA), $NUMERO);
        if ($API[0] == 1) {

            if (1 == 1) {

                $cedula_ECrip = $this->funciones->encryptCedula(trim($CEDULA));
                $cedula_ECrip = trim($cedula_ECrip[1]);
                // echo json_encode($cedula_ECrip[1]);
                // exit();

                if ($TIPO_CONSULTA == 1) {
                    $API[1]["SOCIODEMOGRAFICO"][0]["NUMERO_CHAT"] = $NUMERO;
                    $API[1]["SOCIODEMOGRAFICO"][0]["DACTILAR_2"] = $API[1]["SOCIODEMOGRAFICO"][0]["INDIVIDUAL_DACTILAR"];
                    $FECH_NAC = $API[1]["SOCIODEMOGRAFICO"][0]["FECH_NAC"];
                    $date = DateTime::createFromFormat('d/m/Y', $FECH_NAC);
                    $formattedDate = $date->format('Ymd');
                    $SueldoPromedio = "500";
                    $Instruccion = "SECU";
                    $TIPO_IDEN = "CED";
                } else {
                    $API[1]["SOCIODEMOGRAFICO"][0]["NUMERO_CHAT"] = $NUMERO;
                    $API[1]["SOCIODEMOGRAFICO"][0]["DACTILAR_2"] = $dactilar;
                    $formattedDate  = $FECHA;
                    $SueldoPromedio = $INGRESOS;
                    $Instruccion = $instr;
                    $TIPO_IDEN = $tipo;
                }

                $data_mensaje = array(
                    "IdCasaComercialProducto" => 8,
                    "TipoIdentificacion" => $TIPO_IDEN,
                    "IdentificacionCliente" => $cedula_ECrip, // Encriptar la cédula
                    "FechaNacimiento" => $formattedDate,
                    "ValorIngreso" => $SueldoPromedio,
                    "Instruccion" =>  $Instruccion,
                    "Celular" =>  $NUMERO
                );
                $CONSULTA_CREDITO = $this->funciones->CONSULTA_SOLIDARIO($data_mensaje);
                // echo json_encode($CONSULTA_CREDITO);
                // exit();
                $LINK = "https://creditoexpres.com/apicredito/docs/" . $ID_UNICO . ".pdf";


                if ($CONSULTA_CREDITO[0] == 1) {
                    $PDF = $this->funciones->Generar_pdf2($API[1], $ID_UNICO);
                    // $CONSULTA_CREDITO[1]["LINK"] = "https://creditoexpres.com/api/docs/" . $ID_UNICO . ".pdf";
                    $API[1]["CREDITO_SOLIDARIO"] = [$CONSULTA_CREDITO[1]];
                    $API[1]["TERMINOS"] = [array("Link" => $LINK)];

                    $this->Actualizar_Datos($ID_UNICO, $CONSULTA_CREDITO[1]);
                } else {
                    $PDF = $this->funciones->Generar_pdf2($API[1], $ID_UNICO);
                    $LINK = "https://creditoexpres.com/apicredito/docs/" . $ID_UNICO . ".pdf";
                    $API[1]["CREDITO_SOLIDARIO"] = [];
                    $API[1]["TERMINOS"] = [array("Link" => $LINK)];
                }

                $D = $this->Guardar_Datos($CEDULA, $NUMERO, [$API[1]], $ID_UNICO, "SOLIDARIO");
                $SO = [$CONSULTA_CREDITO[1],array("Link" => $LINK)];

                echo json_encode($SO);
                exit();
            } else {
                $_inci = array(
                    "SUCCESS" => false,
                    "ERROR_TYPE" => "API DEMOGRAFICA",
                    "ERROR_CODE" => "",
                    "ERROR_TEXT" => "",
                );
                //Enviar_correo_incidencias($_inci);
                echo json_encode($_inci);
                exit();
            }
        } else {
            $_inci = array(
                "SUCCESS" => false,
                "ERROR_TYPE" => "API DEMOGRAFICA",
                "ERROR_CODE" => $API,
                "ERROR_TEXT" => "",
            );
            //Enviar_correo_incidencias($_inci);
            echo json_encode($_inci);
            exit();
        }


        echo json_encode($API);
        exit();
    }

    function Guardar_Cedula($CEDULA, $NUMERO, $COMERCIO, $ID_UNICO, $URL)
    {

        try {
            $arr = "";
            $query = $this->db->connect()->prepare(
                "INSERT INTO encript_agua
                (
                    cedula,
                    numero,
                    comercio,
                    ID_UNICO,
                    URL_CONSULTA
                )values(:cedula,:numero,:comercio,:ID_UNICO,:URL_CONSULTA)"
            );
            $query->bindParam(":cedula", $CEDULA, PDO::PARAM_STR);
            $query->bindParam(":numero", $NUMERO, PDO::PARAM_STR);
            $query->bindParam(":comercio", $COMERCIO, PDO::PARAM_STR);
            $query->bindParam(":URL_CONSULTA", $URL, PDO::PARAM_STR);
            $query->bindParam(":ID_UNICO", $ID_UNICO, PDO::PARAM_STR);


            if ($query->execute()) {
                $result = $query->fetchAll(PDO::FETCH_ASSOC);
                return [1, "CEDULA GUARDADA"];
            }
        } catch (PDOException $e) {
            $e = $e->getMessage();
            return [0, "INTENTE DE NUEVO"];
        }
    }

    function Guardar_Datos($CEDULA, $NUMERO, $DATOS, $ID_UNICO, $API)
    {

        $IP = $this->getRealIP();
        $DATOS = json_encode($DATOS);
        $ARCHIVO = $ID_UNICO . ".pdf";
        // echo json_encode($DATOS);
        // exit();
        try {
            $query = $this->db->connect()->prepare("INSERT INTO creditossolicitados
        (
            id_unico,
            cedula,
            numero,
            ip,
            api,
            datos,
            archivo
        )values(
            :id_unico,
            :cedula,
            :numero,
            :ip,
            :api,
            :datos,
            :archivo
        
        )");
            $query->bindParam(":id_unico", $ID_UNICO, PDO::PARAM_STR);
            $query->bindParam(":cedula", $CEDULA, PDO::PARAM_STR);
            $query->bindParam(":numero", $NUMERO, PDO::PARAM_STR);
            $query->bindParam(":ip", $IP, PDO::PARAM_STR);
            $query->bindParam(":api", $API, PDO::PARAM_STR);
            $query->bindParam(":datos",  $DATOS, PDO::PARAM_STR);
            $query->bindParam(":archivo",  $ARCHIVO, PDO::PARAM_STR);


            if ($query->execute()) {
                $result = $query->fetchAll(PDO::FETCH_ASSOC);
                return [1, "DATOS GUARDADOS"];
            } else {
                $err = $query->errorInfo();
                return $err;
                return [0, $err];
            }
        } catch (PDOException $e) {
            $e = $e->getMessage();
            return [0, "INTENTE DE NUEVO"];
        }
    }

    function Actualizar_Datos($ID_UNICO, $DATOS_API)
    {

        $IP = $this->getRealIP();
        $DATOS = json_encode($DATOS_API);
        $ARCHIVO = $ID_UNICO . ".pdf";
        // echo json_encode($DATOS);
        // exit();
        try {
            $query = $this->db->connect()->prepare("UPDATE creditossolicitados
                SET datoscredito = :datoscredito
                WHERE 
                    id_unico = :id_unico
                    ");
            $query->bindParam(":id_unico", $ID_UNICO, PDO::PARAM_STR);
            $query->bindParam(":datoscredito", $DATOS, PDO::PARAM_STR);
            if ($query->execute()) {
                $result = $query->fetchAll(PDO::FETCH_ASSOC);
                return [1, "DATOS GUARDADOS"];
            } else {
                $err = $query->errorInfo();
                // return $err;
                return [0, $err];
            }
        } catch (PDOException $e) {
            $e = $e->getMessage();
            return [0, "INTENTE DE NUEVO"];
        }
    }

    function getRealIP()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP']))
            return $_SERVER['HTTP_CLIENT_IP'];

        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
            return $_SERVER['HTTP_X_FORWARDED_FOR'];

        return $_SERVER['REMOTE_ADDR'];
    }
}
