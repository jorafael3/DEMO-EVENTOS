import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CFormInput,
    CFormLabel,
    CFormTextarea,
    CFormSelect,
    CSpinner,
    CFormCheck
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cibCcAmex,
    cibCcApplePay,
    cibCcMastercard,
    cibCcPaypal,
    cibCcStripe,
    cibCcVisa,
    cibGoogle,
    cibFacebook,
    cibLinkedin,
    cifBr,
    cifEs,
    cifFr,
    cifIn,
    cifPl,
    cifUs,
    cibTwitter,
    cilCloudDownload,
    cilPeople,
    cilUser,
    cilUserFemale,
    cilPlus,
} from '@coreui/icons'
import React, { useEffect, useState } from 'react'
import $, { data } from 'jquery';
import Service from "../../services/Service"
import FullScreenSpinner from '../../components/FullScreenSpinner ';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'datatables.net'; // DataTables core
import 'datatables.net-buttons'; // Botones
import jszip from 'jszip'; // Para exportar a Excel
import 'datatables.net-buttons/js/buttons.html5.min'; // B
import Swal from "sweetalert2";

var URL_CARGAR_USUARIOS = "/usuarios/cargar_usuarios";
var URL_NUEVO_USUARIO = "/usuarios/nuevo_usuarios";
var URL_ACTUALIZAR_USUARIO = "/usuarios/actualizar_usuarios";
var MASTER = 0;

function Usuarios() {
    const [visible, setVisible] = useState(false);
    const [EsActualizar, setEsActualizar] = useState(0);

    //*** SESION */
    const [SESSION_MASTER, setSESSION_MASTER] = useState('');
    const [SESSION_EMPRESA, setSESSION_EMPRESA] = useState('');

    //********** */
    const [ListaEmpresas, setListaEmpresas] = useState([]);


    const [UsuarioID, setUsuarioID] = useState('');
    const [Usuario, setUsuario] = useState('');
    const [UsuarioNombre, setUsuarioNombre] = useState('');
    const [UsuarioPass, setUsuarioPass] = useState('');
    const [EmpresaID, setEmpresaID] = useState();
    const [Master, setMaster] = useState(0);
    const [Activo, setActivo] = useState('');

    const Cargar_datos_sesion = async () => {
        const datos = await Service.getCurrentUser();

        setSESSION_MASTER(datos.MASTER);
        setSESSION_EMPRESA(datos.EMPRESA);
        MASTER = datos.MASTER;
    }

    const Cargar_usuarios = async () => {
        const datos = await Service.AjaxSendReceive(URL_CARGAR_USUARIOS, []);

        if (datos.data.success) {
            let info = datos.data.data

            setListaEmpresas(datos.data.empresas);
            Tabla_usuarios(info)
        }
    }

    function Tabla_usuarios(data) {
        MASTER
        console.log('MASTER: ', MASTER);
        $('#TABLA_USUARIOS_SECC').empty();
        let a = `
        <table id='TABLA_USUARIOS' class='table table-striped'>
        </table>
        `
        $('#TABLA_USUARIOS_SECC').append(a);

        let TABLA_ = $('#TABLA_USUARIOS').DataTable({
            destroy: true,
            data: data,
            dom: 'Bfrtip',
            paging: false,
            info: false,
            buttons: [
                {
                    text: `<span class"fw-bold text-success">AGREGAR +</span>`,
                    className: 'bg-primary text-light fw-bold',
                    action: function (e, dt, node, config) {
                        setVisible(true);
                        setEsActualizar(0);
                        setMaster(0);
                        setUsuario("");
                        setUsuarioNombre("");
                        setUsuarioPass("");
                    }
                },
                // {
                //     extend: 'excelHtml5',
                //     text: 'Exportar a Excel',
                //     className: 'btn btn-success',
                //     exportOptions: {
                //         columns: ':visible',
                //     },
                // },
            ],
            stateSave: true,
            // scrollCollapse: true,
            // scrollX: true,
            // columnDefs: [
            //     { width: 100, targets: 0 },
            //     { width: 300, targets: 2 },
            // ],
            order: [[0, "asc"]],
            columns: [
                {
                    "data": "FECHA_CREADO",
                    "title": "FECHA",
                    className: "text-start",
                    render: function (x) {
                        // moment.locale('es'); // Configura Moment.js para usar el español
                        x = moment(x).format("YYYY-MM-DD");
                        return x;
                    }
                }, {
                    "data": "USUARIO",
                    "title": "USUARIO",
                    className: "text-start",
                }, {
                    "data": "USUARIO_NOMBRE",
                    "title": "USUARIO_NOMBRE",
                    className: "text-start",
                }, {
                    "data": "MASTER",
                    "title": "MASTER",
                    className: "text-start " + SESSION_MASTER == 1 ? true : "d-none",
                    visible: SESSION_MASTER == 1 ? true : false,
                    render: function (x) {
                        if (x == 0) {
                            x = `<span class="badge bg-danger"></span>`
                        } else {
                            x = `<span class="badge bg-info">Master</span>`
                        }
                        return x;
                    }
                }, {
                    "data": "USUARIO_ACTIVO",
                    "title": "ESTADO",
                    className: "text-start",
                    render: function (x) {
                        if (x == 0) {
                            x = `<span class="badge bg-danger">Inactivo</span>`
                        } else {
                            x = `<span class="badge bg-success">Activo</span>`
                        }
                        return x;
                    },
                }, {
                    "data": "EMPRESA_NOMBRE",
                    "title": "EMPRESA",
                    className: "text-start",
                }, {
                    data: null,
                    title: "",
                    className: "btn_Detalles text-left", // Centrar la columna "Detalles" y aplicar la clase "btn_detalles"
                    defaultContent: '<button type="button" class="btn_Eliminar btn btn-info text-light btn-sm"><i class="bi bi-ui-checks"></i></button>',
                    orderable: "",
                    width: 20
                }

            ],
            "createdRow": function (row, data, index) {
                $('td', row).eq(0).addClass("fw-bold fs-6 ");
                $('td', row).eq(1).addClass("fw-bold fs-6 ");
                $('td', row).eq(2).addClass("fw-bold fs-6 ");
                $('td', row).eq(3).addClass("fw-bold fs-6 ");
                $('td', row).eq(0).addClass("bg-warning bg-opacity-10");

            },

        });

        $('#TABLA_USUARIOS').on('click', 'td.btn_Detalles', function (respuesta) {
            var data = TABLA_.row(this).data();


            setVisible(true);
            setEsActualizar(1);
            setUsuario(data.USUARIO);
            setUsuarioNombre(data.USUARIO_NOMBRE);
            setUsuarioPass(data.EMPRESA_NOMBRE);
            setEmpresaID(data.EMPRESA_ID);
            setActivo(parseInt(data.USUARIO_ACTIVO));
            setMaster(parseInt(data.MASTER));
            setUsuarioID(data.USUARIO_ID);

        });
    }

    const OnchangeCheckACtivo = (event) => {
        setActivo(event.target.checked ? 1 : 0); // Actualiza el estado del encargado seleccionado

    };

    const OnchangeCheckMaster = (event) => {
        setMaster(event.target.checked ? 1 : 0); // Actualiza el estado del encargado seleccionado

    };

    const handleSelectChangeEmpresa = (event) => {
        setEmpresaID(event.target.value); // Actualiza el estado del encargado seleccionado
    };

    const guardar_nuevo_usuario = async () => {
        let USUARIO = $("#Usuario").val();
        let NOMBRE = $("#UsuarioNombre").val();
        let PASS = $("#UsuarioPass").val();
        let EMpresa = $("#ListaEmpresa").val();

        let param = {
            EMPRESA_ID: SESSION_MASTER == 1 ? EMpresa : SESSION_EMPRESA,
            USUARIO: USUARIO,
            NOMBRE: NOMBRE,
            PASS: PASS,
            MASTER: Master
        }


        if (SESSION_MASTER == 1) {
            if (EMpresa.trim() == "") {
                Service.Mensaje("Debe seleccionar una empresa", "", "error");
                return;
            }

        }

        if (NOMBRE.trim() == "") {
            Service.Mensaje("Debe ingresar un nombre de usuario", "", "error");
            return;
        }

        if (PASS.trim() == "") {
            Service.Mensaje("Debe ingresar una contraseña", "", "error");
            return;
        }

        if ((PASS.trim()).length < 5) {
            Service.Mensaje("La contraseña de tener almenos 5 caracteres", "", "error");
            return;
        }


        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                let datos = await Service.AjaxSendReceive(URL_NUEVO_USUARIO, param);

                if (datos.data.success) {
                    let info = datos.data.data

                    Service.Mensaje("Datos Guardados", "", "success");
                    setVisible(false);
                    Cargar_usuarios();
                }
            }
        });




    }

    const Actualizar_usuario = async () => {
        let USUARIO = $("#Usuario").val();
        let NOMBRE = $("#UsuarioNombre").val();
        let PASS = $("#UsuarioPass").val();
        let EMpresa = $("#ListaEmpresa").val();

        let param = {
            USUARIO_ID: UsuarioID,
            EMPRESA_ID: SESSION_MASTER == 1 ? EMpresa : SESSION_EMPRESA,
            USUARIO: USUARIO,
            NOMBRE: NOMBRE,
            PASS: PASS,
            MASTER: Master,
            ACTIVO: Activo
        }

        console.log('param: ', param);

        if (SESSION_MASTER == 1) {
            if (EMpresa.trim() == "") {
                Service.Mensaje("Debe seleccionar una empresa", "", "error");
                return;
            }

        }

        if (NOMBRE.trim() == "") {
            Service.Mensaje("Debe ingresar un nombre de usuario", "", "error");
            return;
        }

        if (PASS.trim() == "") {
            Service.Mensaje("Debe ingresar una contraseña", "", "error");
            return;
        }

        if ((PASS.trim()).length < 5) {
            Service.Mensaje("La contraseña de tener almenos 5 caracteres", "", "error");
            return;
        }


        Swal.fire({
            title: "Estas seguro?",
            text: "Se guardaran los cambios!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, continuar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                let datos = await Service.AjaxSendReceive(URL_ACTUALIZAR_USUARIO, param);

                if (datos.data.success) {
                    let info = datos.data.data

                    Service.Mensaje("Datos Actualizado", "", "success");
                    setVisible(false);
                    Cargar_usuarios();
                }
            }
        });

    }






    useEffect(() => {
        Cargar_datos_sesion();
        Cargar_usuarios(); // Llamamos a la función cuando el componente se monta
    }, []);

    return (
        <>
            <CCard className="mb-4">
                <CCardBody>
                    <CRow>
                        <CCol sm={5}>
                            <h4 id="traffic" className="card-title mb-0">
                                Usuarios
                            </h4>
                        </CCol>
                    </CRow>
                    <hr />
                    <CRow>
                        <CCol sm={12} className='pt-5'>
                            <div className='table-responsive'>
                                <div id='TABLA_USUARIOS_SECC'>
                                    <table id='TABLA_USUARIOS' className='table table-striped'>
                                        {/* Aquí va el contenido de la tabla */}
                                    </table>
                                </div>
                            </div>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard >
            <CModal size="lg" backdrop="static" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                    <CModalTitle>
                        {
                            EsActualizar == 0 ? ("Nuevo Usuario") : ("Actualizar Usuario")
                        }
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className='col-12'>
                        {
                            SESSION_MASTER == 1 ? (
                                <div className="mb-3">
                                    <CFormLabel htmlFor="ListaEmpresa">Empresa</CFormLabel>
                                    <CFormSelect id='ListaEmpresa' value={EmpresaID} onChange={handleSelectChangeEmpresa}>
                                        <option value="">Seleccione una sucursal</option>
                                        {ListaEmpresas.map((enc) => (
                                            <option className='fw-bold' key={enc.ID} value={parseInt(enc.ID)}>
                                                {enc.EMPRESA_NOMBRE}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </div>
                            ) : ("")
                        }
                        <div className="mb-3">
                            <CFormLabel htmlFor="Nombre">Usuario</CFormLabel>
                            <CFormInput disabled={EsActualizar == 1 ? true : false} defaultValue={Usuario} type="text" id="Usuario" placeholder="" />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="Encargado">Nombre</CFormLabel>
                            <CFormInput defaultValue={UsuarioNombre} type="text" id="UsuarioNombre" placeholder="" />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="Direccion">Contraseña</CFormLabel>
                            <CFormInput defaultValue={UsuarioPass} type="password" id="UsuarioPass" placeholder="" />
                        </div>
                        {
                            SESSION_MASTER == 1 ? (
                                <div className="mb-3">
                                    <span className=''>* Podra administar y ver todas las empresas</span>
                                    <CFormCheck className='fw-bold fs-4' label="Master" checked={Master} onChange={OnchangeCheckMaster} />
                                </div>
                            ) : ("")
                        }
                        {
                            EsActualizar == 1 ? (
                                <div className="mb-3">
                                    <span className=''></span>
                                    <CFormCheck className='fw-bold fs-4' label="Activo" checked={Activo} onChange={OnchangeCheckACtivo} />
                                </div>
                            ) : ("")}
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Cerrar
                    </CButton>
                    {EsActualizar == 0 ? (
                        <CButton onClick={guardar_nuevo_usuario} color="primary" className='fw-bold text-light'>
                            Guardar Datos
                        </CButton>
                    ) : (
                        <CButton onClick={Actualizar_usuario} color="warning" className='fw-bold text-light'>
                            Actualizar cambios
                        </CButton>
                    )}

                </CModalFooter>
            </CModal>
        </>
    );
}

export default Usuarios
