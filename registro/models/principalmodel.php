<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once 'PHPMailer/src/Exception.php';
require_once 'PHPMailer/src/PHPMailer.php';
require_once 'PHPMailer/src/SMTP.php';
require 'phpqrcode/qrlib.php';

class PrincipalModel extends Model
{

    public function __construct()
    {
        parent::__construct();
    }


    function Guardar_registro($parametros)
    {

        // echo json_encode($parametros);
        // exit();

        $cedula = $parametros["cedula"];
        $nombre = $parametros["nombre"];
        $apellido = $parametros["apellido"];
        $ciudad = $parametros["ciudad"];
        $correo = $parametros["correo"];
        $telefono = $parametros["telefono"];
        $DATA = $parametros["DATA"][0];


        $qrContent = "Cédula: $cedula\nNombre: $nombre\nApellidos: $apellido\nCiudad: $ciudad\nCorreo: $correo\nTeléfono: $telefono";

        // Ruta donde se guardará el QR
        $qrFilePath = "qrcodes/$cedula.png";

        // Crear el código QR
        QRcode::png($qrContent, $qrFilePath, QR_ECLEVEL_L, 10);

        $html_disponible = "  
        <h1 style='text-align: center; color: #007bff;'>¡Felicidades!</h1>
        <div style='text-align: center;'>
            <img style='width: 200px; height: 200px; display: block; margin: 0 auto;' src='cid:qrimage' alt='Código QR' />
        </div>
        <p style='text-align: justify;'>Estimado/a " . $nombre . " " . $apellido . " ,</p>
        <p style='text-align: justify;'>Nos complace informarte que te registraste con éxito para el evento.</p>
        <p style='text-align: justify;'>Evento: " . $DATA["nombre"]  . "</p>
        <p style='text-align: justify;'>Fecha: " . $DATA["fecha"]  . " </p>
        <p style='text-align: justify;'>¡Gracias por utilizar este servicio!</p>
        ";

        $msg = "
        <!DOCTYPE html>
        <html lang='es'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Correo Electrónico de Ejemplo</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-image: url('SV24-LogosLC_Credito.png');
                    background-repeat: no-repeat;
                    background-size: cover;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                h1 {
                    text-align: center;
                    color: #007bff;
                }
                p {
                    text-align: justify;
                }
            </style>
        </head>
        <body style='font-family: Arial, sans-serif; background-color: #2471A3; color: #333; padding: 20px;'>

        <div style='max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
                " . $html_disponible . "
        </div>

        </body>
        </html>
        ";

        $m = new PHPMailer(true);
        $m->CharSet = 'UTF-8';
        $m->isSMTP();
        $m->SMTPAuth = true;
        $m->Host = 'mail.creditoexpres.com';
        $m->Username = 'estadodecredito@creditoexpres.com';
        // $m->Password = 'izfq lqiv kbrc etsx';
        $m->Password = 'S@lvacero2024*';
        $m->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $m->Port = 465;
        $m->setFrom('estadodecredito@creditoexpres.com', 'Registro a evento');
        // $m->addAddress('jalvaradoe3@gmail.com');
        $m->addAddress($correo);
        $m->isHTML(true);
        $titulo = strtoupper('Registro a evento');
        $m->Subject = $titulo;
        $m->AddEmbeddedImage($qrFilePath, 'qrimage');

        $m->Body = $msg;

        // $m->send();
        if ($m->send()) {
            echo json_encode([1, "CORREO ENVIADO"]);
            exit();
        } else {
            echo json_encode([0, "CORREO ENVIADO"]);
            exit();
        }
    }


    function cargar_grafico_linea_horas($parametros)
    {
        $fecha_ini = $parametros["fecha_ini"];
        $fecha_fin = $parametros["fecha_fin"];

        try {
            $items = [];
            $query = $this->db->connect()->prepare("SELECT * from solo_telefonos st 
            where estado  = 1
            and date(fecha_creado) between :fechaini and :fechafin
            ");
            $query->bindParam(":fechaini", $fecha_ini, PDO::PARAM_STR);
            $query->bindParam(":fechafin", $fecha_fin, PDO::PARAM_STR);

            if ($query->execute()) {
                $result = $query->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
                exit();
            } else {
                $err = $query->errorInfo();
                echo json_encode($err);
                exit();
            }
        } catch (PDOException $e) {
            print_r($query->errorInfo());
        }
    }

    function cargar_grafico_por_edad($parametros)
    {
        // $fecha_ini = $parametros["fecha_ini"];
        // $fecha_fin = $parametros["fecha_fin"];

        try {
            $items = [];
            $query = $this->db->connect()->prepare("SELECT 
            CONCAT(FLOOR(edad/5)*5, ' - ', FLOOR(edad/5)*5 + 4) AS rango_edad,
            COUNT(*) AS cantidad_personas
            FROM 
                (
                    SELECT 
                        TIMESTAMPDIFF(YEAR, STR_TO_DATE(cs.fecha_nacimiento, '%d/%m/%Y'), CURDATE()) AS edad
                    FROM 
                        creditos_solicitados cs
                ) AS subconsulta
            GROUP BY 
                FLOOR(edad/5);
            ");
            // $query->bindParam(":fechaini", $fecha_ini, PDO::PARAM_STR);
            // $query->bindParam(":fechafin", $fecha_fin, PDO::PARAM_STR);

            if ($query->execute()) {
                $result = $query->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
                exit();
            } else {
                $err = $query->errorInfo();
                echo json_encode($err);
                exit();
            }
        } catch (PDOException $e) {
            print_r($query->errorInfo());
        }
    }

    function cargar_grafico_por_localidad($parametros)
    {
        // $fecha_ini = $parametros["fecha_ini"];
        // $fecha_fin = $parametros["fecha_fin"];

        try {
            $items = [];
            $query = $this->db->connect()->prepare("SELECT 
                localidad,
                count(localidad)  as cantidad
                from creditos_solicitados cs 
                where estado  = 1
                group by localidad
                order by cantidad desc
            ");
            // $query->bindParam(":fechaini", $fecha_ini, PDO::PARAM_STR);
            // $query->bindParam(":fechafin", $fecha_fin, PDO::PARAM_STR);

            if ($query->execute()) {
                $result = $query->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
                exit();
            } else {
                $err = $query->errorInfo();
                echo json_encode($err);
                exit();
            }
        } catch (PDOException $e) {
            print_r($query->errorInfo());
        }
    }

    function Cargar_Cant_Consultas($param)
    {
        // $fecha_ini = $parametros["fecha_ini"];
        // $fecha_fin = $parametros["fecha_fin"];

        try {
            $fecha_ini = $param["fecha_ini"];
            $fecha_fin = $param["fecha_fin"];

            $SQL = "SELECT 
            id_unico,
            cedula ,
            numero ,
            fecha_consulta ,
            archivo ,
            datos
            FROM creditossolicitados
            WHERE
                DATE(fecha_consulta) BETWEEN :inicio and :fin
                ";

            $query = $this->db->connect()->prepare($SQL);
            $query->bindParam(":inicio", $fecha_ini, PDO::PARAM_STR);
            $query->bindParam(":fin", $fecha_fin, PDO::PARAM_STR);

            if ($query->execute()) {
                $result = $query->fetchAll(PDO::FETCH_ASSOC);
                $res = array(
                    "success" => true,
                    "data" => $result,
                    "sql" => ""
                );
                echo json_encode($res);
                exit();
            } else {
                $err = $query->errorInfo();
                $res = array(
                    "success" => false,
                    "data" => $err,
                    "sql" => ""
                );
                echo json_encode($res);
                exit();
            }
        } catch (PDOException $e) {
            print_r($query->errorInfo());
        }
    }

    function Cargar_Cant_Dispositivo($parametros)
    {
        // $fecha_ini = $parametros["fecha_ini"];
        // $fecha_fin = $parametros["fecha_fin"];

        try {
            $items = [];
            $query = $this->db->connect()->prepare("SELECT 
            dispositivo 
            from creditos_solicitados cs 
            where cs.estado = 1
            union ALL
            select 
            dispositivo 
            from solo_telefonos st
            where estado = 1
            and numero not in(select numero from creditos_solicitados cs where estado= 1)
            ");
            // $query->bindParam(":fechaini", $fecha_ini, PDO::PARAM_STR);
            // $query->bindParam(":fechafin", $fecha_fin, PDO::PARAM_STR);

            if ($query->execute()) {
                $result = $query->fetchAll(PDO::FETCH_ASSOC);
                $ARRA = [];
                foreach ($result as $row) {
                    $disp = $row["dispositivo"];
                    if (preg_match('/\(([^;]+);/', $disp, $matches)) {
                        $tipo_dispositivo = $matches[1];
                        array_push($ARRA, array(
                            "tipo" => $tipo_dispositivo
                        ));
                    } else {
                        array_push($ARRA, array(
                            "tipo" => "NO ENCONTRADO"
                        ));
                    }
                }

                echo json_encode($ARRA);
                exit();
            } else {
                $err = $query->errorInfo();
                echo json_encode($err);
                exit();
            }
        } catch (PDOException $e) {
            print_r($query->errorInfo());
        }
    }
}
