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
import Service from "../../../services/Service"
import FullScreenSpinner from '../../../components/FullScreenSpinner ';
import 'datatables.net';
import Swal from "sweetalert2";


var URL_GUARDAR_NUEVA = "/sucursales/nueva_sucursal"
var URL_CARGAR_SUCURSALES = "/sucursales/cargar_sucursal"
var URL_CARGAR_EMPRESAS = "/sucursales/cargar_sucursal"
var URL_CARGAR_SUCURSALES_TIENDAS = "/sucursales/cargar_sucursal_tiendas"
var URL_CARGAR_SUCURSALES_CAMARAS = "/sucursales/cargar_sucursal_camara"
var URL_ACTUALIZAR_SUCURSAL = "/sucursales/actualizar_sucursal"
var URL_GUARDAR_NUEVA_CAMARA = "/sucursales/nueva_sucursal_camara"
var URL_ACTUALIZAR_SUCURSAL_CAMARA = "/sucursales/actualizar_sucursal_camara"
var URL_CARGAR_ENCARGADOS = "/sucursales/cargar_encargados"


function Nueva_Sucursal() {
    const [visible, setVisible] = useState(false);
    const [visibleCam, setvisibleCam] = useState(false);

    const [SESSION_MASTER, setSESSION_MASTER] = useState('');
    const [SESSION_EMPRESA, setSESSION_EMPRESA] = useState('');
    const [ListaEmpresas, setListaEmpresas] = useState([]);

    const [loading, setLoading] = useState(false);
    const [EsActualizar, setEsActualizar] = useState(0);
    const [EsActualizarCam, setEsActualizarCam] = useState(0);

    const [Encargados, setEncargados] = useState([]);
    const [Tiendas, setTiendas] = useState([]);
    const [EmpresaID, setEmpresaID] = useState();


    const [Tienda, setTienda] = useState('');
    const [Sucursal, setSucursal] = useState('');
    const [Direccion, setDireccion] = useState('');
    const [Telefono, setTelefono] = useState('');
    const [Correo, setCorreo] = useState('');
    const [Encargado, setEncargado] = useState('');
    const [ID, setID] = useState('');
    const [Activo, setActivo] = useState('');


    const [CAMARAID, setCAMARAID] = useState('');
    const [Camara_nombre, setCamara_nombre] = useState('');
    const [Camara_descripcion, setCamara_descripcion] = useState('');
    const [Camara_ubicacion, setCamara_ubicacion] = useState('');

    const Cargar_datos_sesion = async () => {
        const datos = await Service.getCurrentUser();
        console.log('datos: ', datos);
        setSESSION_MASTER(datos.MASTER);
        setSESSION_EMPRESA(datos.EMPRESA);
    }

    const cargar_encargados = async () => {
        const datos = await Service.AjaxSendReceive(URL_CARGAR_ENCARGADOS, []);

        setEncargados(datos.data.data);
        // Llenar_Tabla_Sucursales(datos.data.data)
    }

    const cargar_sucursal_tiendas = async () => {
        const datos = await Service.AjaxSendReceive(URL_CARGAR_SUCURSALES_TIENDAS, []);


        setTiendas(datos.data.data);
        // Llenar_Tabla_Sucursales(datos.data.data)
    }

    const handleSelectChangeTienda = (event) => {
        setTienda(event.target.value); // Actualiza el estado del encargado seleccionado
    };

    const handleSelectChangeEmpresa = (event) => {
        setEmpresaID(event.target.value); // Actualiza el estado del encargado seleccionado
    };

    const handleSelectChange = (event) => {
        setEncargado(event.target.value); // Actualiza el estado del encargado seleccionado
    };

    const OnchangeCheckACtivo = (event) => {
        setActivo(event.target.checked ? 1 : 0); // Actualiza el estado del encargado seleccionado
    };


    const Cargar_Datos = async () => {
        const datos = await Service.AjaxSendReceive(URL_CARGAR_SUCURSALES, []);
        console.log('datos: ', datos);
        setListaEmpresas(datos.data.empresas)
        Llenar_Tabla_Sucursales(datos.data.data)
    }

    const Cargar_Datos_Camara = async (id) => {
        let param = {
            SUCURSAL_ID: id
        }
        setLoading(true);
        const datos = await Service.AjaxSendReceive(URL_CARGAR_SUCURSALES_CAMARAS, param);

        Llenar_Tabla_Sucursales_Camaras(datos.data.data)
        setLoading(false);
    }

    function Llenar_Tabla_Sucursales(data) {
        $('#TABLA_SUCUSALES_SECC').empty();
        let a = `
        <table id='TABLA_SUCUSALES' class='table table-striped nowrap'>
        </table>
        `
        $('#TABLA_SUCUSALES_SECC').append(a);

        let TABLA_ = $('#TABLA_SUCUSALES').DataTable({
            destroy: true,
            data: data,
            dom: 'frtip',
            paging: false,
            info: false,
            // buttons: ['colvis', "excel"],
            // scrollCollapse: true,
            // scrollX: true,
            // columnDefs: [
            //     { width: 100, targets: 0 },
            //     { width: 300, targets: 2 },
            // ],
            order: [[0, "asc"]],
            columns: [
                {
                    "data": "CODIGO",
                    "title": "CODIGO",
                    className: "text-start",
                }, {
                    "data": "SUCURSAL_NOMBRE",
                    "title": "SUCURSAL",
                    className: "text-start",
                }, {
                    "data": "SUCURSAL_ENCARGADO",
                    "title": "ENCARGADO",
                    className: "text-start fs-7",
                }, {
                    "data": "EMPRESA_NOMBRE",
                    "title": "EMPRESA",
                    className: "text-start fs-7",
                }, {
                    "data": "ACTIVA",
                    "title": "ESTADO",
                    className: "text-start fs-7",
                    render: function (x) {
                        if (x == 0) {
                            x = `<span class="badge bg-danger">Inactiva</span>`
                        } else {
                            x = `<span class="badge bg-success">Activa</span>`
                        }
                        return x;
                    }
                }, {
                    data: null,
                    title: "",
                    className: "btn_Detalles text-left", // Centrar la columna "Detalles" y aplicar la clase "btn_detalles"
                    defaultContent: '<button type="button" class="btn_Eliminar btn btn-info text-light btn-sm"><i class="bi bi-ui-checks"></i></button>',
                    orderable: "",
                    width: 20
                }, {
                    data: null,
                    title: "",
                    className: "btn_camaras text-left", // Centrar la columna "Detalles" y aplicar la clase "btn_detalles"
                    defaultContent: '<button type="button" class="btn_camaras btn btn-success text-light btn-sm"><i class="bi bi-camera-video-fill"></i></button>',
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
        $('#TABLA_SUCUSALES').on('click', 'td.btn_Detalles', function (respuesta) {
            var data = TABLA_.row(this).data();
            console.log('data: ', data);

            cargar_encargados();
            setVisible(true);
            setEsActualizar(1);
            setTienda(data.SUCURSAL_ID);
            setSucursal(data.SUCURSAL_NOMBRE);
            setDireccion(data.SUCURSAL_DIRECCION);
            setTelefono(data.SUCURSAL_TELEFONO);
            setCorreo(data.SUCURSAL_NOMBRE);
            setEncargado(data.SUCURSAL_ENCARGADO);
            setID(data.ID);
            setEmpresaID(parseInt(data.EMPRESA_ID));
            setActivo(parseInt(data.ACTIVA));
            // $("#Sucursal").val(data.SUCURSAL_NOMBRE);
        });

        $('#TABLA_SUCUSALES').on('click', 'td.btn_camaras', function (respuesta) {
            var data = TABLA_.row($(this).closest('tr')).data();
            setID(data.ID);

            setTimeout(() => {
                Cargar_Datos_Camara(data.ID);
            }, 100);
        });
    }

    function Llenar_Tabla_Sucursales_Camaras(data) {

        $('#TABLA_SUCUSALES_CAMARAS_SECC').empty();
        let a = `
        <table id='TABLA_SUCUSALES_CAMARAS' class='table table-striped'>
        </table>
        `
        $('#TABLA_SUCUSALES_CAMARAS_SECC').append(a);

        let TABLA_ = $('#TABLA_SUCUSALES_CAMARAS').DataTable({
            destroy: true,
            data: data,
            dom: 'frtip',
            paging: false,
            info: false,
            // buttons: ['colvis', "excel"],
            // scrollCollapse: true,
            // scrollX: true,
            // columnDefs: [
            //     { width: 100, targets: 0 },
            //     { width: 300, targets: 2 },
            // ],
            order: [[0, "asc"]],
            columns: [
                {
                    "data": "CODIGO",
                    "title": "CODIGO",
                    className: "text-start",
                }, {
                    "data": "CAMARA_NOMBRE",
                    "title": "NOMBRE",
                    className: "text-start",
                }, {
                    "data": "CAMARA_UBICACION",
                    "title": "UBICACION",
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

        $('#TABLA_SUCUSALES_CAMARAS').on('click', 'td.btn_Detalles', function (respuesta) {
            var data = TABLA_.row(this).data();

            setvisibleCam(true);
            setEsActualizarCam(1);
            setCAMARAID(data.ID);
            setCamara_nombre(data.CAMARA_NOMBRE);
            setCamara_descripcion(data.CAMARA_DESCRIPCION);
            setCamara_ubicacion(data.CAMARA_UBICACION);
        });

    }


    const Actualizar_Datos = async () => {
        let Empresa = $("#ListaEmpresas").val();
        let Sucursal = $("#Sucursal").val();
        let Direccion = $("#Direccion").val();
        let Telefono = $("#Telefono").val();
        let Correo = $("#Correo").val();
        let Encargado = $("#Encargado").val();

        if (Sucursal.trim() == "") {
            Service.Mensaje("Ingrese un nombre para la sucursal", "", "error");
            return;
        }

        if (Telefono.trim() == "") {
            Service.Mensaje("Ingrese un telefono para la sucursal", "", "error");
            return;
        }

        if (Encargado.trim() == "") {
            Service.Mensaje("Seleccione un encargado para la sucursal", "", "error");
            return;
        }

        let param = {
            EMPRESA_ID: SESSION_MASTER == 1 ? Empresa : SESSION_EMPRESA,
            SUCURSAL_NOMBRE: Sucursal,
            SUCURSAL_DIRECCION: Direccion,
            SUCURSAL_TELEFONO: Telefono,
            SUCURSAL_ENCARGADO: Correo,
            SUCURSAL_ENCARGADO: Encargado,
            ID: ID,
            ACTIVO: Activo
        }
        console.log('param: ', param);

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
                setLoading(true);
                const datos = await Service.AjaxSendReceive(URL_ACTUALIZAR_SUCURSAL, param);
                if (datos.data.success) {
                    Service.Mensaje("Datos Actualizados", "", "success");
                    Cargar_Datos();
                }
                setLoading(false);
            }
        });



        // Service.AjaxSendReceiveData(URL_GUARDAR_NUEVA, param, function (x) {
        //     

        // })
    }

    const Actualizar_Datos_Camara = async () => {
        let Cam_nombre = $("#Cam_nombre").val();
        let Cam_descripcion = $("#Cam_descripcion").val();
        let Cam_ubicacion = $("#Cam_ubicacion").val();


        if (Cam_nombre.trim() == "") {
            Service.Mensaje("Ingrese un nombre para la camara", "", "error");
            return;
        }

        if (Cam_descripcion.trim() == "") {
            Service.Mensaje("Ingrese una descripcion", "", "error");
            return;
        }

        if (Cam_ubicacion.trim() == "") {
            Service.Mensaje("Ingrese la ubicacion", "", "error");
            return;
        }

        let param = {
            SUCURSAL_ID: ID,
            CAMARA_ID: CAMARAID,
            CAMARA_NOMBRE: Cam_nombre,
            CAMARA_DESCRIPCION: Cam_descripcion,
            CAMARA_UBICACION: Cam_ubicacion,
        }


        setLoading(true);
        const datos = await Service.AjaxSendReceive(URL_ACTUALIZAR_SUCURSAL_CAMARA, param);

        if (datos.data.success) {
            Service.Mensaje("Datos Guardados", "", "success");
            Cargar_Datos_Camara(ID);
        } else {
            Service.Mensaje("Error al guardar", datos.message, "success");
        }
        setLoading(false);

        // Service.AjaxSendReceiveData(URL_GUARDAR_NUEVA, param, function (x) {
        //     

        // })
    }


    const Guardar_Datos = async () => {
        let Empresa = $("#ListaEmpresas").val();
        let Sucursal = $("#Sucursal").val();
        let Direccion = $("#Direccion").val();
        let Telefono = $("#Telefono").val();
        let Correo = $("#Correo").val();
        let Encargado = $("#Encargado").val();

        if (Sucursal.trim() == "") {
            Service.Mensaje("Ingrese un nombre para la sucursal", "", "error");
            return;
        }

        if (Telefono.trim() == "") {
            Service.Mensaje("Ingrese un telefono para la sucursal", "", "error");
            return;
        }

        if (Encargado.trim() == "") {
            Service.Mensaje("Seleccione un encargado para la sucursal", "", "error");
            return;
        }

        let param = {
            EMPRESA_ID: SESSION_MASTER == 1 ? Empresa : SESSION_EMPRESA,
            SUCURSAL_ID: "",
            SUCURSAL_NOMBRE: Sucursal,
            SUCURSAL_DIRECCION: Direccion,
            SUCURSAL_TELEFONO: Telefono,
            SUCURSAL_ENCARGADO: Correo,
            SUCURSAL_ENCARGADO: Encargado,
        }
        console.log('param: ', param);

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
                setLoading(true);
                const datos = await Service.AjaxSendReceive(URL_GUARDAR_NUEVA, param);

                if (datos.data.success) {
                    $("#Sucursal").val("");
                    $("#Direccion").val("");
                    $("#Telefono").val("");
                    $("#Correo").val("");
                    $("#Encargado").val("");
                    Service.Mensaje("Datos Guardados", "", "success");
                    Cargar_Datos();
                }
                setLoading(false);

            }
        });



        // Service.AjaxSendReceiveData(URL_GUARDAR_NUEVA, param, function (x) {
        //     

        // })
    }

    const Guardar_Datos_Camara = async () => {
        let Cam_nombre = $("#Cam_nombre").val();
        let Cam_descripcion = $("#Cam_descripcion").val();
        let Cam_ubicacion = $("#Cam_ubicacion").val();


        if (Cam_nombre.trim() == "") {
            Service.Mensaje("Ingrese un nombre para la camara", "", "error");
            return;
        }

        if (Cam_descripcion.trim() == "") {
            Service.Mensaje("Ingrese una descripcion", "", "error");
            return;
        }

        if (Cam_ubicacion.trim() == "") {
            Service.Mensaje("Ingrese la ubicacion", "", "error");
            return;
        }

        let param = {
            SUCURSAL_ID: ID,
            CAMARA_NOMBRE: Cam_nombre,
            CAMARA_DESCRIPCION: Cam_descripcion,
            CAMARA_UBICACION: Cam_ubicacion,
        }

        setLoading(true);
        const datos = await Service.AjaxSendReceive(URL_GUARDAR_NUEVA_CAMARA, param);
        if (datos.data.success) {
            Service.Mensaje("Datos Guardados", "", "success");
            Cargar_Datos_Camara(ID);
        } else {
            Service.Mensaje("Error al guardar", datos.message, "success");
        }
        setLoading(false);

        // Service.AjaxSendReceiveData(URL_GUARDAR_NUEVA, param, function (x) {
        //     

        // })
    }


    useEffect(() => {
        Cargar_Datos(); // Llamamos a la función cuando el componente se monta
        Llenar_Tabla_Sucursales_Camaras([]);
        Cargar_datos_sesion();
    }, []);

    function Limpiar_Campos_Camara() {
        setCAMARAID("");
        setCamara_nombre("");
        setCamara_descripcion("");
        setCamara_ubicacion("");
    }

    function LimpiarCampos() {
        setSucursal("");
        setDireccion("");
        setTelefono("");
        setCorreo("");
        setEncargado("");
        setID("");
    }


    return (
        <>
            <FullScreenSpinner loading={loading} /> {/* Mostrar el spinner cuando loading es true */}
            <CCard className="mb-4">
                <CCardBody>
                    <CRow>
                        <CCol sm={5}>
                            <h4 id="traffic" className="card-title mb-0">
                                Sucursales
                            </h4>
                        </CCol>
                        <CCol sm={7} className="d-none d-md-block">
                            <CButton onClick={() => {
                                setVisible(!visible);
                                setEsActualizar(0);
                                LimpiarCampos();
                                cargar_encargados();
                                cargar_sucursal_tiendas();
                                // console.log('SESSION_EMPRESA: ', SESSION_EMPRESA);
                            }} color="success" className="float-end fw-bold text-light">
                                Nueva Sucursal <CIcon icon={cilPlus} />
                            </CButton>
                        </CCol>
                    </CRow>
                    <hr />
                    <CRow>
                        <CCol sm={12} className='pt-5'>
                            <div className='table-responsive'>
                                <div id='TABLA_SUCUSALES_SECC'>
                                    <table id='TABLA_SUCUSALES' className='table table-striped'>
                                        {/* Aquí va el contenido de la tabla */}
                                    </table>
                                </div>
                            </div>
                        </CCol>
                        <CCol sm={6} className='pt-5'>
                            <CButton onClick={() => {
                                setvisibleCam(true);
                                setEsActualizarCam(0);
                                Limpiar_Campos_Camara();
                            }} color="warning" className='fw-bold text-light btn-sm'>
                                Agregar Camara <i className="bi bi-camera-video fs-6"></i>
                            </CButton>

                            <div className='table-responsive'>
                                <div id='TABLA_SUCUSALES_CAMARAS_SECC'>
                                    <table id='TABLA_SUCUSALES_CAMARAS' className='table table-striped'>
                                    </table>
                                </div>
                            </div>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard >
            <CModal size="lg" backdrop="static" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                    <CModalTitle></CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className='col-12'>
                        {SESSION_MASTER == 1 ? (
                            <div className="mb-3">
                                <CFormLabel htmlFor="Sucursal">Empresa</CFormLabel>
                                <CFormSelect id='ListaEmpresas' value={EmpresaID} onChange={handleSelectChangeEmpresa}>
                                    <option value={SESSION_EMPRESA} className='fw-bold text-success'>EMPRESA ACTUAL</option>
                                    {ListaEmpresas.map((enc) => (
                                        <option className='fw-bold' key={enc.ID} value={enc.ID}>
                                            {enc.EMPRESA_NOMBRE}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </div>
                        ) : ("")}

                        <div className="mb-3">
                            <CFormLabel htmlFor="Sucursal">Sucursal Nombre</CFormLabel>
                            <CFormInput defaultValue={Sucursal} type="text" id="Sucursal" placeholder="" />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="Direccion">Direccion</CFormLabel>
                            <CFormInput defaultValue={Direccion} type="text" id="Direccion" placeholder="" />
                        </div>
                        <div className="row">
                            <div className="col-6 mb-3">
                                <CFormLabel htmlFor="Telefono">Telefono</CFormLabel>
                                <CFormInput defaultValue={Telefono} type="text" id="Telefono" placeholder="" />
                            </div>
                            <div className="col-6 mb-3">
                                <CFormLabel htmlFor="Correo">Correo</CFormLabel>
                                <CFormInput defaultValue={Correo} type="text" id="Correo" placeholder="" />
                            </div>
                        </div>
                        <div className="col-6 mb-3">
                            <CFormLabel htmlFor="Encargado">Encargado</CFormLabel>
                            <CFormInput defaultValue={Encargado} type="text" id="Encargado" placeholder="" />
                        </div>
                        {
                            EsActualizar == 1 ? (
                                <div className="mb-3">
                                    <span className=''></span>
                                    <CFormCheck className='fw-bold fs-4' label="Activo" checked={Activo} onChange={OnchangeCheckACtivo} />
                                </div>
                            ) : ("")}
                        {/* <div className="col-6 mb-3">
                                <CFormLabel htmlFor="Encargado">Encargado</CFormLabel>
                                <CFormSelect id='Encargado' value={Encargado} onChange={handleSelectChange}>
                                    <option value="">Seleccione un encargado</option>
                                    {Encargados.map((enc) => (
                                        <option className='fw-bold' key={enc.ID} value={enc.ID}>
                                            {enc.Nombre} - {enc.Sucursal_nombre}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </div> */}
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Cerrar
                    </CButton>
                    {EsActualizar == 0 ? (
                        <CButton onClick={Guardar_Datos} color="primary" className='fw-bold text-light'>
                            Guardar Datos
                        </CButton>
                    ) : (
                        <CButton onClick={Actualizar_Datos} color="warning" className='fw-bold text-light'>
                            Actualizar cambios
                        </CButton>
                    )}

                </CModalFooter>
            </CModal>

            <CModal size="lg" backdrop="static" visible={visibleCam} onClose={() => setvisibleCam(false)}>
                <CModalHeader>
                    <CModalTitle></CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className='col-12'>
                        <div className="mb-3">
                            <CFormLabel htmlFor="Nombre">Nombre</CFormLabel>
                            <CFormInput defaultValue={Camara_nombre} type="text" id="Cam_nombre" placeholder="" />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="Descripcion">Descripcion</CFormLabel>
                            <CFormInput defaultValue={Camara_descripcion} type="text" id="Cam_descripcion" placeholder="" />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="Ubicacion">Ubicacion</CFormLabel>
                            <CFormInput defaultValue={Camara_ubicacion} type="text" id="Cam_ubicacion" placeholder="" />
                        </div>

                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setvisibleCam(false)}>
                        Cerrar
                    </CButton>
                    {EsActualizarCam == 0 ? (
                        <CButton onClick={Guardar_Datos_Camara} color="primary" className='fw-bold text-light'>
                            Guardar Datos
                        </CButton>
                    ) : (
                        <CButton onClick={Actualizar_Datos_Camara} color="warning" className='fw-bold text-light'>
                            Actualizar cambios
                        </CButton>
                    )}

                </CModalFooter>
            </CModal>

        </>
    )
}

export default Nueva_Sucursal
