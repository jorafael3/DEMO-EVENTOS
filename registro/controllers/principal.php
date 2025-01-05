<?php


class Principal extends Controller
{

    function __construct()
    {

        parent::__construct();
        //$this->view->render('principal/index');
        //echo "nuevo controlaodr";
    }

    function render()
    {
        $this->view->render('principal/registro');
        // die();
    }


    function Guardar_registro()
    {
        $array = json_decode(file_get_contents("php://input"), true);
        $function = $this->model->Guardar_registro($array);
    }











    function cargar_grafico_linea_horas()
    {
        $array = json_decode(file_get_contents("php://input"), true);
        $function = $this->model->cargar_grafico_linea_horas($array);
    }

    function cargar_grafico_por_edad()
    {
        $array = json_decode(file_get_contents("php://input"), true);
        $function = $this->model->cargar_grafico_por_edad($array);
    }

    function cargar_grafico_por_localidad()
    {
        $array = json_decode(file_get_contents("php://input"), true);
        $function = $this->model->cargar_grafico_por_localidad($array);
    }

    function Cargar_Cant_Consultas()
    {
        $array = json_decode(file_get_contents("php://input"), true);
        $function = $this->model->Cargar_Cant_Consultas($array);
    }

    function Cargar_Cant_Dispositivo()
    {
        $array = json_decode(file_get_contents("php://input"), true);
        $function = $this->model->Cargar_Cant_Dispositivo($array);
    }
}
