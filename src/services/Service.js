import axios from "axios";
import $, { data } from 'jquery';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

let dev = 1;

let http = "http";
let url = "10.5.0.238";
let port = "8080"
let dir = "control_camaras_back"

if (dev == 0) {


}

const API_URL = http + "://" + url + ":" + port + "/" + dir; // Cambia esto a la URL de tu API

// Función para manejar el login
const login = async (user, password) => {
    // const navigate = useNavigate();
    try {
        let res;

        if (user == "expositor" && password == "12345") {
            res = {
                user: user,
                isAuthenticated: true,
                ACTIVO: 1,
                TIPO: 1,
                TEXTO: "EXPOSITOR"
            }

            localStorage.setItem("DATOS_SESION", JSON.stringify(res));
            return [1, res];
        } else {
            return 0;
        }
        // const response = await axios.post(`${API_URL}/login/Autenticacion`, {
        //     user,
        //     password,
        // });


        // if (response.data.data.SUCCESS == 1) {
        //     // Mensaje("")
        //     // Guardar el token en el almacenamiento local o en cookies
        //     localStorage.setItem("DATOS_SESION", JSON.stringify(response.data.data));
        //     // window.location.reload()
        //     // navigate('/dashboard');
        //     return [1, response.data.data];
        // } else {
        //     Mensaje(response.data.message, "", "error");
        //     return 0;
        // }
    } catch (error) {

        throw error;
    }
};

function AjaxSendReceiveDatalogin(param, callback) {
    // let DATOS_SESION = fun.GET_DATOS_SESION();
    let token = "My0Ua8GDgEMPbpTZhiOEwjrzy5s4r9GFBOO7RWgwDA1kP2ZixULX0GpVHh99erfm";
    if (param.length == 0) {
        param = {
            TOKEN: token,
        }
    } else {
        param.TOKEN = token;
    }
    $.ajax({
        url: API_URL + "/login/Autenticacion",
        method: 'POST',
        dataType: 'json',
        data: {
            param
        },
        success: function (data) {
            callback(data)
        },
        error: function (error) {

        }
    });
}

const AjaxSendReceive = async (controller, param) => {
    let DATOS_SESION = getCurrentUser();
    param.DATOS_SESION = DATOS_SESION;

    // const navigate = useNavigate();
    try {
        const response = await axios.post(`${API_URL}${controller}`, param);
        if (response.data.success == false) {
            Mensaje("Ha ocurrido un error", response.data.message, "error")
        }
        return response;
    } catch (error) {

        Mensaje("Ha ocurrido un error", error, "error")
        // throw error;
    }
};

function AjaxSendReceiveData(controller, param, callback) {
    // let DATOS_SESION = fun.GET_DATOS_SESION();
    let token = "My0Ua8GDgEMPbpTZhiOEwjrzy5s4r9GFBOO7RWgwDA1kP2ZixULX0GpVHh99erfm";
    if (param.length == 0) {
        param = {
            TOKEN: token,
        }
    } else {
        param.TOKEN = token;
    }
    $.ajax({
        url: API_URL + controller,
        method: 'POST',
        dataType: 'json',
        data: {
            param
        },
        success: function (data) {
            callback(data)
        },
        error: function (error) {

        }
    });
}

// Función para manejar el logout
const logout = () => {
    // const navigate = useNavigate();
    localStorage.removeItem("DATOS_SESION");
    window.location.reload()

    // navigate('/login');
};

// Función para obtener el usuario actual
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("DATOS_SESION"));
};

function Mensaje(title, text, icon) {
    MySwal.fire({
        title: title,
        text: text,
        icon: icon
    });
}

// Puedes agregar más funciones para otras consultas a la base de datos

export default {
    login,
    logout,
    getCurrentUser,
    AjaxSendReceiveDatalogin,
    Mensaje,
    AjaxSendReceiveData,
    AjaxSendReceive
};