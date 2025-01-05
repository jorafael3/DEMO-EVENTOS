<?php
require_once "libs/database.php";
require_once "libs/controller.php";
require_once "libs/view.php";
require_once "libs/model.php";
require_once "libs/app.php";
require_once "config/config.php";
include_once 'includes/user.php';
include_once 'includes/user_session.php';

$userSession = new User_Session();
$user = new User();

$data = new Database();

if ($data->connect()) {
    //echo "true";
    // $app = new App();
    // if (isset($_SESSION['iniciosesion']) == 1 ) {

        $app = new App();
    // } else if (isset($_POST['emailCm']) && isset($_POST['passCm'])) {
    //     // 
    //     // echo "si";
    //     $usuario = $_POST['emailCm'];
    //     $passForm = $_POST['passCm'];
    //     $res = $user->uss($usuario, $passForm);

    //     if ($res == 1) {
    //         $app = new App();
    //     }else if($res == 0){
    //         $errorlogin = "Verifique Sus credenciales";
    //         include_once 'views/login/login.php';
    //     } else {
    //         include_once 'views/login/login.php';
    //     }

    //     //exit();
    // } else {
    //     include_once 'views/login/login.php';
    // }
} else {
    // include_once 'views/errores/500.php';
    die();
}

// $app = new App();