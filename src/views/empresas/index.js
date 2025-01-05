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
    CBadge,
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
import Service from "../../services/Service"
import FullScreenSpinner from '../../components/FullScreenSpinner ';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import $, { data } from 'jquery';

import 'datatables.net'; // DataTables core
import 'datatables.net-buttons'; // Botones

import jszip from 'jszip'; // Para exportar a Excel
import 'datatables.net-buttons/js/buttons.html5.min'; // B
import ReactDOM from 'react-dom/client';

var URL_CARGAR_EMPRESA = '/empresas/cargar_empresa'
var URL_GUARDAR_NUEVA_EMPRESA = '/empresas/nueva_empresa'
var URL_GUARDAR_ACTUALIZAR_EMPRESA = '/empresas/actualizar_empresa'

function Empresas() {
    const [visible, setVisible] = useState(false);
    const [EsActualizar, setEsActualizar] = useState(0);
    const [loading, setLoading] = useState(false);

    const [EmpresaID, setEmpresaID] = useState('');
    const [Codigo, setCodigo] = useState('');
    const [Fecha, setFecha] = useState('');
    const [Nombre, setNombre] = useState('');
    const [Direccion, setDireccion] = useState('');
    const [Telefono, setTelefono] = useState('');
    const [Correo, setCorreo] = useState('');
    const [Encargado, setEncargado] = useState('');
    const [EmpresaActivo, setEmpresaActivo] = useState('');

    const [CANTIDAD_EMP, setCANTIDAD_EMP] = useState('');


    useEffect(() => {
        cargar_empresa();
    }, []);


    const OnchangeCheckACtivo = (event) => {
        setEmpresaActivo(event.target.checked ? 1 : 0); // Actualiza el estado del encargado seleccionado
        console.log('event.target.value: ', event.target.checked);
    };

    const cargar_empresa = async () => {

        const datos = await Service.AjaxSendReceive(URL_CARGAR_EMPRESA, []);
        console.log('datos: ', datos);
        let DATOS = datos.data.data
        setCANTIDAD_EMP(DATOS.length);
        Llenar_Tabla_Empresas(datos.data.data);
        
    }

    function Llenar_Tabla_Empresas(data) {
        $('#TABLA_EMPRESA_SECC').empty();
        let a = `
        <table id='TABLA_EMPRESAS' class='table table-striped nowrap'>
        </table>
        `
        $('#TABLA_EMPRESA_SECC').append(a);

        let TABLA_ = $('#TABLA_EMPRESAS').DataTable({
            destroy: true,
            data: data,
            dom: 'Bfrtip',
            paging: false,
            info: false,
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Exportar a Excel',
                    className: 'btn btn-success',
                    exportOptions: {
                        columns: ':visible',
                    },
                },
            ],            // scrollCollapse: true,
            // scrollX: true,
            // columnDefs: [
            //     { width: 100, targets: 0 },
            //     { width: 300, targets: 2 },
            // ],

            order: [[0, "asc"]],
            columns: [
                {
                    "data": "EMPRESA_CODIGO",
                    "title": "CODIGO",
                    className: "text-start",
                }, {
                    "data": "EMPRESA_NOMBRE",
                    "title": "EMPRESA",
                    className: "text-start",
                }, {
                    "data": "EMPRESA_ENCARGADO",
                    "title": "ENCARGADO",
                    className: "text-start fs-7",
                }, {
                    "data": "ACTIVO",
                    "title": "ESTADO",
                    className: "text-start fs-7",
                    render: function (x) {

                        x = `<span class="badge bg-success">Activo</span>`
                        if (x == 0) {
                            x = `<span class="badge bg-danger">Inactivo</span>`
                        }
                        return x
                    }
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
        $('#TABLA_EMPRESAS').on('click', 'td.btn_Detalles', function (respuesta) {
            var data = TABLA_.row(this).data();
            console.log('data: ', data);

            setVisible(true);
            setEsActualizar(1);
            setFecha(data.FECHA_CREADO);
            setCodigo(data.EMPRESA_CODIGO);
            setNombre(data.EMPRESA_NOMBRE);
            setDireccion(data.EMPRESA_DIRECCION);
            setTelefono(data.EMPRESA_TELEFONO);
            setCorreo(data.EMPRESA_CORREO);
            setEncargado(data.EMPRESA_ENCARGADO);
            setEmpresaID(data.ID);
            setEmpresaActivo(parseInt(data.ACTIVO) == 1 ? true : false);
            $("#Sucursal").val(data.SUCURSAL_NOMBRE);
        });

    }

    const Guardar_Datos = async () => {
        let Nombre = $("#Nombre").val();
        let Direccion = $("#Direccion").val();
        let Telefono = $("#Telefono").val();
        let Correo = $("#Correo").val();
        let Encargado = $("#Encargado").val();

        let param = {
            EMPRESA_NOMBRE: Nombre,
            EMPRESA_DIRECCION: Direccion,
            EMPRESA_TELEFONO: Telefono,
            EMPRESA_CORREO: Correo,
            EMPRESA_ENCARGADO: Encargado,
        }
        console.log('param: ', param);



        setLoading(true);
        const datos = await Service.AjaxSendReceive(URL_GUARDAR_NUEVA_EMPRESA, param);
        console.log('datos: ', datos);

        // if (datos.data.success) {
        //     $("#EMPRESA").val("");
        //     $("#Direccion").val("");
        //     $("#Telefono").val("");
        //     $("#Correo").val("");
        //     $("#Encargado").val("");
        //     Service.Mensaje("Datos Guardados", "", "success");
        //     Cargar_Datos();
        // }
        setLoading(false);

    }

    const Actualizar_Datos = async () => {
        let Nombre = $("#Nombre").val();
        let Direccion = $("#Direccion").val();
        let Telefono = $("#Telefono").val();
        let Correo = $("#Correo").val();
        let Encargado = $("#Encargado").val();

        let param = {
            EMPRESA_ID: EmpresaID,
            EMPRESA_NOMBRE: Nombre,
            EMPRESA_DIRECCION: Direccion,
            EMPRESA_TELEFONO: Telefono,
            EMPRESA_CORREO: Correo,
            EMPRESA_ENCARGADO: Encargado,
            EMPRESA_ESTADO: EmpresaActivo
        }
        console.log('param: ', param);

        setLoading(true);
        const datos = await Service.AjaxSendReceive(URL_GUARDAR_ACTUALIZAR_EMPRESA, param);
        console.log('datos: ', datos);

        // if (datos.data.success) {
        //     $("#EMPRESA").val("");
        //     $("#Direccion").val("");
        //     $("#Telefono").val("");
        //     $("#Correo").val("");
        //     $("#Encargado").val("");
        //     Service.Mensaje("Datos Guardados", "", "success");
        //     Cargar_Datos();
        // }
        setLoading(false);

    }


    return (
        <>
            <CRow>
                <CCol xs={12} lg={6} xxl={3}>
                    <div className="card card-flush h-md-50 mb-xl-10">
                        <div className="card-body d-flex flex-column justify-content-end pe-0">
                            <h3  className='text-dark'>{CANTIDAD_EMP}</h3>
                            <span className='text-muted fw-bold'>EMPRESAS</span>
                        </div>
                    </div>
                </CCol>
                <CCol xs={12} lg={6} xxl={3}>
                    <div className="card card-flush h-md-50 mb-xl-10">
                        <div className="card-body d-flex flex-column justify-content-end pe-0">
                            <h3 id='CANT_INCIDENCIAS' className='text-dark'></h3>
                            <span className='text-muted fw-bold'>CAMARAS</span>
                        </div>
                    </div>
                </CCol>
                <CCol xs={12} lg={6} xxl={3}>
                    <div className="card card-flush h-md-50 mb-xl-10">
                        <div className="card-body d-flex flex-column justify-content-end pe-0">
                            <h3 id='CANT_INCIDENCIAS' className='text-dark'></h3>
                            <span className='text-muted fw-bold'>SUCURSALES</span>
                        </div>
                    </div>
                </CCol>
            </CRow>
            <CCard className="mb-4 mt-2">
                <CCardBody>
                    <CRow>
                        <CCol sm={5}>
                            <h4 id="traffic" className="card-title mb-0">
                                Empresas
                            </h4>
                        </CCol>
                        <CCol sm={7} className="d-none d-md-block">
                            <CButton onClick={() => {
                                setVisible(!visible);
                                setEsActualizar(0);
                                // LimpiarCampos();
                                // cargar_encargados();
                                // cargar_EMPRESA_tiendas();
                            }} color="success" className="float-end fw-bold text-light">
                                Nueva Empresa <CIcon icon={cilPlus} />
                            </CButton>
                        </CCol>
                    </CRow>
                    <hr />
                    <CRow>
                        <CCol sm={12} className='pt-5'>
                            <div className='table-responsive'>
                                <div id='TABLA_EMPRESA_SECC'>
                                    <table id='TABLA_EMPRESAS' className='table table-striped nowrap'>
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
                            EsActualizar == 0 ? ("Nueva Empresa") : ("Actualizar Empresa")
                        }
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className='col-12'>
                        {
                            EsActualizar == 1 ? (
                                <div className="mb-3">
                                    <CFormLabel htmlFor="Codigo">Codigo</CFormLabel>
                                    <CFormInput disabled defaultValue={Codigo} type="text" id="Codigo" placeholder="" />
                                </div>
                            ) : ("")
                        }

                        <div className="mb-3">
                            <CFormLabel htmlFor="Nombre">Nombre</CFormLabel>
                            <CFormInput defaultValue={Nombre} type="text" id="Nombre" placeholder="" />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="Encargado">Encargado</CFormLabel>
                            <CFormInput defaultValue={Encargado} type="text" id="Encargado" placeholder="" />
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
                        {
                            EsActualizar == 1 ? (
                                <div className="mb-3">
                                    <CFormCheck label="Activo" checked={EmpresaActivo} onChange={OnchangeCheckACtivo} />
                                </div>
                            ) : ("")
                        }


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

        </>
    );
}

export default Empresas
